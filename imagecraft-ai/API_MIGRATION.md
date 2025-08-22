# API迁移到Next.js后端

## 改动说明

为了解决跨域问题，我们将图像生成API的请求从前端直接调用外部API改为通过Next.js后端API路由进行代理。

## 文件结构

```
src/
├── app/
│   └── api/
│       ├── generate-image/
│       │   └── route.ts          # 图像生成API路由
│       └── test/
│           └── route.ts          # 测试API路由
└── lib/
    └── imageGenerationApi.ts     # 更新后的前端API服务
```

## API端点

### POST /api/generate-image
- **功能**: 发送图像生成请求到BFL API
- **请求头**: 
  - `Content-Type: application/json`
  - `x-api-key: <your-api-key>`
- **请求体**:
  ```json
  {
    "prompt": "图像描述",
    "input_image": "base64编码的图片"
  }
  ```
- **响应**: BFL API的原始响应

### GET /api/generate-image
- **功能**: 轮询图像生成结果
- **查询参数**:
  - `pollingUrl`: 轮询URL
  - `requestId`: 请求ID
- **请求头**: `x-api-key: <your-api-key>`
- **响应**: 轮询结果

## 主要改动

1. **前端API服务** (`src/lib/imageGenerationApi.ts`)
   - 将直接调用`https://api.bfl.ai`改为调用本地API路由
   - 更新请求头格式，使用`x-api-key`传递API密钥
   - 改进错误处理，支持后端返回的错误信息

2. **后端API路由** (`src/app/api/generate-image/route.ts`)
   - 创建POST和GET两个端点
   - 处理API密钥验证
   - 代理请求到BFL API
   - 统一的错误处理

## 优势

1. **解决跨域问题**: 所有外部API调用都在服务器端进行
2. **更好的安全性**: API密钥不会暴露在前端代码中
3. **统一的错误处理**: 可以在后端统一处理各种错误情况
4. **更好的可维护性**: 集中管理API调用逻辑

## 测试

可以通过访问 `/api/test` 来测试后端API是否正常工作。

## 注意事项

- 确保在请求头中正确传递API密钥
- 后端API会保持与BFL API相同的响应格式
- 错误处理已经改进，会返回更详细的错误信息
