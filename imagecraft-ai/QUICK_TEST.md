# 快速测试指南

## 🚀 快速开始

### 1. 测试模拟轮询功能

```bash
# 测试应用轮询功能（模拟）
node test-app-polling.js --simulate

# 测试通用轮询功能（模拟）
node test-polling.js
```

### 2. 在浏览器中测试

1. 启动应用：
```bash
npm run dev
```

2. 打开浏览器控制台，运行：
```javascript
// 模拟测试
simulateTest()

// 检查API密钥
testInBrowser()
```

### 3. 真实API测试

#### 设置API密钥：

**Node.js环境：**
```bash
export BFL_API_KEY="your-real-api-key-here"
```

**浏览器环境：**
```javascript
localStorage.setItem('BFL_API_KEY', 'your-real-api-key-here')
```

#### 运行真实测试：

```bash
# 完整测试（需要真实API密钥）
node test-app-polling.js --full

# 通用测试（需要提供参数）
node test-polling.js <polling_url> <request_id>
```

## 📊 预期输出

### 模拟测试输出：
```
=== 运行模拟测试 ===
模拟生成请求成功: {
  id: 'test-request-id-123',
  polling_url: 'https://api.bfl.ai/v1/get_result'
}
第 1 次轮询: Processing...
第 2 次轮询: Processing...
第 3 次轮询: Processing...
第 4 次轮询: Processing...
第 5 次轮询: Ready!
模拟图像URL: https://example.com/generated-image.jpg
模拟测试完成
```

### 真实测试输出：
```
=== 开始轮询结果 ===
轮询URL: https://api.bfl.ai/v1/get_result
请求ID: 5b1998bb-2b3b-49d4-a1ee-a4594c86380e
API密钥: 已设置
第 1 次轮询...
响应状态: 200
轮询结果: { status: 'Processing' }
⏳ 正在处理中... 状态: Processing
第 2 次轮询...
响应状态: 200
轮询结果: { status: 'Ready', result: { sample: 'https://example.com/image.jpg' } }
✅ 图像生成完成!
图像URL: https://example.com/image.jpg
```

## 🔧 故障排除

### 常见错误：

1. **API密钥未设置**
   - 确保设置了环境变量或localStorage
   - 验证API密钥的有效性

2. **网络连接问题**
   - 检查网络连接
   - 验证API端点可访问

3. **语法错误**
   - 确保使用兼容的Node.js版本
   - 检查脚本语法

### 调试命令：

```javascript
// 检查API密钥
console.log('API密钥:', localStorage.getItem('BFL_API_KEY'))

// 测试网络连接
fetch('https://api.bfl.ai/v1/flux-kontext-pro', {
  method: 'OPTIONS'
}).then(r => console.log('API可访问:', r.status))
```

## 📝 测试脚本对比

| 脚本 | 用途 | 环境 | 特点 |
|------|------|------|------|
| `test-app-polling.js` | 测试应用轮询 | Node.js/浏览器 | 完整流程测试 |
| `test-polling.js` | 通用轮询测试 | Node.js/浏览器 | 对应Python代码 |

## 🎯 下一步

1. 运行模拟测试验证脚本逻辑
2. 设置真实API密钥
3. 运行真实测试验证API连接
4. 在应用中集成轮询功能

通过这些测试脚本，你可以快速验证轮询功能是否正常工作！
