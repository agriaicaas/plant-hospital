<!--
 * @Author: 吴伟 15711376175@163.com
 * @Date: 2025-03-31 15:20:20
 * @LastEditors: 吴伟 15711376175@163.com
 * @LastEditTime: 2025-04-10 20:18:14
 * @FilePath: /ai/src/views/soil.vue
 * @Description: 土壤化验检测室
*/
-->
<template>
    <div class="soil-container">
        <h1 class="page-title">土壤化验检测室</h1>
        
        <div class="form-container">
            <!-- 第一步：土壤检测 -->
            <div class="step-container">
                <div class="step-header">
                    <div class="step-icon">
                        <span >土壤检测</span>
                    </div>
                </div>
                <div v-if="isTestLoading" class="loading-container">
                    <div class="loading-spinner"></div>
                    <span class="loading-text">正在获取土壤检测数据，请稍候...</span>
                </div>
                <div class="step-description">
                    <!-- 土壤检测结果 -->
                    <div v-if="soilShowResults" class="soil-test-results">
                        <div class="result-panel">
                            <div v-if="soilTestResults.address" class="location-info">
                                <h3>检测位置</h3>
                                <p>{{ soilTestResults.address }}</p>
                            </div>
                            <div class="weather-data">
                                <h3>24小时气象数据分析</h3>
                                <div class="data-grid">
                                    <div class="data-item">
                                        <h4>气温 (℃)</h4>
                                        <p>最高: {{ soilTestResults.weatherData.temperature.max.toFixed(1) }}</p>
                                        <p>最低: {{ soilTestResults.weatherData.temperature.min.toFixed(1) }}</p>
                                    </div>
                                    <div class="data-item">
                                        <h4>空气湿度 (%)</h4>
                                        <p>最高: {{ soilTestResults.weatherData.humidity.max.toFixed(1) }}</p>
                                        <p>最低: {{ soilTestResults.weatherData.humidity.min.toFixed(1) }}</p>
                                    </div>
                                    <div class="data-item">
                                        <h4>降水量 (mm)</h4>
                                        <p>最高: {{ soilTestResults.weatherData.precipitation.max.toFixed(1) }}</p>
                                        <p>最低: {{ soilTestResults.weatherData.precipitation.min.toFixed(1) }}</p>
                                    </div>
                                    <div class="data-item">
                                        <h4>蒸腾蒸散量 (mm)</h4>
                                        <p>最高: {{ soilTestResults.weatherData.evapotranspiration.max.toFixed(3) }}</p>
                                        <p>最低: {{ soilTestResults.weatherData.evapotranspiration.min.toFixed(3) }}</p>
                                    </div>
                                    <div class="data-item">
                                        <h4>土壤温度 (℃)</h4>
                                        <p>最高: {{ soilTestResults.weatherData.soilTemperature.max.toFixed(1) }}</p>
                                        <p>最低: {{ soilTestResults.weatherData.soilTemperature.min.toFixed(1) }}</p>
                                    </div>
                                    <div class="data-item">
                                        <h4>土壤湿度 (%)</h4>
                                        <p>最高: {{ (soilTestResults.weatherData.soilMoisture.max * 100).toFixed(1) }}</p>
                                        <p>最低: {{ (soilTestResults.weatherData.soilMoisture.min * 100).toFixed(1) }}</p>
                                    </div>
                                    <div class="data-item">
                                        <h4>太阳辐照度 (W/m²)</h4>
                                        <p>最高: {{ soilTestResults.weatherData.radiation.max.toFixed(1) }}</p>
                                        <p>最低: {{ soilTestResults.weatherData.radiation.min.toFixed(1) }}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 添加土壤养分指标部分 -->
                            <div class="soil-nutrients">
                                <h3>土壤养分检测结果</h3>
                                <div class="data-grid">
                                    <div class="data-item">
                                        <h4>铵态氮含量</h4>
                                        <p>{{ soilTestResults.nutrients?.z1?.toFixed(2) || '0.00' }} ppm</p>
                                    </div>
                                    <div class="data-item">
                                        <h4>硝态氮含量</h4>
                                        <p>{{ soilTestResults.nutrients?.z2?.toFixed(2) || '0.00' }} ppm</p>
                                    </div>
                                    <div class="data-item">
                                        <h4>速效全氮含量</h4>
                                        <p>{{ soilTestResults.nutrients?.z3?.toFixed(2) || '0.00' }} ppm</p>
                                    </div>
                                    <div class="data-item">
                                        <h4>有效磷含量</h4>
                                        <p>{{ soilTestResults.nutrients?.z4?.toFixed(2) || '0.00' }} ppm</p>
                                    </div>
                                    <div class="data-item">
                                        <h4>有效钾含量</h4>
                                        <p>{{ soilTestResults.nutrients?.z5?.toFixed(2) || '0.00' }} ppm</p>
                                    </div>
                                    <div class="data-item">
                                        <h4>有机质含量</h4>
                                        <p>{{ soilTestResults.nutrients?.z6?.toFixed(2) || '0.00' }} %</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                <button class="submit-btn" @click="handleSoilTest" style="cursor: pointer;">开始检测</button>
            </div>
            </div>
          

            <!-- 第二步：测土配方施肥 -->
            <div class="step-container">
                <div class="step-header">
                    <div class="step-icon">
                        <span>测土配方施肥</span>
                    </div>
                </div>
                <div class="step-content">
                    <!-- 选项卡 -->
                    <div class="tabs">
                        <div 
                            class="tab" 
                            :class="{ 'active': activeTab === 'crop' }" 
                            @click="activeTab = 'crop'"
                        >
                            作物
                        </div>
                        <div 
                            class="tab" 
                            :class="{ 'active': activeTab === 'plant' }" 
                            @click="activeTab = 'plant'"
                        >
                            植物
                        </div>
                    </div>
                    
                    <!-- 作物表单 -->
                    <div class="input-form" v-if="activeTab === 'crop'">
                        <div class="form-row">
                            <div class="form-item">
                                <label>作物：</label>
                                <div class="input-with-unit">
                                    <input type="text" placeholder="(输入)" v-model="cropName"/>
                                    <!-- <span class="unit">斤/亩</span> -->
                                </div>
                            </div>
                            <div class="form-item">
                                <label>期望产量：</label>
                                <div class="input-with-unit">
                                    <input type="number" placeholder="请输入数字" v-model="expectedYield"/>
                                    <span class="unit">斤/亩</span>
                                </div>
                            </div>
                        </div>
                     
                    </div>
                    
                    <!-- 植物表单 -->
                    <div class="input-form" v-if="activeTab === 'plant'">
                        <div class="form-row">
                            <div class="form-item">
                                <label>植物名称：</label>
                                <div class="input-with-unit">
                                    <input type="text" placeholder="请输入植物名称" v-model="plantName"/>
                                </div>
                            </div>
                            <div class="form-item">
                                <label>种植方式：</label>
                                <select v-model="plantingMethod">
                                    <option value="园林养护">园林养护</option>
                                    <option value="家庭园艺">家庭园艺</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-item">
                                <label>种植目标：</label>
                                <div class="checkbox-group">
                                    <label class="checkbox-item">
                                        <input type="checkbox" value="花多鲜艳" v-model="plantingGoal" />
                                        <span>花多鲜艳</span>
                                    </label>
                                    <label class="checkbox-item">
                                        <input type="checkbox" value="茎叶翠绿" v-model="plantingGoal" />
                                        <span>茎叶翠绿</span>
                                    </label>
                                    <label class="checkbox-item">
                                        <input type="checkbox" value="抗病抗逆" v-model="plantingGoal" />
                                        <span>抗病抗逆</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="button-container">
                <button class="submit-btn" @click="submitAnalysis">开始配肥施肥</button>
            </div>
        </div>

        <!-- 土壤分析结果 -->
        <div v-if="showResults" class="results-container soil-analysis-results">
            <h2>配方施肥方案</h2>
            <div class="result-panel">
                <div v-if="isLoading" class="loading-container">
                    <div class="loading-spinner"></div>
                    <span class="loading-text">正在分析中，请稍候...</span>
                </div>
                <div v-else class="analysis-content">
                    <div>
                        <div v-for="(section, sectionName) in analysisResults" :key="sectionName" class="analysis-section">
                            <h3>{{ sectionName }}</h3>
                            <recursive-data-display 
                                :data="section" 
                                :name="sectionName"
                                :level="1"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineComponent } from 'vue';
