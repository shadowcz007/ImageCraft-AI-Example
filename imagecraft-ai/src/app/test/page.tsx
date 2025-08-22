'use client'

import TestPrompt from '@/components/TestPrompt'
import AvatarOutfitComposer from '@/components/AvatarOutfitComposer'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-[#f8fcfa] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-center text-[#0c1c17] mb-8">
          功能测试工具
        </h1>
        
        {/* 头像服装合成测试 */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-[#0c1c17] mb-4">头像服装合成测试</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <AvatarOutfitComposer
              onComposedUpload={(file, base64) => {
                console.log('合成完成:', file.name, base64.substring(0, 50) + '...')
              }}
              onRemove={() => {
                console.log('清除选择')
              }}
            />
          </div>
        </div>

        {/* LLM判断逻辑测试 */}
        <div>
          <h2 className="text-xl font-bold text-[#0c1c17] mb-4">LLM判断逻辑测试</h2>
          <TestPrompt />
        </div>
      </div>
    </div>
  )
}
