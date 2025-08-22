// 简单的API测试脚本
const testApi = async() => {
    try {
        console.log('测试API连接...')

        // 测试POST请求
        const postResponse = await fetch('http://localhost:3000/api/generate-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'test-key'
            },
            body: JSON.stringify({
                prompt: 'test prompt',
                input_image: 'test-image-base64'
            })
        })

        console.log('POST响应状态:', postResponse.status)

        if (postResponse.ok) {
            const postData = await postResponse.json()
            console.log('POST响应数据:', postData)
        } else {
            const errorData = await postResponse.json()
            console.log('POST错误:', errorData)
        }

        // 测试GET请求
        const getResponse = await fetch('http://localhost:3000/api/generate-image?pollingUrl=test&requestId=test', {
            method: 'GET',
            headers: {
                'x-api-key': 'test-key'
            }
        })

        console.log('GET响应状态:', getResponse.status)

        if (getResponse.ok) {
            const getData = await getResponse.json()
            console.log('GET响应数据:', getData)
        } else {
            const errorData = await getResponse.json()
            console.log('GET错误:', errorData)
        }

    } catch (error) {
        console.error('测试失败:', error)
    }
}

// 如果直接运行此脚本
if (typeof window === 'undefined') {
    testApi()
}

module.exports = { testApi }