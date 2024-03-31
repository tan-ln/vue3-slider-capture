<template>
  <div
    class="capture-wrapper"
  >
    <SliderPuzzle
      mode="auto"
      v-bind="{ ...props }"
    />
  </div>
</template>

<script setup lang="ts">
import SliderPuzzle from './SliderPuzzle.vue'

export type TCaptcha = {
  bg: string;
  front: string
}

export interface CaptchaParams {
  positionX: number;
  trail: { x: number; y: number; t: number }[];
  offsetTop: number;
}

export interface Props {
  containerWidth?: number
  sliderWidth?: number
  sliderTip?: string

  localMode?: 'pop' | 'fixed'
  captchaSize?: { width: number; height: number; frontWidth: number }; // 验证码图片相关原始尺寸

  validateSuccess: boolean

  onFetchCaptcha: () => Promise<TCaptcha>;
  onValidateCaptcha: (params: CaptchaParams) => Promise<{ success: boolean }>;
}

const props = defineProps<Props>()

</script>

<style lang="scss" scoped>

</style>
