import { NextRequest, NextResponse } from 'next/server'

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

// 发送图像生成请求到BFL API
async function generateImage(prompt: string, imageBase64: string, apiKey: string): Promise<ImageGenerationResponse> {
  console.log('开始发送图像生成请求到BFL API')
  
  const response = await fetch('https://api.bfl.ai/v1/flux-kontext-pro', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'x-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: prompt,
      input_image: imageBase64,
      safety_tolerance: 6
    }),
  })

  console.log('BFL API响应状态:', response.status)

  if (!response.ok) {
    const errorText = await response.text()
    console.error('BFL API错误响应:', errorText)
    throw new Error(`BFL API请求失败: ${response.status} ${response.statusText} - ${errorText}`)
  }

  const data = await response.json()
  console.log('BFL API成功响应:', { id: data.id, polling_url: data.polling_url })
  return data
}

// 轮询获取结果
async function pollResult(pollingUrl: string, requestId: string, apiKey: string): Promise<PollingResponse> {
  console.log('开始轮询结果:', { pollingUrl, requestId })
  
  // 直接使用BFL API返回的完整polling_url，不需要额外添加id参数
  const response = await fetch(pollingUrl, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'x-key': apiKey,
    },
  })

  console.log('轮询响应状态:', response.status)

  if (!response.ok) {
    const errorText = await response.text()
    console.error('轮询错误响应:', errorText)
    throw new Error(`轮询请求失败: ${response.status} ${response.statusText} - ${errorText}`)
  }

  const data = await response.json()
  console.log('轮询成功响应:', data)
  return data
}

// POST /api/generate-image - 开始图像生成
export async function POST(request: NextRequest) {
  try {
    console.log('收到POST请求到 /api/generate-image')
    
    const body: ImageGenerationRequest = await request.json()
    const { prompt, input_image } = body

    console.log('请求参数:', { 
      prompt: prompt?.substring(0, 50) + '...', 
      imageLength: input_image?.length || 0 
    })

    // 从请求头获取API密钥
    const apiKey = request.headers.get('x-api-key')
    
    if (!apiKey) {
      console.error('缺少API密钥')
      return NextResponse.json(
        { error: '缺少API密钥' },
        { status: 400 }
      )
    }

    if (!prompt || !input_image) {
      console.error('缺少必要参数')
      return NextResponse.json(
        { error: '缺少必要参数: prompt 或 input_image' },
        { status: 400 }
      )
    }

    const result = await generateImage(prompt, input_image, apiKey)
    
    console.log('图像生成请求成功:', result)
    return NextResponse.json(result)
  } catch (error) {
    console.error('图像生成请求失败:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    )
  }
}

// GET /api/generate-image - 轮询生成结果
export async function GET(request: NextRequest) {
  try {
    console.log('收到GET请求到 /api/generate-image')
    
    const { searchParams } = new URL(request.url)
    const pollingUrl = searchParams.get('pollingUrl')
    const requestId = searchParams.get('requestId')
    const apiKey = request.headers.get('x-api-key')

    console.log('GET请求参数:', { pollingUrl, requestId, hasApiKey: !!apiKey })

    if (!pollingUrl || !requestId || !apiKey) {
      console.error('缺少必要参数')
      return NextResponse.json(
        { error: '缺少必要参数: pollingUrl, requestId 或 API密钥' },
        { status: 400 }
      )
    }

    const result = await pollResult(pollingUrl, requestId, apiKey)
    
    console.log('轮询结果成功:', result)
    return NextResponse.json(result)
  } catch (error) {
    console.error('轮询结果失败:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    )
  }
}
