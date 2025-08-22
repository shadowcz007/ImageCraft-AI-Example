# 轮询测试指南

## 📋 概述

我创建了两个JavaScript测试脚本来测试轮询功能：

1. **`test-polling.js`** - 通用轮询测试脚本（对应Python代码）
2. **`test-app-polling.js`** - 专门测试我们应用的轮询功能

## 🚀 使用方法

### 1. 通用轮询测试 (`test-polling.js`)

#### Node.js环境运行：

```bash
# 运行模拟测试
node test-polling.js

# 运行真实测试（需要提供参数）
node test-polling.js <polling_url> <request_id>
```

#### 浏览器环境运行：

1. 在浏览器控制台中设置API密钥：
```javascript
localStorage.setItem('BFL_API_KEY', 'your-api-key-here')
```

2. 运行测试：
```javascript
// 模拟测试
simulatePolling()

// 真实测试（需要先设置API密钥）
testPolling()
```

### 2. 应用轮询测试 (`test-app-polling.js`)

#### Node.js环境运行：

```bash
# 运行模拟测试
node test-app-polling.js --simulate

# 运行完整测试（需要API密钥）
node test-app-polling.js --full
```

#### 浏览器环境运行：

1. 确保应用正在运行 (`npm run dev`)
2. 在浏览器控制台中运行：
```javascript
// 检查API密钥
testInBrowser()

// 模拟测试
simulateTest()

// 完整测试（需要真实API密钥）
fullTest()
```

## 🔧 配置说明

### 环境变量设置

#### Node.js环境：
```bash
export BFL_API_KEY="your-bfl-api-key-here"
```

#### 浏览器环境：
```javascript
localStorage.setItem('BFL_API_KEY', 'your-bfl-api-key-here')
```

### 测试配置参数

在 `test-app-polling.js` 中可以修改以下配置：

```javascript
const testConfig = {
  appApiUrl: 'http://localhost:3000/api/generate-image', // 应用API端点
  testApiKey: 'your-bfl-api-key-here',                   // 测试API密钥
  pollingInterval: 500,                                   // 轮询间隔（毫秒）
  maxAttempts: 120                                        // 最大轮询次数
}
```

## 📊 测试输出示例

### 成功轮询示例：

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
轮询结果: { status: 'Processing' }
⏳ 正在处理中... 状态: Processing
第 3 次轮询...
响应状态: 200
轮询结果: { status: 'Ready', result: { sample: 'https://example.com/image.jpg' } }
✅ 图像生成完成!
图像URL: https://example.com/image.jpg
```

### 错误处理示例：

```
=== 轮询测试失败 ===
错误: 轮询请求失败: 400 Bad Request - Invalid API key
```

## 🛠️ 调试技巧

### 1. 检查API密钥

```javascript
// 检查localStorage中的API密钥
console.log('API密钥:', localStorage.getItem('BFL_API_KEY'))

// 检查环境变量（Node.js）
console.log('环境变量API密钥:', process.env.BFL_API_KEY)
```

### 2. 测试网络连接

```javascript
// 测试BFL API连接
fetch('https://api.bfl.ai/v1/flux-kontext-pro', {
  method: 'OPTIONS'
}).then(response => {
  console.log('BFL API可访问:', response.status)
}).catch(error => {
  console.error('BFL API不可访问:', error)
})
```

### 3. 查看详细日志

测试脚本会输出详细的日志信息，包括：
- 请求状态码
- 响应数据
- 错误详情
- 轮询进度

## 🔍 常见问题

### 1. API密钥问题

**问题**: `API密钥未设置` 错误
**解决方案**:
- 确保正确设置了环境变量或localStorage
- 验证API密钥的有效性

### 2. 网络连接问题

**问题**: `轮询请求失败: 400 Bad Request`
**解决方案**:
- 检查网络连接
- 验证API端点URL
- 确认请求参数格式

### 3. 超时问题

**问题**: `轮询超时，超过最大尝试次数`
**解决方案**:
- 增加 `maxAttempts` 值
- 检查图像生成是否真的在进行
- 验证请求ID是否正确

## 📝 与Python代码对比

### Python版本：
```python
import time
import os
import requests

while True:
  time.sleep(0.5)
  result = requests.get(
      polling_url,
      headers={
          'accept': 'application/json',
          'x-key': os.environ.get("BFL_API_KEY"),
      },
      params={'id': request_id}
  ).json()
  
  if result['status'] == 'Ready':
      print(f"Image ready: {result['result']['sample']}")
      break
  elif result['status'] in ['Error', 'Failed']:
      print(f"Generation failed: {result}")
      break
```

### JavaScript版本：
```javascript
async function pollForResult(pollingUrl, requestId) {
  let attempts = 0
  
  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const response = await fetch(`${pollingUrl}?id=${requestId}`, {
      headers: {
        'accept': 'application/json',
        'x-key': apiKey,
      },
    })
    
    const result = await response.json()
    
    if (result.status === 'Ready') {
      console.log('Image ready:', result.result?.sample)
      return result
    } else if (result.status === 'Error' || result.status === 'Failed') {
      throw new Error(`Generation failed: ${result}`)
    }
    
    attempts++
  }
}
```

## 🎯 测试建议

1. **先运行模拟测试** - 验证脚本逻辑
2. **检查API密钥** - 确保密钥有效
3. **测试网络连接** - 确认可以访问API
4. **查看详细日志** - 分析问题原因
5. **逐步调试** - 从简单到复杂

通过这些测试脚本，你可以有效地验证轮询功能是否正常工作！
