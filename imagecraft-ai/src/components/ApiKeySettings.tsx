'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

const removeLocalStorage = (key: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key)
  }
}

export default function ApiKeySettings() {
  const [apiKey, setApiKey] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // 从localStorage加载API密钥
    const savedApiKey = getLocalStorage('BFL_API_KEY')
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }
  }, [])

  const handleSaveApiKey = () => {
    setLocalStorage('BFL_API_KEY', apiKey)
    alert('API密钥已保存！')
  }

  const handleClearApiKey = () => {
    removeLocalStorage('BFL_API_KEY')
    setApiKey('')
    alert('API密钥已清除！')
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-[#0c1c17]">
          API密钥设置
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#0c1c17]">
            BFL API密钥
          </label>
          <div className="relative">
            <Input
              type={isVisible ? 'text' : 'password'}
              placeholder="输入你的BFL API密钥"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setIsVisible(!isVisible)}
            >
              {isVisible ? '隐藏' : '显示'}
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleSaveApiKey}
            className="flex-1 bg-[#019863] text-white hover:bg-[#017a4f]"
          >
            保存
          </Button>
          <Button
            onClick={handleClearApiKey}
            variant="outline"
            className="flex-1"
          >
            清除
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
