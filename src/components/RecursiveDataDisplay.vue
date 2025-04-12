<template>
  <div :class="containerClass">
    <template v-if="typeof data === 'object' && data !== null && !Array.isArray(data)">
      <div v-for="(value, key) in data" :key="key" class="nested-content">
        <div v-if="shouldShowTitle(value, key)" :class="'level-' + level + '-title'">{{ key }}</div>
        <recursive-data-display
          v-if="isObject(value)"
          :data="value"
          :name="key"
          :level="level + 1"
        />
        <div v-else class="info-item">
          <template v-if="!isObject(value)">
            <label v-if="!Array.isArray(data)">{{ key }}：</label>
            <span v-if="Array.isArray(value)">{{ value.join('；') }}</span>
            <span v-else>{{ value }}</span>
          </template>
        </div>
      </div>
    </template>
    <template v-else-if="Array.isArray(data)">
      <div class="info-item" v-for="(item, index) in data" :key="index">
        <span>{{ item }}</span>
      </div>
    </template>
    <template v-else>
      <div class="info-item">
        <span>{{ data }}</span>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RecursiveDataDisplay',
  props: {
    data: {
      type: [Object, Array, String, Number, Boolean],
      required: true
    },
    name: {
      type: String,
      required: true
    },
    level: {
      type: Number,
      default: 1
    }
  },
  computed: {
    containerClass() {
      return {
        'nested-container': true,
        [`level-${this.level}-container`]: true
      }
    }
  },
  methods: {
    isObject(value: any): boolean {
      return typeof value === 'object' && value !== null;
    },
    shouldShowTitle(value: any, key: string): boolean {
      return this.isObject(value) && !Array.isArray(value);
    }
  }
});
</script>

<style scoped lang="scss">
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