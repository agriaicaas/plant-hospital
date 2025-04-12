<template>
  <div class="talk-container">
    <welcomeCom />    

    <div class="messages-container" :class="{ 'messages-container-open': isOpen }">
      <Flex gap="middle" vertical>
        <template v-for="msg in messages" :key="msg.id">
          <!-- 用户消息 -->
          <Bubble
            v-if="msg.isUser"
            placement="end"
            :content="msg.content"
            :avatar="createUserAvatar()"
          />
          <!-- AI消息 -->
          <template v-else>
            <!-- 分析结果消息 -->
            <NewImageTalk
              v-if="msg.isAnalysis && isNewFormat(msg.content)"
              :analysis-result="msg.content"
            />
            <ImageTalk
              v-else-if="msg.isAnalysis"
              :analysis-result="msg.content"
            />
            <!-- 普通AI消息 -->
            <Bubble
              v-else
              placement="start"
              :content="messageContents.get(msg.id) || msg.content"
              :avatar="createAIAvatar()"
            >
              <template #suffix>
                <span v-if="loading && msg.id === messages[messages.length - 1].id" class="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </template>
            </Bubble>
          </template>
        </template>
      </Flex>
    </div>
    <div class="input-container">
      <Demo />
    </div>
  </div>
</template>

<script setup lang="tsx">
import axios from 'axios';
import { UserOutlined, RobotOutlined, CloudUploadOutlined, LinkOutlined } from '@ant-design/icons-vue';
import { Flex, Button,message } from 'ant-design-vue';
import type { CSSProperties } from 'vue';
import { ref, onMounted, h, computed, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { sendMessage } from '@/api/chat';
import { Sender, Attachments, Bubble, Welcome } from 'ant-design-x-vue';
import type { UploadFile } from 'ant-design-vue';
import { uploadToOSS } from '@/utils/oss';
import AnalysisResult  from './imageTalk.vue';
import ImageTalk from './imageTalk.vue';
import NewImageTalk from './newImageTalk.vue';

interface Message {
  content: any;
  isUser: boolean;
  id: number;
  isAnalysis?: boolean;
}

defineOptions({ name: 'BubbleAvatarAndPlacement' });

const route = useRoute();
const isOpen = ref(false);
const fileList = ref<UploadFile[]>([]);
const fileListData = ref<any[]>([]);
const messages = ref<Message[]>([]);
const messageContents = ref<Map<number, string>>(new Map());
const loading = ref(false);

// 用户头像样式
const userAvatar: CSSProperties = {
  color: '#f56a00',
  backgroundColor: '#fde3cf',
};

// AI头像样式
const aiAvatar: CSSProperties = {
  color: '#fff',
  backgroundColor: '#87d068',
};

// 获取路由中的type参数
const pageType = ref(route.query.type as string || 'chat');
console.log('当前页面类型:', pageType.value);

// 判断是否为新格式(含Outputmessages的响应)
const isNewFormat = (content: any): boolean => {
  if (!content || !content.result) return false;
  
  const plantResult = content.result['plant-hospital_analysis_result'] || content.result['plant-lab_analysis_result'];
  return plantResult && plantResult.Outputmessages && Array.isArray(plantResult.Outputmessages);
};

// 创建头像配置
const createUserAvatar = () => ({
  icon: h(UserOutlined),
  style: userAvatar
});

const createAIAvatar = () => ({
  icon: h(RobotOutlined),
  style: aiAvatar
});

// 处理流式响应
const handleStreamResponse = (response: string, messageId: number) => {
  return new Promise((resolve) => {
    let accumulatedMessage = '';
    
    // 将响应文本按行分割
    const lines = response.split('\n');
    
    // 模拟流式处理
    let index = 0;
    const processLine = () => {
      if (index >= lines.length) {
        resolve(accumulatedMessage);
        return;
      }

      const line = lines[index];
      if (line.startsWith('data: ')) {
        try {
          const jsonStr = line.slice(6); // 移除 'data: ' 前缀
          const data = JSON.parse(jsonStr);
          if (data.message) {
            accumulatedMessage += data.message;
            // 更新特定消息的内容
            messageContents.value.set(messageId, accumulatedMessage);
          }
        } catch (e) {
          console.error('解析响应数据失败:', e);
        }
      }

      index++;
      // 使用 setTimeout 来模拟流式效果
      setTimeout(processLine, 50);
    };

    processLine();
  });
};

// 初始化消息
onMounted(async () => {
  const question = route.query.q as string;
//   const question = ''

  if (question) {
    sendTalk(question);
  }
});
const sendTalk = async (question: string) => {
  const messageId = Date.now();
  
  messages.value.push({
    content: question,
    isUser: true,
    id: messageId
  });
  
  const aiMessageId = messageId + 1;
  messages.value.push({
    content: '',
    isUser: false,
    id: aiMessageId
  });

  loading.value = true;
  let buffer = '';
  let accumulatedMessage = '';
  
  try {
    await axios.post(import.meta.env.VITE_API_CHAT_URL, {
      data: question,
      userInfo: {},
      userPosition: {},
      sessionID: '134990'
    }, {
      onDownloadProgress: (progressEvent: any) => {
        const { responseText } = progressEvent.event.target;
        const newData = responseText.slice(buffer.length);
        buffer = responseText;
        
        // 处理新增的数据
        const lines = newData.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6).trim(); // 移除 'data: ' 前缀
              if (jsonStr) {
                const data = JSON.parse(jsonStr);
                if (data.message) {
                  // 累加新的消息内容
                  accumulatedMessage += data.message;
                  // 实时更新最后一条消息
                  const lastMessage = messages.value[messages.value.length - 1];
                  if (!lastMessage.isUser) {
                    lastMessage.content = accumulatedMessage;
                  }
                }
              }
            } catch (e) {
              console.error('解析响应数据失败:', e);
            }
          }
        }

        // 自动滚动到底部
        nextTick(() => {
          const container = document.querySelector('.messages-container');
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        });
      },
      responseType: 'text',
      headers: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
      }
    });
  } catch (error) {
    console.error('发送消息失败:', error);
    messages.value.push({
      content: '抱歉，发生了一些错误，请稍后再试。',
      isUser: false,
      id: Date.now()
    });
  } finally {
    loading.value = false;
  }
};

