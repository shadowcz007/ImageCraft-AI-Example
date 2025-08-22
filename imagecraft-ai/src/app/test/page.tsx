import TestPrompt from '@/components/TestPrompt'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-[#f8fcfa] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-center text-[#0c1c17] mb-8">
          LLM判断逻辑测试工具
        </h1>
        <TestPrompt />
      </div>
    </div>
  )
}
