<script setup lang="ts">
  import { ref, reactive, computed } from 'vue';
  import { IconArrowRight, IconLoading, IconClose, IconCheck } from '@arco-design/web-vue/es/icon';
  import { Status, getIndicatorStyle, getSliderStyle } from './utils.ts'
  import { onMounted } from 'vue';
  import { Props, TCaptcha } from './index.vue';

  const {
    containerWidth, // 容器宽度
    sliderWidth, // 滑块宽度
    sliderTip, // 提示
    localMode, //
    captchaSize,

    onFetchCaptcha, // 请求卡片
    onValidateCaptcha, // 校验滑块
  } = withDefaults(defineProps<Props>(), {
    containerWidth: 320,
    sliderWidth: 40,
    sliderTip: '向右拖动滑块完成拼图',
    localMode: 'pop',
    captchaSize: { width: 320, height: 180, frontWidth: 63 },
  })

  const loading = ref<Boolean>(false)

  const status = ref<Status>('ready')
  const tips = ref(sliderTip)
  // 滑块 x 轴距离
  const sliderLeft = ref(0)
  // 拼图 x 轴距离
  const puzzleLeft = ref<Number>(0)
  const captcha = reactive<TCaptcha>({
    bg: '',
    front: '',
  })

  const showPanel = ref<Boolean>(false)

  const sliderBlockRef = ref<HTMLImageElement>()

  // 按下滑块时，鼠标距离窗口左边的距离
  let sliderClientX = 0;
  // 鼠标移动轨迹
  let trail: { x: number; y: number; t: number }[] = [];

  // 根据验证码图片原始宽度和容器宽度比例系数调整尺寸
  const scale = captchaSize.width / containerWidth
  const frontWidth = captchaSize.frontWidth / scale
  const frontHeight = captchaSize.height / scale

  const indicatorStyle = computed(() => getIndicatorStyle(status.value))
  const sliderStyle = computed(() => getSliderStyle(status.value))

  const handleDragMove = (e: MouseEvent | Touch) => {
    trail.push({ x: e.clientX, y: e.clientY, t: Date.now() })
    status.value = 'moving'
    tips.value = ''

    // 限制滑块移动的范围，e.clientX 为鼠标实时距离窗口左边的距离
    let sliderBlockLeft = e.clientX - sliderClientX;
    let sliderImgWidth = 0;
    if (sliderBlockRef.value) {
      sliderImgWidth = sliderBlockRef.value.clientWidth;
    }
    if (sliderBlockLeft < 0) {
      sliderBlockLeft = 0;
    } else if (sliderBlockLeft > containerWidth - sliderWidth) {
      sliderBlockLeft = containerWidth - sliderWidth;
    }

    sliderLeft.value = sliderBlockLeft
    puzzleLeft.value =  (sliderBlockLeft / (containerWidth - sliderWidth)) * (containerWidth - sliderImgWidth)
  }

  const reloadCaptcha = () => {
    sliderLeft.value = 0
    puzzleLeft.value = 0
    tips.value = sliderTip
    status.value = 'ready'
    getCaptcha();
  }

  const validate = () => {
    status.value = 'checking'
    onValidateCaptcha({
      positionX: Number(puzzleLeft.value) * scale,
      trail: trail,
      offsetTop: 0,
    })
      .then((resp) => {
        if (resp.success) {
          status.value = 'success'
          showPanel.value = false
        } else {
          status.value = 'error'
        }
      })
      .catch(() => {
        status.value = 'error'
        setTimeout(() => {
          reloadCaptcha();
        }, 800);
      });
    };

  const handleDragEnd = () => {
    // 调用接口判断验证是否成功
    validate();
    document.onmousemove = null;
    document.onmouseup = null;
  };

  const bindEvents = (el: HTMLElement) => {
    const isReturn = () => {
      return (
        ['checking', 'success', 'error'].includes(status.value) ||
        loading.value
      );
    };
    el.onmousedown = (e) => {
      if (isReturn()) return;
      sliderClientX = e.clientX;
      trail = [];
      document.onmousemove = handleDragMove;
      document.onmouseup = handleDragEnd;
      // 阻止浏览器默认行为
      return false;
    };
    // 兼容移动端
    el.addEventListener(
      'touchstart',
      (e) => {
        if (isReturn()) return;
        sliderClientX = e.targetTouches[0].clientX;
        trail = [];
      },
      false,
    );
    el.addEventListener(
      'touchmove',
      (e) => {
        e.preventDefault();
        if (isReturn()) return;
        handleDragMove(e.targetTouches[0]);
      },
      false,
    );
    el.addEventListener(
      'touchend',
      () => {
        if (isReturn()) return;
        handleDragEnd();
      },
      false,
    );
  }

  const getCaptcha = () => {
    tips.value = '加载中...'
    loading.value = true

    onFetchCaptcha().then(({ bg, front }) => {
      tips.value = sliderTip
      captcha.bg = bg
      captcha.front = front
    }).catch(() => {
      tips.value = '加载失败，请重试'
    }).finally(() => {
      loading.value = false
    })
  }

  const sliderRef = ref<HTMLElement>()
  onMounted(() => {
    if (!sliderRef.value) return
    bindEvents(sliderRef.value)

    getCaptcha()
  })

  const handlePopIn = () => {
    if (localMode === 'fixed' || status.value === 'success') return;
    showPanel.value = true
  }

  const handlePopOut = () => {
    if (localMode === 'fixed' || status.value === 'success') return;
    showPanel.value = false
  }

