<!--
 
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div :style="{ height: 'auto', minHeight: '100px' }">
    <Bubble
      :typing="true"
      :content="''"
      :message-render="() => renderAnalysisResult(analysisResult)"
      :avatar="{ icon: h(UserOutlined) }"
    />
  </div>
</template>

<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue';
import { Bubble } from 'ant-design-x-vue';
import type { BubbleProps } from 'ant-design-x-vue';
import { Typography } from 'ant-design-vue';
import markdownit from 'markdown-it';
import { h } from 'vue';

// 定义props
const props = defineProps<{
  analysisResult: {
    message: string;
    result: {
      message: string;
      data_type: string;
      imageP_url: string;
      imageL_url: string;
      'plant-lab_analysis_result': {
        'plant植物': string;
        '植物当前的生育期': string;
        '叶片生理指标化验结果': {
          [key: string]: {
            '检测结果': string;
            '标准值范围': string;
            '结果判断': string;
          }
        };
        '对植物生长影响': {
          [key: string]: string;
        };
        '原因分析': {
          [key: string]: string;
        };
        '解决方案': {
          '物理防治': string;
          '化学防治': string;
          '化学药剂名称': string;
          '环境调控': {
            '湿度控制': string;
            '光照管理': string;
            '温度干预': string;
          };
          '营养管理': string;
        };
        'response_format'?: {
          'type': string;
        };
      };
    }
  }
}>();

const md = markdownit({ html: true, breaks: true });

// 分析结果渲染函数
// 分析结果渲染函数
const renderAnalysisResult = (result: typeof props.analysisResult) => {
  console.log('result',result);
  
  // 检查是否未检测到植物
  const isPlantNotDetected = result.result.message === '未检测到植物，请重新输入' || 
                            result.result['plant-lab_analysis_result']['plant植物'] === '未检测到植物，请重新输入';
  
  // 基本信息部分
  let markdown = `
## 图像分析结果

**基本信息**
- 状态：${result.result.message}`
if (!isPlantNotDetected) {
  markdown += `
- 分析类型：${result.result.data_type}

### 图像预览
![图片P](${result.result.imageP_url})
![图片L](${result.result.imageL_url})
`;


    // 获取叶片生理指标的键值对
    const physiologicalIndicators = Object.entries(result.result['plant-lab_analysis_result']['叶片生理指标化验结果']).map(([key, value]) => {
      return `
#### ${key}
- 检测结果：${value['检测结果']}
- 标准值范围：${value['标准值范围']}
- 结果判断：${value['结果判断']}
`;
    }).join('\n');

    // 获取对植物生长影响的键值对
    const growthEffects = Object.entries(result.result['plant-lab_analysis_result']['对植物生长影响']).map(([key, value]) => {
      return `- **${key}**：${value}`;
    }).join('\n');

    // 获取原因分析的键值对
    const causeAnalysis = Object.entries(result.result['plant-lab_analysis_result']['原因分析']).map(([key, value]) => {
      return `- **${key}**：${value}`;
    }).join('\n');

    // 添加植物信息和详细分析结果
    markdown += `
### 植物信息
- 植物：${result.result['plant-lab_analysis_result']['plant植物']}
- 生育期：${result.result['plant-lab_analysis_result']['植物当前的生育期']}

### 叶片生理指标
${physiologicalIndicators}

### 对植物生长影响
${growthEffects}

### 原因分析
${causeAnalysis}

### 解决方案
- **物理防治**：${result.result['plant-lab_analysis_result']['解决方案']['物理防治']}
- **化学防治**：${result.result['plant-lab_analysis_result']['解决方案']['化学防治']}
- **化学药剂**：${result.result['plant-lab_analysis_result']['解决方案']['化学药剂名称']}

#### 环境调控建议
- 湿度控制：${result.result['plant-lab_analysis_result']['解决方案']['环境调控']['湿度控制']}
- 光照管理：${result.result['plant-lab_analysis_result']['解决方案']['环境调控']['光照管理']}
- 温度干预：${result.result['plant-lab_analysis_result']['解决方案']['环境调控']['温度干预']}

#### 营养管理
${result.result['plant-lab_analysis_result']['解决方案']['营养管理']}
`;
  }

  return h(Typography, null, {
    default: () => h('div', { 
      innerHTML: md.render(markdown),
      style: {
        padding: '20px',
        'max-width': '800px',
        margin: '0 auto'
      }
    })
  });
};
</script>

<style scoped>
:deep(img) {
  max-width: 100%;
  height: auto;
  margin: 10px 0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

:deep(h2) {
  color: #1890ff;
  margin-bottom: 20px;
}

:deep(h3) {
  color: #333;
  margin: 16px 0;
}

:deep(h4) {
  color: #666;
  margin: 12px 0;
}
</style>
