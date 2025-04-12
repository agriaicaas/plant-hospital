<!--
 
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->


<template>
  <App class="warp">
    <div class="chat-input">
      <welcomeCom />    
      <Demo />
  </div>
  </App>
</template>
<script setup lang="tsx">
import { CloudUploadOutlined, LinkOutlined } from '@ant-design/icons-vue';
import { App, Button, Flex, theme, Typography } from 'ant-design-vue';
import { Sender, Welcome, Attachments } from 'ant-design-x-vue';
import { computed, ref, defineComponent, h } from 'vue';
import type { UploadFile } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { sendMessage } from '@/api/chat';
import { useRouter } from 'vue-router';
import { uploadToOSS } from '@/utils/oss';

defineOptions({ name: 'AXSenderHeader' });

const { token } = theme.useToken();
const open = ref<boolean>(false);
const router = useRouter();
const fileList = ref<UploadFile[]>([]);

const welcomeCom = () => {
  return (
    <Welcome
      icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
      title="你好，这里是植物医院"
      description="基于 Ant Design 的智能产品界面解决方案，创造更好的智能体验~"
    />
  );
};

// 处理文件上传
const handleFileUpload = async (file: File) => {
  try {
    console.log('开始上传文件:', file.name);
    const url = await uploadToOSS(file);
    
    // 检查是否已经存在同名文件，避免重复上传
    const isFileExists = fileList.value.some(f => f.name === file.name);
    if (isFileExists) {
      console.log('文件已存在:', file.name);
      return null;
    }
    
    const fileInfo: UploadFile = {
      uid: Date.now().toString(),
      name: file.name,
      status: 'done',
      url: url,
      type: file.type,
      size: file.size,
      lastModifiedDate: new Date(file.lastModified)
    };
    
    console.log('文件上传成功，添加到列表:', file.name);
    // 添加文件到列表
    fileList.value = [...fileList.value, fileInfo];
    message.success('文件上传成功');
    
    return url;
  } catch (error) {
    console.error('文件上传失败:', error);
    message.error('文件上传失败');
    throw error;
  }
};

const Demo = () => {
  const open = ref(false);
  const items = ref<UploadFile[]>([]);
  const text = ref('');
  const loading = ref(false);
  const attachmentsRef = ref<any>(null);
  const senderRef = ref<InstanceType<typeof Sender>>();

  const senderHeader = computed(() => (
    <Sender.Header
      title="附件"
      styles={{
        content: {
          padding: 0,
        },
      }}
      open={open.value}
      onOpenChange={v => open.value = v}
      forceRender
    >
      <Attachments
        ref={attachmentsRef}
        beforeUpload={async (file) => {
          try {
            console.log('beforeUpload 触发:', file.name);
            await handleFileUpload(file);
          } catch {
            // 错误已在 handleFileUpload 中处理
          }
          return false; // 阻止默认上传行为
        }}
        items={fileList.value}
        onChange={({ fileList: newFileList }) => {
          console.log('onChange 触发，文件数量:', newFileList?.length, '当前列表数量:', fileList.value.length);
          
          // 只在删除操作时更新文件列表
          if (newFileList?.length < fileList.value.length) {
            console.log('检测到删除操作');
            // 根据 uid 字段对比，保留仍然存在的文件
            fileList.value = fileList.value.filter(file => 
              newFileList.some(newFile => newFile.uid === file.uid)
            );
            console.log('删除后文件列表:', fileList.value.map(f => f.name));
          }
        }}
        placeholder={(type) =>
          type === 'drop'
            ? {
              title: '将文件拖拽到这里',
            }
            : {
              icon: h(CloudUploadOutlined),
              title: '上传文件',
              description: '点击或将文件拖拽到此区域上传',
            }
        }
        getDropContainer={() => senderRef.value?.nativeElement}
      />
    </Sender.Header>
  ));

  return (
    <Flex style={{ height: '220px' }} align="end">
      <Sender
        ref={senderRef}
        header={senderHeader.value}
        prefix={
          <Button
            type="text"
            icon={<LinkOutlined />}
            onClick={() => {
              open.value = !open.value;
            }}
          />
        }
        submitType="shiftEnter"
        value={text.value}
        loading={loading.value}
        onChange={v => text.value = v}
        onPasteFile={async (file) => {
          if (attachmentsRef.value?.current) {
            open.value = true;
            await handleFileUpload(file);
          }
        }}
        onSubmit={async () => {
          if (!text.value.trim() && fileList.value.length === 0) {
            message.warning('请输入内容或上传图片');
            return;
          }
          
          try {
            // 存储当前问题，用于在 talk 页面显示
            localStorage.setItem('lastQuestion', text.value);
            
            // 检查是否有图片上传
            if (fileList.value.length > 0) {
              // 如果图片数量不是2张，给出提示
              if (fileList.value.length !== 2) {
                message.warning(`需要上传两张图片，当前已上传 ${fileList.value.length} 张`);
                console.log('当前图片列表:', fileList.value.map(f => ({name: f.name, url: f.url})));
                return;
              }
              
              // 将图片URL存储到localStorage
              const imageUrls = fileList.value.map(file => file.url);
              console.log('保存到localStorage的图片:', imageUrls);
              localStorage.setItem('uploadedImages', JSON.stringify(imageUrls));
            } else {
              // 清除之前可能存在的图片URL
              localStorage.removeItem('uploadedImages');
            }
            
            // 跳转到 talk 页面
            router.push({
              path: '/talk',
              query: {
                q: text.value, // 将问题作为参数传递
                hasImages: fileList.value.length > 0 ? 'true' : 'false' // 标记是否有图片
              }
            });
          } catch (error) {
            console.error('处理提交失败:', error);
            message.error('提交失败，请重试');
          }
        }}
      />
    </Flex>
  );
};
</script>
<style scoped lang="scss">
.warp {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .chat-input {
    width: 100%;
    max-width: 800px;
  }
}
</style>