import axios from 'axios';
import RecursiveDataDisplay from '@/components/RecursiveDataDisplay.vue';

// 标签页控制
const activeTab = ref('crop');

// 表单数据 - 作物
const cropName = ref('');
const expectedYield = ref('');
const cropRegion = ref('');
const cropSeason = ref('');

// 表单数据 - 植物
const plantName = ref('');
const plantingMethod = ref('');
const plantingGoal = ref([]);

// 结果相关状态
const showResults = ref(false);
const soilShowResults = ref(false);
const isLoading = ref(false);
const analysisResults = ref<any>({});

// 添加响应数据的响应式变量
const soilTestResults = ref({
    address: '',
    weatherData: {
        temperature: { max: 0, min: 0 },
        humidity: { max: 0, min: 0 },
        precipitation: { max: 0, min: 0 },
        evapotranspiration: { max: 0, min: 0 },
        soilTemperature: { max: 0, min: 0 },
        soilMoisture: { max: 0, min: 0 },
        radiation: { max: 0, min: 0 }
    },
    nutrients: {
        z1: 0,
        z2: 0,
        z3: 0,
        z4: 0,
        z5: 0,
        z6: 0
    }
});

// 在 script setup 中的变量声明部分
const isTestLoading = ref(false);

// 提交配方施肥请求
const submitAnalysis = async () => {
    try {
        isLoading.value = true;
        showResults.value = true;
        
        // 根据当前激活的标签页准备数据
        let formData = {};
        
        if (activeTab.value === 'crop') {
            formData = {
                time: getCurrentTime(),
                data: "",
                notes: "test",
                b: { 
                    "作物": cropName.value,
                    "期望产量": expectedYield.value + '斤/亩' 
                } 
            };
        } else {
            formData = {
                time: getCurrentTime(),
                data: "",
                notes: "test",
                b: { 
                    "植物名称": plantName.value,
                    "种植方式": plantingMethod.value,
                    "种植目标": plantingGoal.value.join(',')
                } 
            };
        }
       
        const response = await axios.post(import.meta.env.VITE_API_SOIL_DETECTOR_URL, formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(response, 'response1111');
        

        if (response.data && response.data.result && response.data.result.result0) {
            // 将返回的数据赋值给 analysisResults
            analysisResults.value = {}
            if( response.data.result.result0.response_format) {
                delete response.data.result.result0.response_format
            }
            Object.assign(analysisResults.value, response.data.result.result0);
            console.log(analysisResults.value, 'analysisResults.value');
        }
        
    } catch (error) {
        console.error('土壤分析请求失败:', error);
    } finally {
        isLoading.value = false;
    }
};

// 获取当前时间
function getCurrentTime() {
    const now = new Date();
    // 获取本地时间
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

// 土壤检测请求
const handleSoilTest = async () => {
    try {
        isTestLoading.value = true;
        soilShowResults.value = true;
        const response = await axios.post(import.meta.env.VITE_API_SOIL_TIME_URL, {
            time: getCurrentTime(),
            notes: "test"
        }, {
            headers: {
                'Authorization': `APPCODE ${import.meta.env.VITE_API_SOIL_APPCODE}`,
                'Content-Type': 'application/json'
            }
        });

        const data = response.data.data;
        if (data && data.length > 0) {
            // 设置地址
            soilTestResults.value.address = data[0].address;

            // 获取前24小时的数据并转换为数字类型
            const first24Hours = {
                temperature: Object.values(data[1].temperature_2m).slice(0, 24).map(Number),
                humidity: Object.values(data[1].relative_humidity_2m).slice(0, 24).map(Number),
                precipitation: Object.values(data[1].precipitation).slice(0, 24).map(Number),
                evapotranspiration: Object.values(data[1].et0_fao_evapotranspiration).slice(0, 24).map(Number),
                soilTemperature: Object.values(data[1].soil_temperature_0cm).slice(0, 24).map(Number),
                soilMoisture: Object.values(data[1].soil_moisture_0_to_1cm).slice(0, 24).map(Number),
                radiation: Object.values(data[1].terrestrial_radiation).slice(0, 24).map(Number)
            };

            // 计算每个指标的最大最小值
            soilTestResults.value.weatherData = {
                temperature: {
                    max: Math.max(...first24Hours.temperature),
                    min: Math.min(...first24Hours.temperature)
                },
                humidity: {
                    max: Math.max(...first24Hours.humidity),
                    min: Math.min(...first24Hours.humidity)
                },
                precipitation: {
                    max: Math.max(...first24Hours.precipitation),
                    min: Math.min(...first24Hours.precipitation)
                },
                evapotranspiration: {
                    max: Math.max(...first24Hours.evapotranspiration),
                    min: Math.min(...first24Hours.evapotranspiration)
                },
                soilTemperature: {
                    max: Math.max(...first24Hours.soilTemperature),
                    min: Math.min(...first24Hours.soilTemperature)
                },
                soilMoisture: {
                    max: Math.max(...first24Hours.soilMoisture),
                    min: Math.min(...first24Hours.soilMoisture)
                },
                radiation: {
                    max: Math.max(...first24Hours.radiation),
                    min: Math.min(...first24Hours.radiation)
                }
            };

            // 设置土壤养分数据
            if (data[2]) {
                soilTestResults.value.nutrients = {
                    z1: Number(data[2].z1),
                    z2: Number(data[2].z2),
                    z3: Number(data[2].z3),
                    z4: Number(data[2].z4),
                    z5: Number(data[2].z5),
                    z6: Number(data[2].z6)
                };
            }

        }
    } catch (error) {
        console.error('土壤检测请求失败:', error);
    } finally {
        isTestLoading.value = false;
    }
};

// 注册递归组件
const components = {
    RecursiveDataDisplay
};
</script>   

<style scoped lang="scss">
.soil-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.page-title {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
    font-size: 28px;
}

.form-container {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 30px;
    margin-bottom: 30px;
}

.step-container {
    margin-bottom: 25px;
    border-bottom: 1px solid #eee;
    padding-bottom: 20px;

    &:last-child {
        border-bottom: none;
    }
}

.step-header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.step-icon {
    background-color: #4a90e2;
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    display: inline-block;
    font-weight: bold;
}

.step-description {
    color: #666;
    margin-top: 15px;
    font-size: 14px;
    
    p {
        margin-bottom: 10px;
    }
    
    .detection-list {
        list-style: none;
        padding-left: 20px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 10px;
        
        li {
            position: relative;
            padding-left: 20px;
            
            &:before {
                content: "•";
                position: absolute;
                left: 0;
                color: #1890ff;
                font-size: 16px;
            }
        }
    }
}

.form-row {
    display: flex;
    flex-wrap: wrap;
    margin: 15px 0;
    gap: 20px;
}

.form-item {
    flex: 1;
    min-width: 200px;
    margin-bottom: 15px;

    label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }

    input, select {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;

        &:focus {
            border-color: #4a90e2;
            outline: none;
        }
    }

    select[multiple] {
        height: 100px;
    }
}

.button-container {
    text-align: center;
    margin-top: 30px;
}

.submit-btn {
    background-color: #4a90e2;
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #357ab7;
    }
}

