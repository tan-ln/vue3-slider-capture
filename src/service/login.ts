import { request } from '../utils/request'
import { BaseResponse } from './typings';

export const fetchCaptcha = () => {
  return request.get<
    BaseResponse<{ bg: string; front: string; token: string }>
  >('/api/captcha');
}

export const verifyCaptcha = (
  params: {
    positionX: number;
    trail: { x: number; y: number; t: number }[];
    token: string;
  }
) => {
  return request.post<BaseResponse>('/api/captcha/verify', params);
}
