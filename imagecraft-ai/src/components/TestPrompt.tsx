'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LLMService, LLMResponse } from '@/lib/llmService'

export default function TestPrompt() {
  const [testInput, setTestInput] = useState('将背景改为日落时分')
  const [result, setResult] = useState<LLMResponse | null>(null)

  const handleTest = () => {
    const analysis = LLMService.analyzePrompt(testInput, '默认的final prompt')
    setResult(analysis)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-[#0c1c17]">
          LLM判断逻辑测试
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#0c1c17]">
            测试输入：
          </label>
          <Input
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            placeholder="输入要测试的提示词"
            className="w-full"
          />
        </div>
        
        <Button onClick={handleTest} className="w-full">
          测试判断逻辑
        </Button>

        {result && (
          <div className="mt-4 p-4 bg-[#e6f4ef] rounded-lg">
            <h3 className="font-bold mb-2">测试结果：</h3>
            <div className="space-y-2 text-sm">
              <p><strong>是否完整：</strong> {result.isComplete ? '✅ 是' : '❌ 否'}</p>
              <p><strong>原因：</strong> {result.reason}</p>
              {result.suggestedPrompt && (
                <p><strong>建议提示词：</strong> {result.suggestedPrompt}</p>
              )}
            </div>
          </div>
        )}

        <div className="mt-4">
          <h4 className="font-bold mb-2">有效输入示例：</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              '将背景改为日落时分',
              '转换为黑白照片风格',
              '添加一些云朵到天空',
              '制作成水彩画效果',
              '调整光线为暖色调',
              '将图片转换为现代艺术风格',
              '增加景深模糊效果',
              '改变整体色调为冷色调'
            ].map((example, index) => (
              <button
                key={index}
                onClick={() => setTestInput(example)}
                className="text-left p-2 bg-[#f8fcfa] rounded border hover:bg-[#e6f4ef] transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