.results-container {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 30px;
    margin-bottom: 30px;

    h2 {
        margin-top: 0;
        color: #333;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
    }
}

.soil-test-results {
    margin-top: 20px;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.result-panel {
    .location-info {
        margin-bottom: 20px;
        padding: 15px;
        background-color: white;
        border-radius: 8px;
        border: 1px solid #e8e8e8;

        h3 {
            margin-bottom: 10px;
            color: #333;
            font-size: 16px;
        }

        p {
            color: #666;
            font-size: 14px;
        }
    }
}

.weather-data {
    h3 {
        margin-bottom: 20px;
        color: #333;
        font-size: 16px;
    }
}
.soil-nutrients {
    h3 {
        margin: 20px 0 ;
        color: #333;
        font-size: 16px;
    }
}

.data-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
}

.data-item {
    padding: 15px;
    background-color: white;
    border-radius: 8px;
    border: 1px solid #e8e8e8;
    
    h4 {
        margin-bottom: 10px;
        color: #1890ff;
        font-size: 14px;
    }
    
    p {
        margin: 5px 0;
        color: #666;
        font-size: 13px;
    }
}

.soil-analysis-results {
    .analysis-section {
        margin-bottom: 25px;

        h3 {
            color: #1890ff;
            margin-bottom: 15px;
            font-size: 18px;
        }
    }

    .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
    }

    .info-item {
        background-color: #f8f9fa;
        padding: 12px;
        border-radius: 6px;

        label {
            color: #666;
            margin-right: 8px;
            font-weight: 500;
        }

        span {
            color: #333;
        }
    }
}

