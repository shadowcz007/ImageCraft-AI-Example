# 跨域问题解决方案总结

## 问题描述
原始的`imageGenerationApi.ts`文件直接在前端调用`https://api.bfl.ai`，这会导致跨域问题。

## 解决方案
将API调用迁移到Next.js后端，通过API路由代理所有外部API请求。

## 完成的改动

### 1. 创建后端API路由
- **文件**: `src/app/api/generate-image/route.ts`
- **功能**: 
  - POST端点：处理图像生成请求
  - GET端点：处理轮询请求
  - 统一的错误处理和API密钥验证

### 2. 更新前端API服务
- **文件**: `src/lib/imageGenerationApi.ts`
- **主要改动**:
  - 将`https://api.bfl.ai`调用改为`/api/generate-image`
  - 更新请求头格式，使用`x-api-key`传递API密钥
  - 改进错误处理，支持后端返回的详细错误信息

### 3. 创建测试API
- **文件**: `src/app/api/test/route.ts`
- **功能**: 验证后端API是否正常工作

### 4. 文档更新
- **文件**: `API_MIGRATION.md`
- **内容**: 详细的API迁移说明和使用指南

## API端点说明

### POST /api/generate-image
```javascript
// 请求
{
  "prompt": "图像描述",
  "input_image": "base64编码的图片"
}

// 请求头
{
  "Content-Type": "application/json",
  "x-api-key": "your-api-key"
}
```

### GET /api/generate-image
```javascript
// 查询参数
?pollingUrl=encoded-url&requestId=request-id

// 请求头
{
  "x-api-key": "your-api-key"
}
```

## 优势

1. **解决跨域问题**: 所有外部API调用都在服务器端进行
2. **更好的安全性**: API密钥不会暴露在前端代码中
3. **统一的错误处理**: 可以在后端统一处理各种错误情况
4. **更好的可维护性**: 集中管理API调用逻辑

## 测试结果

✅ 后端API正常工作 (`/api/test`)
✅ 前端页面正常加载
✅ API路由配置正确

## 使用说明

1. 确保在浏览器中设置了正确的API密钥
2. 前端会自动调用后端API路由
3. 后端会代理请求到BFL API并返回结果
4. 所有错误都会通过后端统一处理

## 注意事项

- API密钥通过请求头`x-api-key`传递
- 后端会保持与BFL API相同的响应格式
- 错误处理已经改进，会返回更详细的错误信息
- 轮询机制保持不变，但通过后端进行
