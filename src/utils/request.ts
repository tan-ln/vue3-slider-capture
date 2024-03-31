import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { Message } from '@arco-design/web-vue'
import { queryTokenKey } from '../config/constant';
import { getQueryParam } from './index';

export const request = axios.create({
  timeout: 1000 * 60 * 10,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

// 添加请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从 URL 中获取 token 参数的值
    let token = getQueryParam(queryTokenKey);
    if (!token) {
      // 如果 URL 中没有 token 参数，则从 store 中获取
      // token = useAppStore.getState().token;
    }
    // 如果获取到了 token，则设置请求头中的 Authorization 字段为 'Bearer ' + token
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    // 返回处理后的配置对象
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const handleErrorResponse = (resp: AxiosResponse) => {
  if (!resp.config.skipErrorHandler && resp?.data) {
    if (resp.data?.error === 'invalid_grant') {
      Message.error('账号或密码有误');

    } else if (resp.data?.error === 'invalid_token') {
      Message.error({
        content: '登录失效或已过期',
        duration: 2000,
        onClose: () => {
          // useAppStore.getState().logout();
          // history.push('/login');
        }
      })
    } else {
      Message.error(resp.data.message || '请求异常');
    }
  }
};

// 添加响应拦截器
request.interceptors.response.use(
  (response) => {
    // 兼容处理后台接口报错，但返回 200 的情况，根据 code 值统一判断
    if (response.data.code === 0) {
      handleErrorResponse(response);
    }
    // 如果有新的token 就更新它
    const newToken = response.headers['new-authorization'];
    if (response.headers['new-authorization']) {
      // useAppStore.getState().updateToken(newToken);
    }
    return response;
  },
  (error) => {
    if (error.response) {
      handleErrorResponse(error.response);
    }
    return Promise.reject(error);
  },
);

