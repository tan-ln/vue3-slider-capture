<script setup lang="ts">
import { ref, computed } from 'vue';
import { IconArrowRight } from '@arco-design/web-vue/es/icon';
import { Status, getIndicatorStyle, getSliderStyle } from './utils.ts'

interface Props {
  containerWidth?: number
  sliderWidth?: number
  sliderTip?: string
}

const {
  containerWidth,
  sliderWidth,
  sliderTip,
} = withDefaults(defineProps<Props>(), {
  containerWidth: 320,
  sliderWidth: 40,
  sliderTip: '向右拖动滑块完成拼图'
})

const status = ref<Status>('ready')
const tips = ref(sliderTip)
const sliderLeft = ref(0)

const indicatorStyle = computed(() => getIndicatorStyle(status.value))
const sliderStyle = computed(() => getSliderStyle(status.value))

</script>

<template>
  <div
    class="slide-puzzle-wrapper"
    :style="{
      width: `${containerWidth}px`
    }"
  >
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
      >
        <span class="slider-icon">
          <icon-arrow-right />
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

  .slider-controller {
    position: relative;
    height: 40px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f7f4fe;
    overflow: hidden;

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