<template>
  <div class="home">
    <!-- 使用手册链接 -->
    <div class="manual-link">
      <a href="https://docs.qq.com/doc/p/ba1372d953c0a8432bd5b2d4f96a156b8b57b66d" target="_blank">Plant-Hospital 植物医院使用手册</a>
    </div>
    
    <!-- Banner 部分 -->
    <section class="banner">
      <div class="banner-content">
        <h1>Plant-Hospital 植物医院 AI Agent</h1>
        <p>让 AI 为您提供智能、高效、专业的服务</p>
        <button class="start-btn" style="margin-right: 10px;" @click="startUsing('chat')">植物医生</button>
        <button class="start-btn" @click="startUsing('image')" style="margin-right: 10px;">植物化验检测室</button>
        <button class="start-btn"  @click="starSoil">土壤化验检测室</button>

        <button class="start-btn" style="margin-left: 10px;" @click="goToJD">植物用药大药房</button>

      </div>
    </section>

    <!-- 功能介绍部分 -->
    <section class="features">
      <h2>我们的优势</h2>
      <div class="feature-grid">
        <div class="feature-item">
          <div class="icon">🤖</div>
          <h3>智能农业 Al Agent</h3>
          <p>基于先进的大语言模型，提供自然流畅的对话体验</p>
        </div>
        <div class="feature-item">
          <div class="icon">⚡</div>
          <h3>快速响应</h3>
          <p>毫秒级响应，让您无需等待</p>
        </div>
        <div class="feature-item">
          <div class="icon">🎯</div>
          <h3>精准理解</h3>
          <p>精准理解植物生长，提供最合适的解决方案</p>
        </div>
      </div>
    </section>

    <!-- 公司介绍部分 -->
    <section class="about">
      <h2>关于我们</h2>
      <div class="about-content">
        <p>我们是一家专注于人工智能技术解决植物生长健康情况识别，并给出治疗方案的智慧农业企业。致力于为用户提供最优质的 智慧农业AI 服务，让植物医院AI Agent随时为您服务。按照植物检测（化验结果）→植物医生（按照化验结果诊断）→处方用药（植物用药大药房）科学流程复刻医院诊治流程，提供完整的植物健康解决方案。</p>
      </div>
    </section>

    <!-- 联系方式部分 -->
    <section class="contact">
      <h2>联系我们</h2>
      <div class="contact-info">
        <div class="contact-item">
          <i class="icon">📧</i>
          <span>邮箱：wangshuai@agriai.tech  </span>
        </div>
        <div class="contact-item">
          <i class="icon">📱</i>
          <span>电话：185-1162-3375</span>
        </div>
       
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const startUsing = (type: string) => {
  router.push({
    path:'/talk',
    query: {
      type: type
    }
  })
}

const starSoil = () => {
  router.push({
    path: '/soil',
    query: {
      type: 'soil'
    }
  })
}
const goToJD = () => {
  window.open('https://search.jd.com/Search?keyword=园艺药剂', '_blank')
}

</script>

<style scoped lang="scss">
.home {
  width: 100%;
  min-width: $container-lg;
  position: relative;

  .manual-link {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 10;
    
    a {
      display: inline-block;
      color: $white;
      text-decoration: none;
      padding: 8px 15px;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      font-weight: bold;
      transition: all 0.3s ease;
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
      }
    }
  }

  .banner {
    height: 600px;
    background: linear-gradient(135deg, $secondary-color 0%, $primary-color 100%);
    @include flex-center;
    color: $white;
    text-align: center;

    .banner-content {
      min-width: $container-md;
      padding: 0 $spacing-md;

      h1 {
        font-size: $font-size-xxxl;
        margin-bottom: $spacing-md;
        font-weight: bold;
      }

      p {
        font-size: $font-size-xl;
        margin-bottom: $spacing-xl;
      }

      .start-btn {
        width: 200px;
        height: 50px;
        font-size: $font-size-lg;
        background: $white;
        color: $primary-color;
        @include button;
      }
    }
  }

  .features {
    padding: $spacing-xxxl 0;
    background: $bg-light;

    h2 {
      @include title;
    }

    .feature-grid {
      @include container;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: $spacing-lg;

      .feature-item {
        text-align: center;
        padding: $spacing-xl;
        @include card;

        .icon {
          font-size: $font-size-xxxl;
          margin-bottom: $spacing-md;
        }

        h3 {
          margin-bottom: $spacing-sm;
          font-size: $font-size-xl;
          color: $text-color;
          font-weight: bold;
        }

        p {
          color: $text-light;
          font-size: $font-size-base;
          line-height: 1.6;
        }
      }
    }
  }

  .about {
    padding: $spacing-xxxl 0;
    text-align: center;
    background: $white;

    h2 {
      @include title;
    }

    .about-content {
      @include container($container-md);
      font-size: $font-size-lg;
      line-height: 1.8;
      color: $text-light;
    }
  }

  .contact {
    padding: $spacing-xxxl 0;
    background: $bg-light;

    h2 {
      @include title;
    }

    .contact-info {
      @include container($container-sm);

      .contact-item {
        @include flex-center;
        margin-bottom: $spacing-md;
        padding: $spacing-md;
        @include card;

        .icon {
          font-size: $font-size-xl;
          margin-right: $spacing-sm;
        }

        span {
          color: $text-light;
          font-size: $font-size-base;
        }
      }
    }
  }
}
</style>
