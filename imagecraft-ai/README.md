# ImageCraft AI - 智能图像编辑应用

一个基于React和Next.js的智能图像编辑应用，集成了BFL AI的图像生成API，支持通过自然语言描述来编辑图像。

## 功能特性

### 🎨 智能图像编辑
- 上传原始图片
- 通过自然语言描述编辑需求
- AI自动判断用户输入是否完整
- 智能生成编辑后的图像

### 🤖 LLM智能判断
- 自动分析用户输入的编辑指令
- 判断是否为完整的final prompt
- 提供智能建议和提示
- 支持中英文混合输入

### 🔧 API密钥管理
- 安全的API密钥设置界面
- 本地存储加密
- 一键清除功能

### 📱 响应式设计
- 支持桌面端和移动端
- 现代化的UI设计
- 流畅的用户体验

## 技术栈

- **前端框架**: React 18 + Next.js 14
- **UI组件**: Tailwind CSS + shadcn/ui
- **图像处理**: BFL AI API
- **状态管理**: React Hooks
- **类型安全**: TypeScript

## 安装和运行

### 1. 克隆项目
```bash
git clone <repository-url>
cd imagecraft-ai
```

### 2. 安装依赖
```bash
npm install
```

### 3. 运行开发服务器
```bash
npm run dev
```

### 4. 访问应用
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 使用指南

### 1. 设置API密钥
首次使用需要设置BFL AI API密钥：
- 点击"API设置"按钮
- 输入你的BFL API密钥
- 点击"保存"按钮

### 2. 上传图片
- 拖拽图片到上传区域，或点击"Browse"选择文件
- 支持JPG、PNG等常见图片格式
- 文件大小限制为10MB

### 3. 输入编辑指令
在对话框中输入你想要对图片进行的编辑，例如：
- "将背景改为日落时分"
- "添加一些云朵到天空"
- "把颜色调得更温暖一些"
- "增加一些模糊效果"

### 4. 智能生成
- AI会自动分析你的输入
- 如果输入完整，会自动开始生成
- 如果输入不够具体，AI会提供建议

### 5. 查看结果
- 生成过程中会显示进度状态
- 完成后可以下载生成的图片
- 支持重新编辑和生成

## API集成说明

### BFL AI API
应用集成了BFL AI的图像编辑API，支持：
- 基于提示词的图像编辑
- 实时状态轮询
- 错误处理和重试机制

### LLM判断逻辑
内置的LLM服务可以：
- 分析用户输入的完整性
- 识别编辑指令关键词
- 提供智能建议
- 支持多种语言

## 项目结构

```
src/
├── app/                 # Next.js应用入口
├── components/          # React组件
│   ├── ui/             # 基础UI组件
│   ├── ApiKeySettings.tsx    # API密钥设置
│   ├── GeneratedImage.tsx    # 生成图像显示
│   ├── Header.tsx            # 页面头部
│   ├── ImageCraftApp.tsx     # 主应用组件
│   ├── ImageInput.tsx        # 图片上传组件
│   └── PromptInteraction.tsx # 提示词交互
└── lib/                # 工具库
    ├── imageGenerationApi.ts # 图像生成API
    ├── llmService.ts         # LLM服务
    └── utils.ts              # 工具函数
```

## 开发说明

### 添加新的编辑功能
1. 在`llmService.ts`中添加新的关键词识别
2. 在`imageGenerationApi.ts`中扩展API调用
3. 在UI组件中添加相应的交互元素

### 自定义LLM判断逻辑
可以修改`LLMService.analyzePrompt`方法来自定义判断逻辑，或者集成真实的LLM API。

### 样式定制
项目使用Tailwind CSS，可以通过修改CSS类来自定义样式。

## 注意事项

1. **API密钥安全**: API密钥存储在浏览器本地存储中，请确保在安全的环境中使用
2. **图片格式**: 建议使用JPG或PNG格式的图片
3. **网络连接**: 图像生成需要稳定的网络连接
4. **API限制**: 请遵守BFL AI的API使用限制和条款

## 故障排除

### 常见问题

**Q: 图像生成失败怎么办？**
A: 检查API密钥是否正确设置，网络连接是否正常，以及图片格式是否支持。

**Q: 提示词输入后没有反应？**
A: 确保输入包含具体的编辑指令，AI需要明确的描述才能理解你的需求。

**Q: 生成的图片质量不理想？**
A: 尝试更详细和具体的描述，包括风格、颜色、效果等细节。

## 许可证

本项目采用MIT许可证，详见LICENSE文件。

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交GitHub Issue
- 发送邮件至项目维护者
