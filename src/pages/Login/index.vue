<script setup lang="ts">
  import { ref } from 'vue'
  import { Message } from '@arco-design/web-vue';
  import Captcha from '@/components/Captcha/index.vue'
  import { fetchCaptcha, verifyCaptcha } from '@/service/login.ts'
  import { CaptchaParams, TCaptcha } from '../../components/Captcha/index.vue'

  const captchaToken = ref<String>('')

  const validateSuccess = ref<Boolean>(false)

  const onFetchCaptcha = () => {
    return new Promise<TCaptcha>((resolve, reject) => {
      fetchCaptcha().then((resp: any) => {
        captchaToken.value = resp.data.data.token

        resolve({ bg: resp.data.data.bg, front: resp.data.data.front });
      }).catch(reject);
    })
  }

  const onValidateCaptcha = ({ positionX, trail }: CaptchaParams) => {
    return new Promise<{ success: boolean }>((resolve, reject) => {
      verifyCaptcha({
        token: captchaToken.value,
        positionX,
        trail,
      }).then(() => {
        validateSuccess.value = true
        Message.success('success')
        resolve({ success: true })
      }).catch(() => {
        reject()
      });
    })
  }

</script>

<template>
  <div class="page">
    <Captcha
      :validateSuccess="validateSuccess"
      :onFetchCaptcha="onFetchCaptcha"
      :onValidateCaptcha="onValidateCaptcha"
    />
  </div>
</template>