</script>

<template>
  <div
    class="slide-puzzle-wrapper"
    :style="{
      width: `${containerWidth}px`
    }"
    @mouseover="handlePopIn"
    @mouseout="handlePopOut"
  >
    <!-- 图片面板 -->
    <div
      class="slider-panel"
      :style="{
        opacity: localMode === 'pop' ? (showPanel ? 1 : 0) : 1,
        zIndex: showPanel ? 999 : -1,
        position: localMode === 'pop' ? 'absolute' : 'static',
      }"
    >
      <div
        class="slider-panel-placeholder"
        :style="{
          height: `${frontHeight}px`
        }"
      >
        <div class="image-box">
          <img class="bg-image" :src="captcha.bg" alt="验证码背景" />
          <img
            class="slider-block-img"
            :src="captcha.front"
            alt="验证码滑块"
            ref="sliderBlockRef"
            :style="{
              width: `${frontWidth}px`,
              left: `${puzzleLeft}px`,
            }"
          />
          <div class="loading-box" v-if="loading">
            <div>
              <icon-loading class="loading-icon" />
              <div class="loading-text">{{ tips }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="slider-controller">
      <!-- 滑块盒子 -->
      <div
        class="slider-indicator"
        :style="{
          width: `${sliderLeft}px`,
          ...indicatorStyle,
        }"
      ></div>
      <!-- 滑动区域 -->
      <div
        class="slider-area"
        :style="{
          left: `${sliderLeft}px`,
          width: `${sliderWidth}px`,
          ...sliderStyle,
        }"
        ref="sliderRef"
      >
        <span class="slider-icon">
          <icon-close v-if="status === 'error'" />
          <icon-check v-else-if="status === 'success'" />
          <icon-loading v-else-if="status === 'checking'" />
          <icon-arrow-right v-else />
        </span>
      </div>
      <div class="tips">{{ tips }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.slide-puzzle-wrapper {
  position: relative;
  font-size: 14px;

  .slider-panel {
    left: 0;
    bottom: 40px;
    padding-bottom: 15px;
    width: 100%;
    transition: 0.2s;
    user-select: none;

    .slider-panel-placeholder {
      position: relative;

      .image-box {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;

        .bg-image {
          vertical-align: top;
          width: 100%;
          height: 100%;
        }

        .slider-block-img {
          position: absolute;
          top: 0;
          width: auto;
          height: 100%;
        }
      }

      .loading-box {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        text-align: center;
        background-image: url('http://geyoss.oss-cn-hangzhou.aliyuncs.com/static/vertify/vertify-bg.png');
        background-color: #f7f9fa;
        background-position: 50%;
        background-size: cover;

        .loading-icon {
          font-size: 26px;
          color: #8c8c8c;
        }
        .loading-text {
          line-height: 24px;
          color: #8c8c8c;
        }
        @keyframes loading {
          0% {
            transform: rotate(0deg);
          }

          100% {
            transform: rotate(360deg);
          }
        }
      }
    }
  }

  .slider-controller {
    position: relative;
    height: 40px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f7f4fe;
    overflow: hidden;
    color: #8c8c8c;

    .slider-indicator {
      position: absolute;
      top: -1px;
      left: 0;
      height: 40px;
      border-right: none;
      transition:
        background-color 0.2s linear,
        border-color 0.2s linear;
    }

    .slider-area {
      position: absolute;
      top: -1px;
      left: 0;
      height: 40px;
      border: 1px solid #ddd;
      border-left: none;
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
      cursor: pointer;
      transition:
        background-color 0.2s linear,
        border-color 0.2s linear;

      &:hover {
        color: white;
        background-color: #1991fa;
        border-color: #1991fa;
      }
    }

    .slider-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    .tips {
      line-height: 40px;
      text-align: center;
      color: #8c8c8c;
      user-select: none;
    }
  }
}
</style>