const sendFileMessage = async (fileList: UploadFile[],question:string) => {
  console.log('fileList1111111',fileList);
  const userQuestion = question || '正在对植物进行检验分析，请稍等检验结果';

  try {
    const response = await axios.post(import.meta.env.VITE_API_LAB_URL,{
      "data": {
          "imageP": fileList[0].url,
          "imageL": fileList[1].url
      },
      "userInfo": {},
      "userPosition": {},
      "sessionID": "134990"
    },{
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      responseType: 'json',
    });

    // console.log('res',response.data);
    
    // 添加用户的图片消息
    messages.value.push({
      content: userQuestion,
      isUser: true,
      id: Date.now()
    });
      // 示例分析结果数据
const analysisResult = {
  message: "图像处理成功",
  data_type: "双图像 URL",
  imageP_url: "https://planthospital.oss-cn-beijing.aliyuncs.com/chat-images/1741224666751_668.png",
  imageL_url: "https://planthospital.oss-cn-beijing.aliyuncs.com/chat-images/1741224670631_526.jpg",
  "plant-lab_analysis_result": {
    "plant植物": "未检测到植物，请重新输入",
    "植物当前的生育期": "未检测到植物，请重新输入",
    "叶片生理指标化验结果": [
      {
        "叶片spad值": {
          "检测结果": "140.14776200000034",
          "标准值范围": "因未明确植物品种和生育期，无法提供",
          "结果判断": "无法判断"
        }
      },
      {
        "chlorophyll content of leaf，mg/g": {
          "检测结果": "178.03706235514795",
          "标准值范围": "因未明确植物品种和生育期，无法提供",
          "结果判断": "无法判断"
        }
      },
      {
        "nitrogen content of leaf，%": {
          "检测结果": "5.126814971055532",
          "标准值范围": "因未明确植物品种和生育期，无法提供",
          "结果判断": "无法判断"
        }
      },
      {
        "叶片净光合速率Pn, μmol/m²/s": {
          "检测结果": "1548.4017650755543",
          "标准值范围": "因未明确植物品种和生育期，无法提供",
          "结果判断": "无法判断"
        }
      }
    ],
    "植物生长影响": "由于未明确植物品种和生育期，无法确定检测结果与标准值差异对植物生长的影响。",
    "原因分析": "由于未明确植物品种和生育期，无法分析检测结果与标准值差异产生的原因。",
    "解决方案": {
      "物理防治": "因未明确情况，暂无法提供",
      "化学防治": "因未明确情况，暂无法提供",
      "化学药剂名称": "因未明确情况，暂无法提供",
      "环境调控": {
        "湿度控制": "因未明确情况，暂无法提供",
        "光照管理": "因未明确情况，暂无法提供",
        "温度干预": "因未明确情况，暂无法提供"
      },
      "营养管理": "因未明确情况，暂无法提供"
    }
  }
};

    // 添加AI的分析结果消息
    messages.value.push({
      content: response.data,
      isUser: false,
      id: Date.now() + 1,
      isAnalysis: true  // 标记这是一个分析结果消息
    });

    // 自动滚动到底部
    nextTick(() => {
      const container = document.querySelector('.messages-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });

  } catch (error) {
    console.error('发送文件消息失败:', error);
    message.error('发送失败，请重试');
  }
}
const sendOneFileMessage = async (fileList: UploadFile[],question:string) => {
  try {
    const userQuestion = question || '正在对植物健康进行诊断，请稍等';
    
    const messageId = Date.now();
    messages.value.push({
      content: userQuestion,
      isUser: true,
      id: messageId
    });

    const aiMessageId = messageId + 1;
    messages.value.push({
      content: {
        message: "处理中...",
        result: {
          message: "处理中...",
          data_type: "URL",
          imageP_url: fileList[0].url,
          "plant-lab_analysis_result": {
            "plant植物": "",
            "植物当前的生育期": "",
            "叶片生理指标化验结果": {},
            "对植物生长影响": {},
            "原因分析": {},
            "解决方案": {
              "物理防治": "",
              "化学防治": "",
              "化学药剂名称": "",
              "环境调控": {
                "湿度控制": "",
                "光照管理": "",
                "温度干预": ""
              },
              "营养管理": ""
            }
          }
        }
      },
      isUser: false,
      id: aiMessageId,
      isAnalysis: true
    });
    
    loading.value = true;
    let buffer = '';
    
    await axios.post(import.meta.env.VITE_API_CHAT_URL,{
      "data": fileList[0].url,
      "userInfo": {},
      "userPosition": {},
      "sessionID": "134990"
    },{
      onDownloadProgress: (progressEvent: any) => {
        const { responseText } = progressEvent.event.target;
        if (!responseText) return;
        
        const newData = responseText.slice(buffer.length);
        buffer = responseText;
        
        // 处理新增的数据
        const lines = newData.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const dataStr = line.slice(6).trim(); // 移除 'data: ' 前缀
              if (dataStr) {
                console.log('接收到流式数据片段:', dataStr);
                const data = JSON.parse(dataStr);
                
                // 获取当前消息内容，避免覆盖先前的数据
                const lastMessage = messages.value[messages.value.length - 1];
                if (!lastMessage.isUser && lastMessage.isAnalysis) {
                  const currentContent = { ...lastMessage.content };
                  
                  // 更新消息内容
                  if (data.message) {
                    currentContent.message = data.message;
                    currentContent.result.message = data.message;
                  }
                  
                  if (data.data_type) {
                    currentContent.result.data_type = data.data_type;
                  }
                  
                  // 如果接收到data字段，它就是图片URL
                  if (data.data) {
                    currentContent.result.imageP_url = data.data;
                  }
                  
                  // 如果接收到完整的分析结果
                  if (data["plant-hospital_analysis_result"] || data["plant-lab_analysis_result"]) {
                    // 直接使用原始数据格式，不再进行数据转换
                    const plantResult = data["plant-hospital_analysis_result"] || data["plant-lab_analysis_result"];
                    console.log('接收到植物分析结果:', plantResult);
                    
                    // 使用深拷贝更新数据，避免引用类型问题
                    currentContent.result["plant-lab_analysis_result"] = JSON.parse(JSON.stringify(plantResult));
                    
                    // 确保 Outputmessages 和 solution 字段都被正确保留
                    if (plantResult.Outputmessages && Array.isArray(plantResult.Outputmessages) && plantResult.Outputmessages.length > 0) {
                      console.log('处理 Outputmessages 数据:', plantResult.Outputmessages);
                      
                      // 完全替换 plant-hospital_analysis_result，而不是只设置 Outputmessages
                      currentContent.result["plant-hospital_analysis_result"] = JSON.parse(JSON.stringify(plantResult));
                      
                      // 检查并记录 solution 字段
                      if (plantResult.Outputmessages[0].solution) {
                        console.log('接收到 solution 数据:', plantResult.Outputmessages[0].solution);
                        
                        // 确保 solution 字段被正确保存
                        if (!currentContent.result["plant-hospital_analysis_result"].Outputmessages[0].solution) {
                          currentContent.result["plant-hospital_analysis_result"].Outputmessages[0].solution = 
                            JSON.parse(JSON.stringify(plantResult.Outputmessages[0].solution));
                        }
                      }
                    }
                    
                    // 确保解决方案对象结构完整 - 仅为旧版组件准备
                    if (!isNewFormat(currentContent) && !currentContent.result["plant-lab_analysis_result"]["解决方案"]) {
                      currentContent.result["plant-lab_analysis_result"]["解决方案"] = {
                        '物理防治': '',
                        '化学防治': '',
                        '化学药剂名称': '',
                        '环境调控': {
                          '湿度控制': '',
                          '光照管理': '',
                          '温度干预': ''
                        },
                        '营养管理': ''
                      };
                    } else if (!isNewFormat(currentContent) && !currentContent.result["plant-lab_analysis_result"]["解决方案"]["环境调控"]) {
                      currentContent.result["plant-lab_analysis_result"]["解决方案"]["环境调控"] = {
                        '湿度控制': '',
                        '光照管理': '',
                        '温度干预': ''
                      };
                    }
                  }
                  
                  // 如果接收到了完整的结果对象
                  if (data.result) {
                    // 保留图片URL
                    const imageUrl = currentContent.result.imageP_url;
                    currentContent.result = {
                      ...data.result,
                      imageP_url: data.result.imageP_url || imageUrl
                    };
                  }
                  
                  // 更新位置和天气信息
                  if (data.client_ip) currentContent.result.client_ip = data.client_ip;
                  if (data.location) currentContent.result.location = data.location;
                  if (data.formatted_address) currentContent.result.formatted_address = data.formatted_address;
                  if (data.weatherResult) currentContent.result.weatherResult = data.weatherResult;
                  if (data.image_analysis_result) currentContent.result.image_analysis_result = data.image_analysis_result;
                  
                  // 更新消息，使用深拷贝确保Vue能检测到变化
                  lastMessage.content = JSON.parse(JSON.stringify(currentContent));
                }
              }
            } catch (e) {
              console.error('解析响应数据失败:', e, line);
            }
          }
        }

        // 自动滚动到底部
        nextTick(() => {
          const container = document.querySelector('.messages-container');
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        });
      },
      responseType: 'text',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('发送文件消息失败:', error);
    message.error('发送失败，请重试');
  } finally {
    loading.value = false;
  }
}

const Demo = () => {
  const open = ref(false);
  const items = ref<UploadFile<any>[]>([]);
  const text = ref('');
  const loading = ref(false);
  const attachmentsRef = ref<any>(null);
  const senderRef = ref<InstanceType<typeof Sender>>();
  
  // 动态计算高度
  const inputHeight = computed(() => isOpen.value ? '220px' : '80px');

  // 统一的文件处理函数
  const handleFileUpload = async (file: File) => {
    console.log('上传文件 ');
    if (loading.value) return; // 防止重复上传
    
    // 根据pageType限制上传图片数量
    if (pageType.value === 'chat' && fileList.value.length >= 1) {
      message.warning('聊天模式下只能上传1张图片');
      return false;
    } else if (pageType.value === 'image' && fileList.value.length >= 2) {
      message.warning('图像分析模式最多只能上传2张图片');
      return false;
    }
    
    try {
      loading.value = true;
      const url = await uploadToOSS(file);
      
      const fileInfo: UploadFile<any> = {
        uid: Date.now().toString(),
        name: file.name,
        status: 'done',
        url: url,
        type: file.type,
        size: file.size,
        lastModifiedDate: new Date(file.lastModified),
      };
      // 追加新文件到现有列表
      fileList.value = [...fileList.value, fileInfo];
      console.log('fileList.value11111',fileList.value, fileListData.value);

      // 根据模式给出提示
      if (pageType.value === 'image' && fileList.value.length === 1) {
        message.success('文件上传成功，请再上传一张图片以进行对比分析');
      } else {
        message.success('文件上传成功');
      }
      
      return url;
    } catch (error) {
      message.error('文件上传失败');
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const senderHeader = computed(() => (
    <Sender.Header
      title="附件"
      styles={{
        content: {
          padding: 0,
        },
      }}
      open={isOpen.value}
      onOpenChange={(v: boolean) => {
        isOpen.value = v;
      }}
      forceRender
    >
      <Attachments
        ref={attachmentsRef}
        beforeUpload={async (file) => {
          try {
            await handleFileUpload(file);
          } catch {
            // 错误已在 handleFileUpload 中处理
          }
          return false; // 始终阻止默认上传行为
        }}
        fileList={fileList.value}
        onChange={({ fileList: newFileList }) => {
          console.log('onChange 触发，新文件列表：', newFileList, fileList.value);
          
          // 如果是删除操作，更新文件列表
          if (newFileList.length < fileList.value.length) {
            // 根据 name 字段对比，保留仍然存在的文件
            fileList.value = fileList.value.filter(file => 
              newFileList.some(newFile => newFile.name === file.name)
            );
          }
          
          console.log('更新后的文件列表：', fileList.value);
        }}
        placeholder={(type) =>
          type === 'drop'
            ? {
              title: '将文件拖拽到这里',
            }
            : {
              icon: <CloudUploadOutlined />,
              title: '上传文件',
              description: '点击或将文件拖拽到此区域上传',
            }
        }
        getDropContainer={() => senderRef.value?.nativeElement}
      />
    </Sender.Header>
  ));

  // 动态计算按钮文本
  const buttonText = computed(() => {
    if (fileList.value.length === 0) {
      return '发送';
    } else if (pageType.value === 'image') {
      // 图像分析模式
      if (fileList.value.length === 1) {
        return '请再上传一张图片';
      } else if (fileList.value.length === 2) {
        return '开始双图分析';
      }
    } else {
      // 聊天模式
      return '植物自动体检';
    }
    return '发送';
  });

  // 动态处理输入框提示文本
  const inputPlaceholder = computed(() => {
    if (fileList.value.length === 0) {
      return "请输入消息...";
    } else if (pageType.value === 'image') {
      if (fileList.value.length === 1) {
        return "请再上传一张图片进行对比分析";
      } else if (fileList.value.length === 2) {
        return "点击「开始双图分析」按钮进行图像对比分析";
      }
    } else {
      return "点击「植物自动体检」按钮进行植物分析";
    }
    return "请输入消息...";
  });

  // 动态处理输入框是否禁用
  const isInputDisabled = computed(() => {
    return fileList.value.length > 0;
  });

  // 处理发送消息
  const handleSubmit = async () => {
    if (!text.value.trim() && fileList.value.length === 0) {
      message.warning('请输入内容或上传文件');
      return;
    }

    try {
      loading.value = true;
      if (fileList.value.length > 0) {
        // 根据页面类型和图片数量决定调用哪个接口
        if (pageType.value === 'image') {
          // 图像模式下，严格要求两张图片
          if (fileList.value.length === 2) {
            console.log('发送双图片消息');
            await sendFileMessage(fileList.value, '');
          } else {
            // 图像模式下，如果不是两张图片，提示用户并阻止发送
            message.warning('图像分析模式需要上传两张图片才能发送');
            loading.value = false;
            return;
          }
        } else if (pageType.value === 'chat') {
          // 聊天模式下，一张图调用单图接口
          if (fileList.value.length === 1) {
            console.log('发送单图片消息');
            await sendOneFileMessage(fileList.value, '');
          } else if (fileList.value.length > 1) {
            // 在聊天模式下如果上传了多张图片，只发送第一张
            console.log('聊天模式只使用第一张图片');
            await sendOneFileMessage([fileList.value[0]], '');
          }
        }
      } else {
        // 发送文字消息
        await sendTalk(text.value);
      }
      
      // 清空输入和文件列表
      text.value = '';
      fileList.value = [];
      fileListData.value = [];
      isOpen.value = false;
    } catch (error) {
      message.error(`发送失败:${error}`);
    } finally {
      loading.value = false;
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <Flex 
        style={{ 
          height: inputHeight.value,
          transition: 'height 0.3s ease',
          overflow: 'visible'
        }} 
        align="end"
      >
        <Sender
          ref={senderRef}
          header={senderHeader.value}
          prefix={
            <Button
              type="text"
              icon={<LinkOutlined />}
              onClick={() => isOpen.value = !isOpen.value}
            />
          }
          submitType="shiftEnter"
          value={text.value}
          loading={loading.value}
          onChange={v => text.value = v}
          disabled={isInputDisabled.value}
          placeholder={inputPlaceholder.value}
          onPasteFile={async (file) => {
            if (attachmentsRef.value?.current && !loading.value) {
              isOpen.value = true;
              await handleFileUpload(file);
            }
          }}
          onSubmit={handleSubmit}
          actions={(defaultActionNode) => {
            // 自定义发送按钮
            return (
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={loading.value}
              >
                {buttonText.value}
              </Button>
            );
          }}
        />
      </Flex>
    </div>
  );
};
const welcomeCom = () => {
  // 根据页面类型设置标题
  const getTitle = () => {
    switch (pageType.value) {
      case 'image':
        return '您好，这里是植物化验检测室';
      case 'chat':
        return '您好，这里是植物医生';
      default:
        return '您好，这里是植物医生';
    }
  };

  // 根据页面类型设置描述
  const getDescription = () => {
    switch (pageType.value) {
      case 'image':
        return '基于先进的大语言模型，提供专业的土壤检测和施肥方案';
      case 'chat':
        return '基于先进的大语言模型，提供自然流畅的对话体验';
      default:
        return '基于先进的大语言模型，提供自然流畅的对话体验';
    }
  };

  return (
    <Welcome
      icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
      title={getTitle()}
      description={getDescription()}
    />
  );
};

</script>

<style scoped lang="scss">
.talk-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  position: relative;

  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    padding-bottom: 80px;
   
  }
  .messages-container-open {
    padding-bottom: 240px;
  }

  .input-container {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 800px;
    background: #fff;
    // padding: 20px;
    // box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
    // border-top: 1px solid #f0f0f0;
  }

  :deep(.ant-flex) {
    width: 100%;
  }
}

.typing-indicator {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: 8px;

  span {
    width: 4px;
    height: 4px;
    background: #999;
    border-radius: 50%;
    animation: typing 1s infinite;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

@keyframes typing {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}
</style>