.loading {
    text-align: center;
    padding: 30px;
    color: #666;
}

.result-content {
    pre {
        background-color: #f5f5f5;
        padding: 15px;
        border-radius: 4px;
        overflow: auto;
    }
}

.checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.checkbox-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    
    input[type="checkbox"] {
        width: auto;
        margin-right: 8px;
    }
    
    span {
        font-size: 14px;
    }
}

.tabs {
    display: flex;
    margin-bottom: 20px;
    border-bottom: 1px solid #ddd;
}

.tab {
    padding: 10px 20px;
    cursor: pointer;
    border: 1px solid transparent;
    border-bottom: none;
    border-radius: 4px 4px 0 0;
    transition: all 0.3s;
    margin-right: 5px;
    font-weight: bold;
    
    &:hover {
        background-color: #f0f5ff;
    }
    
    &.active {
        background-color: #e6f7ff;
        border-color: #ddd;
        color: #1890ff;
        position: relative;
        
        &:after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            right: 0;
            height: 2px;
            background-color: white;
        }
    }
}

.input-with-unit {
    position: relative;
    display: flex;
    align-items: center;

    input {
        flex: 1;
        padding-right: 60px; // 为单位留出空间
    }

    .unit {
        position: absolute;
        right: 10px;
        color: #666;
        font-size: 14px;
    }
}

.loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    margin: 15px 0;
    background-color: #f8f9fa;
    border-radius: 8px;
    
    .loading-spinner {
        width: 24px;
        height: 24px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #4a90e2;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: 10px;
    }
    
    .loading-text {
        color: #666;
        font-size: 14px;
    }
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.diagnosis-category {
    margin-bottom: 20px;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e8e8e8;

    h4 {
        color: #1890ff;
        margin-bottom: 15px;
        font-size: 16px;
    }
}

.fertilizer-plan {
    margin-bottom: 20px;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e8e8e8;

    h4 {
        color: #1890ff;
        margin-bottom: 15px;
        font-size: 16px;
    }
}

.fertilizer-details {
    margin-bottom: 15px;
    width: 100%;

    h5 {
        color: #333;
        font-size: 15px;
        margin-bottom: 10px;
        padding-left: 10px;
        border-left: 3px solid #1890ff;
    }
}

.fertilizer-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 10px;
    margin-bottom: 15px;
}

.info-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
}

.nested-container {
    width: 100%;
}

.nested-content {
    margin-bottom: 15px;
}

.level-1-container {
    background-color: #fff;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 20px;
}

.level-2-container {
    background-color: #f8f9fa;
    border-radius: 6px;
    padding: 12px;
    margin: 10px 0;
}

.level-3-container {
    background-color: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 6px;
    padding: 10px;
    margin: 8px 0;
}

.level-4-container {
    background-color: #f8f9fa;
    border: 1px dashed #e8e8e8;
    border-radius: 4px;
    padding: 8px;
    margin: 6px 0;
}

.level-5-container {
    background-color: #fff;
    border: 1px dotted #e8e8e8;
    border-radius: 4px;
    padding: 6px;
    margin: 4px 0;
}

.level-1-title {
    font-size: 18px;
    color: #1890ff;
    margin-bottom: 15px;
    font-weight: bold;
}

.level-2-title {
    font-size: 16px;
    color: #333;
    margin-bottom: 12px;
    padding-left: 10px;
    border-left: 3px solid #1890ff;
}

.level-3-title {
    font-size: 15px;
    color: #666;
    margin-bottom: 10px;
    padding-left: 8px;
    border-left: 2px solid #1890ff;
}

.level-4-title {
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
    padding-left: 6px;
    border-left: 2px solid #40a9ff;
}

.level-5-title {
    font-size: 13px;
    color: #666;
    margin-bottom: 6px;
    padding-left: 4px;
    border-left: 2px solid #69c0ff;
}

.info-item {
    background-color: white;
    padding: 10px;
    border-radius: 4px;
    margin: 4px 0;
    
    label {
        color: #666;
        margin-right: 8px;
        font-weight: 500;
    }
    
    span {
        color: #333;
    }
}
</style>   
