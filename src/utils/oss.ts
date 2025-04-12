/*
 * @Author: 吴伟 15711376175@163.com
 * @Date: 2025-03-05 16:07:24
 * @LastEditors: 吴伟 15711376175@163.com
 * @LastEditTime: 2025-03-05 21:58:05
 * @FilePath: /ai/src/utils/oss.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import OSS from 'ali-oss';
import { message } from 'ant-design-vue';

// OSS 配置
const ossConfig = {
  region: 'oss-cn-beijing',
  bucket: 'planthospital',
  endpoint: 'planthospital.oss-cn-beijing.aliyuncs.com',
  accessKeyId: import.meta.env.VITE_OSS_ACCESS_KEY_ID,
  accessKeySecret: import.meta.env.VITE_OSS_ACCESS_KEY_SECRET,
  secure: true, // 使用 HTTPS
  cname: true, // 使用自定义域名
};

// 获取文件后缀
const getFileExt = (filename: string) => {
  return filename.substring(filename.lastIndexOf('.'));
};

// 生成随机文件名
const generateFileName = (file: File) => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  const ext = getFileExt(file.name);
  return `chat-images/${timestamp}_${random}${ext}`;
};

// 上传文件到 OSS
export const uploadToOSS = async (file: File): Promise<string> => {
  try {
    const client = new OSS(ossConfig);
    
    // 生成文件名
    const fileName = generateFileName(file);
    
    // 上传文件
    const result = await client.put(fileName, file, {
      headers: {
        'Content-Type': file.type,
        'Cache-Control': 'public, max-age=31536000'
      }
    });
    
    console.log(result ,'result   url');
 
    return result.url;
    
  } catch (error) {
    console.error('OSS 上传错误:', error);
    message.error('文件上传失败');
    throw error;
  }
}; 