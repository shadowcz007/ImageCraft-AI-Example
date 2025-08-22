'use client'

import { useState, useEffect } from 'react'
import Header from './Header'
import ImageInput from './ImageInput'
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

export default function ImageCraftApp() {
  const [prompt, setPrompt] = useState('')
  const [finalPrompt, setFinalPrompt] = useState('generate a runway show image of the model wearing the outfit.')
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [imageBase64, setImageBase64] = useState<string>('')
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStatus, setGenerationStatus] = useState('')
  const [showApiSettings, setShowApiSettings] = useState(false)

  // 检查API密钥是否已设置
  useEffect(() => {
    const apiKey = getLocalStorage('BFL_API_KEY')
    if (!apiKey) {
      setShowApiSettings(true)
    }
  }, [])

  const handleImageUpload = (imageFile: File, base64: string) => {
    setUploadedImage(imageFile)
    setImageBase64(base64)
  }

  const handleSendPrompt = () => {
    if (prompt.trim()) {
      setFinalPrompt(prompt)
      setPrompt('')
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
            <ImageInput onImageUpload={handleImageUpload} />
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
              <div className="mt-3 flex justify-end">
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
