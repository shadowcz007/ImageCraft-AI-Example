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
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-80">
            <ImageInput />
            <PromptInteraction 
              prompt={prompt}
              setPrompt={setPrompt}
              onSend={handleSendPrompt}
            />
            <h2 className="text-[#0c1c17] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Final Prompt
            </h2>
            <p className="text-[#0c1c17] text-base font-normal leading-normal pb-3 pt-1 px-4">
              {finalPrompt}
            </p>
          </div>
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <GeneratedImage />
          </div>
        </div>
      </div>
    </div>
  )
}
