// 图像生成API服务

export interface ImageGenerationRequest {
  prompt: string
  input_image: string // base64编码的图片
}

export interface ImageGenerationResponse {
  id: string
  polling_url: string
}

export interface PollingResponse {
  status: 'Processing' | 'Ready' | 'Error' | 'Failed'
  result?: {
    sample: string // 生成的图片URL
  }
  error?: string
}

// 安全的localStorage访问
const getLocalStorage = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key)
  }
  return null
}

const setLocalStorage = (key: string, value: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value)
  }
}

export class ImageGenerationAPI {
  private apiKey: string

  constructor() {
    this.apiKey = getLocalStorage('BFL_API_KEY') || ''
  }

  // 更新API密钥
  updateApiKey(apiKey: string) {
    this.apiKey = apiKey
    setLocalStorage('BFL_API_KEY', apiKey)
  }

  // 检查API密钥是否已设置
  isApiKeySet(): boolean {
    return !!this.apiKey
  }

  // 发送图像生成请求到Next.js后端API
  async generateImage(prompt: string, imageBase64: string): Promise<ImageGenerationResponse> {
    if (!this.apiKey) {
      throw new Error('API密钥未设置，请在设置中配置BFL API密钥')
    }

    console.log('发送图像生成请求到后端API')
    
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
        body: JSON.stringify({
          prompt: prompt,
          input_image: imageBase64,
        }),
      })

      console.log('后端API响应状态:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('后端API错误:', errorData)
        throw new Error(errorData.error || `API请求失败: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('后端API成功响应:', data)
      return data
    } catch (error) {
      console.error('图像生成请求失败:', error)
      throw error
    }
  }

  // 轮询获取结果
  async pollResult(pollingUrl: string, requestId: string): Promise<PollingResponse> {
    if (!this.apiKey) {
      throw new Error('API密钥未设置')
    }

    console.log('开始轮询结果:', { pollingUrl, requestId })

    try {
      const response = await fetch(`/api/generate-image?pollingUrl=${encodeURIComponent(pollingUrl)}&requestId=${encodeURIComponent(requestId)}`, {
        method: 'GET',
        headers: {
          'x-api-key': this.apiKey,
        },
      })

      console.log('轮询响应状态:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('轮询错误:', errorData)
        throw new Error(errorData.error || `轮询请求失败: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('轮询成功响应:', data)
      return data
    } catch (error) {
      console.error('轮询结果失败:', error)
      throw error
    }
  }

  // 等待图像生成完成
  async waitForCompletion(pollingUrl: string, requestId: string, onProgress?: (status: string) => void): Promise<string> {
    const maxAttempts = 120 // 最多等待60秒 (120 * 0.5秒)
    let attempts = 0

    while (attempts < maxAttempts) {
      try {
        const result = await this.pollResult(pollingUrl, requestId)
        
        onProgress?.(result.status)

        if (result.status === 'Ready') {
          return result.result?.sample || ''
        } else if (result.status === 'Error' || result.status === 'Failed') {
          throw new Error(`图像生成失败: ${result.error || '未知错误'}`)
        }

        // 等待0.5秒后再次轮询
        await new Promise(resolve => setTimeout(resolve, 500))
        attempts++
      } catch (error) {
        console.error('轮询过程中出错:', error)
        throw error
      }
    }

    throw new Error('图像生成超时')
  }
}

// 创建全局实例
export const imageGenerationAPI = new ImageGenerationAPI()
