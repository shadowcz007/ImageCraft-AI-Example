# ImageCraft AI

一个基于Next.js和shadcn UI构建的现代化AI图像生成应用界面。

## 功能特性

- 🎨 现代化的绿色主题设计
- 📱 响应式布局，支持移动端和桌面端
- 🤖 AI助手对话界面
- 🖼️ 图片上传和生成功能
- 💬 实时提示词交互
- 🎯 多种图片操作工具（下载、添加文字、水印、增强、分享）

## 技术栈

- **框架**: Next.js 14 (App Router)
- **UI组件**: shadcn/ui
- **样式**: Tailwind CSS
- **字体**: Inter
- **语言**: TypeScript

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

## 项目结构

```
src/
├── app/
│   ├── globals.css          # 全局样式
│   ├── layout.tsx           # 根布局
│   └── page.tsx             # 主页面
├── components/
│   ├── ui/                  # shadcn UI组件
│   ├── Header.tsx           # 页面头部
│   ├── ImageInput.tsx       # 图片输入组件
│   ├── PromptInteraction.tsx # 提示词交互组件
│   ├── GeneratedImage.tsx   # 生成的图片组件
│   └── ImageCraftApp.tsx    # 主应用组件
└── lib/
    └── utils.ts             # 工具函数
```

## 设计特色

- **绿色主题**: 使用清新的绿色配色方案 (#019863, #e6f4ef, #f8fcfa)
- **现代化UI**: 基于shadcn/ui组件库的现代化设计
- **响应式设计**: 完美适配各种屏幕尺寸
- **交互体验**: 流畅的动画和过渡效果

## 自定义

### 颜色主题

可以在 `src/app/globals.css` 中修改CSS变量来自定义颜色主题：

```css
:root {
  --primary: #019863;
  --secondary: #e6f4ef;
  --background: #f8fcfa;
  /* ... 其他颜色变量 */
}
```

### 组件样式

所有组件都使用Tailwind CSS类名，可以直接在组件文件中修改样式。

## 许可证

MIT License
