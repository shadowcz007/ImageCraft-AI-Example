'use client'

import { useState, useEffect } from 'react'
import Header from './Header'
import AvatarOutfitComposer from './AvatarOutfitComposer'
import PromptInteraction from './PromptInteraction'
import GeneratedImage from './GeneratedImage'
import ApiKeySettings from './ApiKeySettings'
import { imageGenerationAPI } from '@/lib/imageGenerationApi'

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

// 缓存数据结构
interface CacheData {
  uploadedImageBase64: string
  imageName: string
  generatedImageUrl: string
  finalPrompt: string
  timestamp: number
}

// 缓存键名
const CACHE_KEYS = {
  UPLOADED_IMAGE: 'imagecraft_uploaded_image',
  IMAGE_NAME: 'imagecraft_image_name',
  GENERATED_IMAGE: 'imagecraft_generated_image',
  FINAL_PROMPT: 'imagecraft_final_prompt',
  CACHE_TIMESTAMP: 'imagecraft_cache_timestamp'
}

export default function ImageCraftApp() {
  const [prompt, setPrompt] = useState('')
  const [finalPrompt, setFinalPrompt] = useState('generate a runway show image of the model wearing the outfit.')
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [imageBase64, setImageBase64] = useState<string>('')
  const [imageName, setImageName] = useState<string>('')
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStatus, setGenerationStatus] = useState('')
  const [showApiSettings, setShowApiSettings] = useState(false)
  const [hasValidCache, setHasValidCache] = useState(false)

  // 检查API密钥是否已设置
  useEffect(() => {
    const apiKey = getLocalStorage('BFL_API_KEY')
    if (!apiKey) {
      setShowApiSettings(true)
    }
  }, [])

  // 加载缓存数据
  useEffect(() => {
    const loadCachedData = () => {
      try {
        const cachedImageBase64 = getLocalStorage(CACHE_KEYS.UPLOADED_IMAGE)
        const cachedImageName = getLocalStorage(CACHE_KEYS.IMAGE_NAME)
        const cachedGeneratedImage = getLocalStorage(CACHE_KEYS.GENERATED_IMAGE)
        const cachedFinalPrompt = getLocalStorage(CACHE_KEYS.FINAL_PROMPT)
        const cacheTimestamp = getLocalStorage(CACHE_KEYS.CACHE_TIMESTAMP)

        // 检查缓存是否在24小时内
        const isCacheValid = cacheTimestamp && 
          (Date.now() - parseInt(cacheTimestamp)) < 24 * 60 * 60 * 1000

        if (isCacheValid && cachedImageBase64 && cachedImageName) {
          setImageBase64(cachedImageBase64)
          setImageName(cachedImageName)
          setHasValidCache(true)
          // 重新创建File对象用于显示
          const base64Data = cachedImageBase64
          const byteCharacters = atob(base64Data)
          const byteNumbers = new Array(byteCharacters.length)
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          const file = new File([byteArray], cachedImageName, { type: 'image/jpeg' })
          setUploadedImage(file)
        }

        if (isCacheValid && cachedGeneratedImage) {
          // 验证缓存的图片URL是否有效
          try {
            new URL(cachedGeneratedImage)
            setGeneratedImageUrl(cachedGeneratedImage)
          } catch {
            console.warn('缓存的图片URL无效，已清除:', cachedGeneratedImage)
            localStorage.removeItem(CACHE_KEYS.GENERATED_IMAGE)
          }
        }

        if (cachedFinalPrompt) {
          setFinalPrompt(cachedFinalPrompt)
        }
      } catch (error) {
        console.error('加载缓存数据失败:', error)
      }
    }

    loadCachedData()
  }, [])

  // 保存缓存数据
  const saveCacheData = (data: Partial<CacheData>) => {
    try {
      if (data.uploadedImageBase64) {
        setLocalStorage(CACHE_KEYS.UPLOADED_IMAGE, data.uploadedImageBase64)
      }
      if (data.imageName) {
        setLocalStorage(CACHE_KEYS.IMAGE_NAME, data.imageName)
      }
      if (data.generatedImageUrl) {
        setLocalStorage(CACHE_KEYS.GENERATED_IMAGE, data.generatedImageUrl)
      }
      if (data.finalPrompt) {
        setLocalStorage(CACHE_KEYS.FINAL_PROMPT, data.finalPrompt)
      }
      setLocalStorage(CACHE_KEYS.CACHE_TIMESTAMP, Date.now().toString())
    } catch (error) {
      console.error('保存缓存数据失败:', error)
    }
  }

  // 清除缓存数据
  const clearCacheData = () => {
    try {
      localStorage.removeItem(CACHE_KEYS.UPLOADED_IMAGE)
      localStorage.removeItem(CACHE_KEYS.IMAGE_NAME)
      localStorage.removeItem(CACHE_KEYS.GENERATED_IMAGE)
      localStorage.removeItem(CACHE_KEYS.FINAL_PROMPT)
      localStorage.removeItem(CACHE_KEYS.CACHE_TIMESTAMP)
    } catch (error) {
      console.error('清除缓存数据失败:', error)
    }
  }

  const handleImageUpload = (imageFile: File, base64: string) => {
    setUploadedImage(imageFile)
    setImageBase64(base64)
    setImageName(imageFile.name)
    
    // 保存上传的图片到缓存
    saveCacheData({
      uploadedImageBase64: base64,
      imageName: imageFile.name
    })
  }

  const handleSendPrompt = () => {
    if (prompt.trim()) {
      setFinalPrompt(prompt)
      setPrompt('')
      
      // 保存提示词到缓存
      saveCacheData({
        finalPrompt: prompt
      })
    }
  }

  const handleGenerateImage = async () => {
    if (!uploadedImage || !imageBase64) {
      alert('请先上传图片')
      return
    }

    if (!imageGenerationAPI.isApiKeySet()) {
      alert('请先设置API密钥')
      setShowApiSettings(true)
      return
    }

    setIsGenerating(true)
    setGenerationStatus('Processing')

    try {
      // 发送图像生成请求
      const response = await imageGenerationAPI.generateImage(finalPrompt, imageBase64)
      
      // 轮询获取结果
      const resultUrl = await imageGenerationAPI.waitForCompletion(
        response.polling_url,
        response.id,
        (status) => {
          setGenerationStatus(status)
        }
      )

      setGeneratedImageUrl(resultUrl)
      setGenerationStatus('Ready')
      
      // 保存生成的图片URL到缓存
      saveCacheData({
        generatedImageUrl: resultUrl
      })
    } catch (error) {
      console.error('图像生成失败:', error)
      setGenerationStatus('Error')
      alert(`图像生成失败: ${error instanceof Error ? error.message : '未知错误'}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (generatedImageUrl) {
      const link = document.createElement('a')
      link.href = generatedImageUrl
      link.download = 'generated-image.jpg'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleApiKeySaved = () => {
    setShowApiSettings(false)
    // 更新API实例的密钥
    const apiKey = getLocalStorage('BFL_API_KEY')
    if (apiKey) {
      imageGenerationAPI.updateApiKey(apiKey)
    }
  }

  const handleClearCache = () => {
    if (confirm('确定要清除所有缓存数据吗？这将删除上传的图片和生成的结果。')) {
      clearCacheData()
      setUploadedImage(null)
      setImageBase64('')
      setImageName('')
      setGeneratedImageUrl('')
      setFinalPrompt('generate a runway show image of the model wearing the outfit.')
      setHasValidCache(false)
    }
  }

  const handleRemoveImage = () => {
    setUploadedImage(null)
    setImageBase64('')
    setImageName('')
    setGeneratedImageUrl('')
    setHasValidCache(false)
    
    // 清除相关的缓存数据
    localStorage.removeItem(CACHE_KEYS.UPLOADED_IMAGE)
    localStorage.removeItem(CACHE_KEYS.IMAGE_NAME)
    localStorage.removeItem(CACHE_KEYS.GENERATED_IMAGE)
  }

  if (showApiSettings) {
    return (
      <div className="relative flex size-full min-h-screen flex-col bg-[#f8fcfa] group/design-root overflow-x-hidden font-sans">
        <div className="layout-container flex h-full grow flex-col">
          <Header />
          <div className="flex flex-1 justify-center items-center py-8">
            <div className="w-full max-w-md">
              <ApiKeySettings />
              <div className="mt-4 text-center">
                <button
                  onClick={handleApiKeySaved}
                  className="text-[#46a080] hover:underline"
                >
                  完成设置，返回应用
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#f8fcfa] group/design-root overflow-x-hidden font-sans">
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <div className="gap-1 px-2 sm:px-4 md:px-6 flex flex-1 justify-center py-3 sm:py-5">
          <div className="layout-content-container flex flex-col w-full max-w-sm lg:w-80 lg:max-w-none">
            {/* 新的头像+服装输入与合成 */}
            {/* 合成后的 dataURL 会转成 File 后通过原有 handleImageUpload 回传，不改 API */}
            <AvatarOutfitComposer
              onComposedUpload={handleImageUpload}
              cachedComposedDataUrl={imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : undefined}
              onRemove={handleRemoveImage}
            />
            {hasValidCache && (
              <div className="px-2 sm:px-4 pb-2">
                <div className="flex items-center gap-2 text-sm text-[#46a080] bg-[#e6f4ef] px-3 py-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M224,48H160V40a24,24,0,0,0-24-24H120A24,24,0,0,0,96,40v8H32A16,16,0,0,0,16,64V200a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM112,40a8,8,0,0,1,8-8h16a8,8,0,0,1,8,8v8H112Zm96,168H32V64H96v8a8,8,0,0,0,8,8h48a8,8,0,0,0,8-8V64h64Z" />
                  </svg>
                  <span>已加载缓存数据</span>
                </div>
              </div>
            )}
            <PromptInteraction 
              prompt={prompt}
              setPrompt={setPrompt}
              onSend={handleSendPrompt}
              finalPrompt={finalPrompt}
              onGenerateImage={handleGenerateImage}
              isGenerating={isGenerating}
            />
            <h2 className="text-[#0c1c17] text-lg sm:text-xl lg:text-[22px] font-bold leading-tight tracking-[-0.015em] px-2 sm:px-4 pb-3 pt-5">
              Final Prompt
            </h2>
            <div className="px-2 sm:px-4 pb-3 pt-1">
              <textarea
                value={finalPrompt}
                onChange={(e) => setFinalPrompt(e.target.value)}
                className="w-full p-3 text-[#0c1c17] text-sm sm:text-base font-normal leading-normal border border-[#cde9df] rounded-lg bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[#019863] focus:border-transparent"
                rows={3}
                placeholder="输入您的最终提示词..."
              />
              <div className="mt-3 flex justify-between items-center">
                <button
                  onClick={handleClearCache}
                  className="px-3 py-1 text-[#46a080] text-sm hover:underline border border-[#cde9df] rounded hover:bg-[#e6f4ef] transition-colors"
                >
                  清除缓存
                </button>
                <button
                  onClick={handleGenerateImage}
                  disabled={isGenerating || !uploadedImage}
                  className="px-4 py-2 bg-[#019863] text-white rounded-lg font-medium hover:bg-[#017a4f] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isGenerating ? '生成中...' : '生成'}
                </button>
              </div>
            </div>
            <div className="px-2 sm:px-4 pb-4">
              <button
                onClick={() => setShowApiSettings(true)}
                className="text-[#46a080] text-sm hover:underline"
              >
                API设置
              </button>
            </div>
          </div>
          <div className="layout-content-container flex flex-col w-full max-w-none lg:max-w-[960px] flex-1 hidden lg:block">
            <GeneratedImage 
              generatedImageUrl={generatedImageUrl}
              isGenerating={isGenerating}
              generationStatus={generationStatus}
              onDownload={handleDownload}
            />
          </div>
        </div>
        {/* 移动端图片展示区域 */}
        <div className="lg:hidden px-2 sm:px-4 pb-4">
          <GeneratedImage 
            generatedImageUrl={generatedImageUrl}
            isGenerating={isGenerating}
            generationStatus={generationStatus}
            onDownload={handleDownload}
          />
        </div>
      </div>
    </div>
  )
}
