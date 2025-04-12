/*
 * @Author: 吴伟 15711376175@163.com
 * @Date: 2025-03-04 17:11:46
 * @LastEditors: 吴伟 15711376175@163.com
 * @LastEditTime: 2025-03-04 18:00:29
 * @FilePath: /ai/src/utils/request.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios'
import { message } from 'ant-design-vue'

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api', // 设置基础URL
  timeout: 60000, // 增加超时时间，因为流式响应可能需要更长时间
  headers: {
    'Content-Type': 'application/json'
  },
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 如果是流式请求，设置合适的 responseType 和 headers
    if (config.url?.includes('handler')) {
      config.responseType = 'text';
      config.headers['Accept'] = 'text/event-stream';
      // 确保不会被 axios 自动解析
      config.transformResponse = [(data) => data];
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 如果是流式响应，直接返回原始数据
    if (response.config.url?.includes('handler')) {
      return response.data;
    }

    // 普通响应处理
    const res = response.data;
    if (res.code === 200) {
      return res.data;
    } else {
      message.error(res.message || '请求失败');
      return Promise.reject(new Error(res.message || '请求失败'));
    }
  },
  (error) => {
    message.error(error.message || '网络错误');
    return Promise.reject(error);
  }
)

export default request 