<template>
    <div class="welcome-container">
        <div class="welcome-content">
            <img :src="icon" alt="欢迎图标" class="welcome-icon" />
            <h1 class="welcome-title">{{ title }}</h1>
            <p class="welcome-description">{{ description }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    icon: string;
    title: string;
    description: string;
}>();
</script>

<style scoped lang="scss">
.welcome-container {
    padding: 40px 20px;
    text-align: center;
    background: linear-gradient(to bottom, #f0f5ff, #ffffff);
    border-radius: 8px;
    margin-bottom: 30px;
}

.welcome-content {
    max-width: 800px;
    margin: 0 auto;
}

.welcome-icon {
    width: 80px;
    height: 80px;
    margin-bottom: 20px;
}

.welcome-title {
    font-size: 28px;
    color: #1890ff;
    margin-bottom: 16px;
}

.welcome-description {
    font-size: 16px;
    color: #666;
    line-height: 1.6;
}
</style> 