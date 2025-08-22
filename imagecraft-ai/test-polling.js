// 轮询测试脚本 - 将Python代码转换为JavaScript
// 对应Python代码：
// import time
// import os
// import requests
// 
// while True:
//   time.sleep(0.5)
//   result = requests.get(
//       polling_url,
//       headers={
//           'accept': 'application/json',
//           'x-key': os.environ.get("BFL_API_KEY"),
//       },
//       params={'id': request_id}
//   ).json()
//   
//   if result['status'] == 'Ready':
//       print(f"Image ready: {result['result']['sample']}")
//       break
//   elif result['status'] in ['Error', 'Failed']:
//       print(f"Generation failed: {result}")
//       break

// 配置参数
const config = {
    // 从环境变量或localStorage获取API密钥
    apiKey: process.env.BFL_API_KEY || (typeof localStorage !== 'undefined' ? localStorage.getItem('BFL_API_KEY') : null),
    // 轮询间隔（毫秒）
    pollingInterval: 500,
    // 最大轮询次数（防止无限循环）
    maxAttempts: 120, // 60秒 (120 * 0.5秒)
    // 是否在浏览器环境中运行
    isBrowser: typeof window !== 'undefined'
}

// 轮询函数
async function pollForResult(pollingUrl, requestId) {
    console.log('开始轮询结果...')
    console.log('轮询URL:', pollingUrl)
    console.log('请求ID:', requestId)
    console.log('API密钥:', config.apiKey ? '已设置' : '未设置')

    let attempts = 0

    while (attempts < config.maxAttempts) {
        try {
            // 等待指定间隔
            await new Promise(resolve => setTimeout(resolve, config.pollingInterval))

            console.log(`第 ${attempts + 1} 次轮询...`)

            // 发送GET请求
            const response = await fetch(`${pollingUrl}?id=${requestId}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'x-key': config.apiKey,
                },
            })

            console.log('响应状态:', response.status)

            if (!response.ok) {
                const errorText = await response.text()
                console.error('轮询请求失败:', response.status, response.statusText)
                console.error('错误详情:', errorText)
                throw new Error(`轮询请求失败: ${response.status} ${response.statusText} - ${errorText}`)
            }

            const result = await response.json()
            console.log('轮询结果:', result)

            // 检查状态
            if (result.status === 'Ready') {
                console.log('✅ 图像生成完成!')
                console.log('图像URL:', result.result && result.result.sample)
                return result
            } else if (result.status === 'Error' || result.status === 'Failed') {
                console.error('❌ 图像生成失败:', result)
                throw new Error(`图像生成失败: ${result.error || '未知错误'}`)
            } else {
                console.log('⏳ 正在处理中... 状态:', result.status)
            }

            attempts++

        } catch (error) {
            console.error('轮询过程中出错:', error)
            throw error
        }
    }

    throw new Error('轮询超时，超过最大尝试次数')
}

// 测试函数
async function testPolling() {
    try {
        // 检查API密钥
        if (!config.apiKey) {
            throw new Error('API密钥未设置。请设置环境变量 BFL_API_KEY 或在浏览器中设置 localStorage')
        }

        // 测试参数 - 你需要替换为实际的URL和ID
        const testPollingUrl = 'https://api.bfl.ai/v1/get_result' // 替换为实际的轮询URL
        const testRequestId = 'your-request-id-here' // 替换为实际的请求ID

        console.log('=== 轮询测试开始 ===')
        console.log('测试URL:', testPollingUrl)
        console.log('测试ID:', testRequestId)

        // 开始轮询
        const result = await pollForResult(testPollingUrl, testRequestId)

        console.log('=== 轮询测试完成 ===')
        console.log('最终结果:', result)

        return result

    } catch (error) {
        console.error('=== 轮询测试失败 ===')
        console.error('错误:', error.message)
        throw error
    }
}

// 模拟轮询测试（用于演示）
async function simulatePolling() {
    console.log('=== 模拟轮询测试 ===')

    let attempts = 0
    const maxAttempts = 10

    while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500))
        attempts++

        // 模拟不同的状态
        if (attempts < 5) {
            console.log(`第 ${attempts} 次轮询: Processing...`)
        } else if (attempts === 5) {
            console.log(`第 ${attempts} 次轮询: Ready!`)
            console.log('模拟图像URL: https://example.com/generated-image.jpg')
            break
        }
    }

    console.log('模拟轮询完成')
}

// 浏览器环境下的测试函数
function testInBrowser() {
    console.log('在浏览器环境中运行测试...')

    // 检查localStorage中的API密钥
    const apiKey = localStorage.getItem('BFL_API_KEY')
    if (!apiKey) {
        console.error('请在浏览器中设置API密钥:')
        console.log('localStorage.setItem("BFL_API_KEY", "your-api-key-here")')
        return
    }

    console.log('API密钥已找到，可以开始测试')

    // 这里可以添加浏览器特定的测试逻辑
    // 例如：从页面获取实际的polling_url和request_id
}

// 主函数
async function main() {
    try {
        if (config.isBrowser) {
            // 浏览器环境
            testInBrowser()
        } else {
            // Node.js环境
            console.log('在Node.js环境中运行测试...')

            // 检查是否有测试参数
            const args = process.argv.slice(2)
            if (args.length >= 2) {
                const [pollingUrl, requestId] = args
                console.log('使用命令行参数进行测试')
                const result = await pollForResult(pollingUrl, requestId)
                console.log('测试成功:', result)
            } else {
                console.log('运行模拟测试...')
                await simulatePolling()
                console.log('要运行真实测试，请提供参数:')
                console.log('node test-polling.js <polling_url> <request_id>')
            }
        }
    } catch (error) {
        console.error('测试失败:', error.message)
        process.exit(1)
    }
}

// 导出函数供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        pollForResult,
        testPolling,
        simulatePolling,
        testInBrowser
    }
}

// 如果直接运行此脚本
if (typeof window === 'undefined' && require.main === module) {
    main()
}

// 浏览器环境下的全局函数
if (typeof window !== 'undefined') {
    window.testPolling = testPolling
    window.simulatePolling = simulatePolling
    window.testInBrowser = testInBrowser
    window.pollForResult = pollForResult
}