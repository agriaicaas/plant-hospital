/*
 * @Author: 吴伟 15711376175@163.com
 * @Date: 2025-03-04 17:11:53
 * @LastEditors: 吴伟 15711376175@163.com
 * @LastEditTime: 2025-04-10 20:14:47
 * @FilePath: /ai/src/api/chat.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'

interface ChatResponse {
  text: string;
  done: boolean;
}

// 发送消息
export function sendMessage(data: {
  content: string
  files?: File[]
}, options: {
  responseType?: 'stream'
} = {}) {
    console.log(data, 999)  
  return request({
    url: '',
    method: 'post',
    data: {
        data: data.content,
        userInfo: {},
        userPosition: {},
        sessionID: '134990'
    }
       
  })
}

// 处理流式响应
export function processStreamResponse(response: string): ChatResponse[] {
  const chunks = response
    .split('\n')
    .filter(chunk => chunk.trim() !== '')
    .map(chunk => {
      try {
        if (chunk.startsWith('data: ')) {
          const jsonStr = chunk.slice(6)
          return JSON.parse(jsonStr)
        }
        return null
      } catch (e) {
        console.error('解析响应数据失败:', e)
        return null
      }
    })
    .filter(Boolean)

  return chunks
}

// 上传文件
export function uploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  
  return request({
    url: '/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
} 