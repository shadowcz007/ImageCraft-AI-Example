'use client'

import { useState } from 'react'
import Header from './Header'
import ImageInput from './ImageInput'
import PromptInteraction from './PromptInteraction'
import GeneratedImage from './GeneratedImage'

export default function ImageCraftApp() {
  const [prompt, setPrompt] = useState('')
  const [finalPrompt, setFinalPrompt] = useState('A futuristic cityscape at night, neon lights reflecting on wet streets, flying vehicles, diverse people walking, high-resolution, cinematic lighting')

  const handleSendPrompt = () => {
    if (prompt.trim()) {
      setFinalPrompt(prompt)
      setPrompt('')
    }
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#f8fcfa] group/design-root overflow-x-hidden font-sans">
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <div className="gap-1 px-2 sm:px-4 md:px-6 flex flex-1 justify-center py-3 sm:py-5">
          <div className="layout-content-container flex flex-col w-full max-w-sm lg:w-80 lg:max-w-none">
            <ImageInput />
            <PromptInteraction 
              prompt={prompt}
              setPrompt={setPrompt}
              onSend={handleSendPrompt}
            />
            <h2 className="text-[#0c1c17] text-lg sm:text-xl lg:text-[22px] font-bold leading-tight tracking-[-0.015em] px-2 sm:px-4 pb-3 pt-5">
              Final Prompt
            </h2>
            <p className="text-[#0c1c17] text-sm sm:text-base font-normal leading-normal pb-3 pt-1 px-2 sm:px-4">
              {finalPrompt}
            </p>
          </div>
          <div className="layout-content-container flex flex-col w-full max-w-none lg:max-w-[960px] flex-1 hidden lg:block">
            <GeneratedImage />
          </div>
        </div>
        {/* 移动端图片展示区域 */}
        <div className="lg:hidden px-2 sm:px-4 pb-4">
          <GeneratedImage />
        </div>
      </div>
    </div>
  )
}
