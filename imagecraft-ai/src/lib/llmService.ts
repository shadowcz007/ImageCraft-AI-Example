// LLM服务 - 判断用户输入是否已经是完整的final prompt

export interface LLMResponse {
  isComplete: boolean
  reason: string
  suggestedPrompt?: string
}

export class LLMService {
  // 简单的规则判断，可以根据需要扩展为调用真实的LLM API
  static analyzePrompt(userInput: string, currentFinalPrompt: string): LLMResponse {
    const input = userInput.trim().toLowerCase()
    
    // 如果用户输入为空，返回不完整
    if (!input) {
      return {
        isComplete: false,
        reason: '请输入一些内容'
      }
    }

    // 检查是否包含明确的编辑指令
    const editKeywords = [
      '修改', '改变', '添加', '删除', '替换', '调整', '编辑', '美化', '增强',
      'modify', 'change', 'add', 'remove', 'replace', 'adjust', 'edit', 'enhance', 'beautify'
    ]

    const hasEditInstruction = editKeywords.some(keyword => input.includes(keyword))

    // 检查是否包含具体的视觉描述
    const visualKeywords = [
      '颜色', '风格', '背景', '光线', '阴影', '纹理', '形状', '大小', '位置',
      'color', 'style', 'background', 'lighting', 'shadow', 'texture', 'shape', 'size', 'position'
    ]

    const hasVisualDescription = visualKeywords.some(keyword => input.includes(keyword))

    // 检查输入长度
    const isLongEnough = input.length > 10

    // 检查是否包含具体的动作或效果
    const actionKeywords = [
      '变成', '转换为', '制作成', '渲染为', '生成', '创建',
      'turn into', 'convert to', 'make into', 'render as', 'generate', 'create'
    ]

    const hasAction = actionKeywords.some(keyword => input.includes(keyword))

    // 综合判断
    if (hasEditInstruction && (hasVisualDescription || isLongEnough)) {
      return {
        isComplete: true,
        reason: '输入包含明确的编辑指令和足够的描述',
        suggestedPrompt: userInput
      }
    }

    if (hasAction && isLongEnough) {
      return {
        isComplete: true,
        reason: '输入包含明确的转换动作和足够的描述',
        suggestedPrompt: userInput
      }
    }

    if (input.length > 50 && (hasVisualDescription || hasEditInstruction)) {
      return {
        isComplete: true,
        reason: '输入足够长且包含相关描述',
        suggestedPrompt: userInput
      }
    }

    // 如果不完整，提供建议
    let suggestion = currentFinalPrompt
    if (hasEditInstruction) {
      suggestion = `${currentFinalPrompt}, ${userInput}`
    } else if (input.length < 20) {
      suggestion = `${currentFinalPrompt}, 请${userInput}`
    } else {
      suggestion = `${currentFinalPrompt}, ${userInput}`
    }

    return {
      isComplete: false,
      reason: '输入不够具体，需要更多描述',
      suggestedPrompt: suggestion
    }
  }

  // 如果需要调用真实的LLM API，可以在这里添加
  static async analyzePromptWithLLM(userInput: string, currentFinalPrompt: string): Promise<LLMResponse> {
    // 这里可以集成真实的LLM API，比如OpenAI、Claude等
    // 目前先使用规则判断
    return this.analyzePrompt(userInput, currentFinalPrompt)
  }
}
