// 应用轮询测试脚本
// 专门用于测试我们的ImageCraft应用中的轮询功能

// 测试配置
const testConfig = {
    // 应用API端点
    appApiUrl: 'http://localhost:3000/api/generate-image',
    // 测试用的API密钥（需要替换为真实的）
    testApiKey: 'your-bfl-api-key-here',
    // 轮询间隔
    pollingInterval: 500,
    // 最大轮询次数
    maxAttempts: 120
}

// 测试图像生成请求
async function testImageGeneration() {
    console.log('=== 测试图像生成请求 ===')

    try {
        // 模拟的base64图片数据（实际使用时需要真实的图片）
        const mockImageBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A'

        const response = await fetch(testConfig.appApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': testConfig.testApiKey,
            },
            body: JSON.stringify({
                prompt: '将背景改为日落时分',
                input_image: mockImageBase64,
            }),
        })

        console.log('生成请求响应状态:', response.status)

        if (!response.ok) {
            const errorData = await response.json()
            console.error('生成请求失败:', errorData)
            throw new Error(`生成请求失败: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log('生成请求成功:', data)

        return data

    } catch (error) {
        console.error('图像生成测试失败:', error)
        throw error
    }
}

// 测试轮询功能
async function testPolling(pollingUrl, requestId) {
    console.log('=== 测试轮询功能 ===')
    console.log('轮询URL:', pollingUrl)
    console.log('请求ID:', requestId)

    let attempts = 0

    while (attempts < testConfig.maxAttempts) {
        try {
            // 等待轮询间隔
            await new Promise(resolve => setTimeout(resolve, testConfig.pollingInterval))

            console.log(`第 ${attempts + 1} 次轮询...`)

            // 通过我们的应用API进行轮询
            const response = await fetch(`${testConfig.appApiUrl}?pollingUrl=${encodeURIComponent(pollingUrl)}&requestId=${encodeURIComponent(requestId)}`, {
                method: 'GET',
                headers: {
                    'x-api-key': testConfig.testApiKey,
                },
            })

            console.log('轮询响应状态:', response.status)

            if (!response.ok) {
                const errorData = await response.json()
                console.error('轮询请求失败:', errorData)
                throw new Error(`轮询请求失败: ${response.status} ${response.statusText}`)
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

// 完整测试流程
async function runFullTest() {
    console.log('=== 开始完整测试流程 ===')

    try {
        // 1. 测试图像生成请求
        const generationResult = await testImageGeneration()

        // 2. 测试轮询功能
        const pollingResult = await testPolling(generationResult.polling_url, generationResult.id)

        console.log('=== 完整测试成功 ===')
        console.log('最终结果:', pollingResult)

        return pollingResult

    } catch (error) {
        console.error('=== 完整测试失败 ===')
        console.error('错误:', error.message)
        throw error
    }
}

// 模拟测试（不需要真实API密钥）
async function runSimulationTest() {
    console.log('=== 运行模拟测试 ===')

    try {
        // 模拟生成请求响应
        const mockGenerationResult = {
            id: 'test-request-id-123',
            polling_url: 'https://api.bfl.ai/v1/get_result'
        }

        console.log('模拟生成请求成功:', mockGenerationResult)

        // 模拟轮询过程
        let attempts = 0
        const maxAttempts = 10

        while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 500))
            attempts++

            if (attempts < 5) {
                console.log(`第 ${attempts} 次轮询: Processing...`)
            } else if (attempts === 5) {
                console.log(`第 ${attempts} 次轮询: Ready!`)
                console.log('模拟图像URL: https://example.com/generated-image.jpg')
                break
            }
        }

        console.log('模拟测试完成')

    } catch (error) {
        console.error('模拟测试失败:', error)
    }
}

// 浏览器环境下的测试函数
function testInBrowser() {
    console.log('=== 浏览器环境测试 ===')

    // 检查localStorage中的API密钥
    const apiKey = localStorage.getItem('BFL_API_KEY')
    if (!apiKey) {
        console.error('请在浏览器中设置API密钥:')
        console.log('localStorage.setItem("BFL_API_KEY", "your-api-key-here")')
        console.log('然后刷新页面并重新运行测试')
        return
    }

    console.log('API密钥已找到，可以开始测试')
    console.log('在浏览器控制台中运行以下命令进行测试:')
    console.log('1. 模拟测试: simulateTest()')
    console.log('2. 完整测试: fullTest() (需要真实的API密钥)')
}

// 浏览器全局函数
if (typeof window !== 'undefined') {
    window.simulateTest = runSimulationTest
    window.fullTest = runFullTest
    window.testInBrowser = testInBrowser
    window.testImageGeneration = testImageGeneration
    window.testPolling = testPolling
}

// Node.js环境下的主函数
async function main() {
    const args = process.argv.slice(2)

    if (args.includes('--simulate') || args.length === 0) {
        // 运行模拟测试
        await runSimulationTest()
    } else if (args.includes('--full')) {
        // 运行完整测试（需要真实API密钥）
        if (!testConfig.testApiKey || testConfig.testApiKey === 'your-bfl-api-key-here') {
            console.error('请设置真实的API密钥后再运行完整测试')
            console.log('修改 testConfig.testApiKey 为你的真实API密钥')
            return
        }
        await runFullTest()
    } else {
        console.log('使用方法:')
        console.log('node test-app-polling.js --simulate  # 运行模拟测试')
        console.log('node test-app-polling.js --full     # 运行完整测试（需要API密钥）')
    }
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        testImageGeneration,
        testPolling,
        runFullTest,
        runSimulationTest,
        testInBrowser
    }
}

// 如果直接运行此脚本
if (typeof window === 'undefined' && require.main === module) {
    main()
}