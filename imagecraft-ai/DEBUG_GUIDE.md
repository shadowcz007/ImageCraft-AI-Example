# 调试指南

## 🔍 常见问题排查

### 1. API密钥问题

**问题**: `缺少API密钥` 错误
**解决方案**:
- 确保在API设置页面正确设置了BFL API密钥
- 检查localStorage中是否有`BFL_API_KEY`
- 在浏览器控制台中运行: `localStorage.getItem('BFL_API_KEY')`

### 2. 轮询请求失败

**问题**: `轮询请求失败: 400 Bad Request`
**可能原因**:
- API密钥无效或过期
- 请求ID格式不正确
- 轮询URL格式错误

**调试步骤**:
1. 检查浏览器控制台的详细错误信息
2. 验证API密钥是否正确
3. 检查网络请求的详细信息

### 3. 图像上传问题

**问题**: 图片上传失败
**解决方案**:
- 确保图片格式为JPG或PNG
- 检查图片大小是否超过10MB
- 验证图片文件是否损坏

## 🛠️ 调试工具

### 1. 浏览器开发者工具

打开浏览器开发者工具 (F12)，查看以下信息：

**Console标签**:
```javascript
// 检查API密钥
console.log('API密钥:', localStorage.getItem('BFL_API_KEY'))

// 检查localStorage
console.log('所有localStorage:', Object.keys(localStorage))
```

**Network标签**:
- 查看API请求的详细信息
- 检查请求头和响应
- 查看错误状态码

### 2. 测试页面

访问 `http://localhost:3000/test` 来测试LLM判断逻辑。

### 3. API测试

在浏览器控制台中运行以下代码来测试API：

```javascript
// 测试API连接
async function testApi() {
  try {
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'your-api-key-here'
      },
      body: JSON.stringify({
        prompt: 'test',
        input_image: 'test'
      })
    })
    
    console.log('响应状态:', response.status)
    const data = await response.json()
    console.log('响应数据:', data)
  } catch (error) {
    console.error('错误:', error)
  }
}

testApi()
```

## 📊 日志分析

### 后端日志

查看服务器控制台输出，寻找以下信息：

```
收到POST请求到 /api/generate-image
请求参数: { prompt: "...", imageLength: 12345 }
开始发送图像生成请求到BFL API
BFL API响应状态: 200
BFL API成功响应: { id: "...", polling_url: "..." }
```

### 前端日志

查看浏览器控制台，寻找以下信息：

```
发送图像生成请求到后端API
后端API响应状态: 200
后端API成功响应: { id: "...", polling_url: "..." }
开始轮询结果: { pollingUrl: "...", requestId: "..." }
轮询响应状态: 200
轮询成功响应: { status: "Ready", result: { sample: "..." } }
```

## 🔧 常见修复

### 1. 重置API密钥

如果API密钥有问题，可以重置：

```javascript
// 在浏览器控制台中运行
localStorage.removeItem('BFL_API_KEY')
location.reload()
```

### 2. 清除缓存

如果遇到缓存问题：

```javascript
// 清除所有缓存
localStorage.clear()
sessionStorage.clear()
location.reload()
```

### 3. 检查网络连接

确保能够访问BFL API：

```javascript
// 测试网络连接
fetch('https://api.bfl.ai/v1/flux-kontext-pro', {
  method: 'OPTIONS'
}).then(response => {
  console.log('BFL API可访问:', response.status)
}).catch(error => {
  console.error('BFL API不可访问:', error)
})
```

## 🚨 错误代码说明

### HTTP状态码

- **400 Bad Request**: 请求参数错误
- **401 Unauthorized**: API密钥无效
- **403 Forbidden**: 权限不足
- **404 Not Found**: 资源不存在
- **500 Internal Server Error**: 服务器内部错误

### 常见错误消息

- `缺少API密钥`: 需要在设置中配置API密钥
- `缺少必要参数`: 请求缺少必需的参数
- `API请求失败`: BFL API调用失败
- `轮询请求失败`: 轮询结果时出错
- `图像生成超时`: 生成时间过长

## 📞 获取帮助

如果问题仍然存在：

1. 检查BFL API文档
2. 验证API密钥的有效性
3. 查看BFL API的状态页面
4. 联系技术支持

## 🔄 重置应用

如果所有方法都无效，可以完全重置应用：

1. 清除浏览器数据
2. 重新设置API密钥
3. 重新上传图片
4. 重新测试功能
