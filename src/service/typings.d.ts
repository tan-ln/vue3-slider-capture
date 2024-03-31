export interface BaseResponse<T = never> {
  data: T;
  message?: string; // 响应信息
  code?: string | 1 | 0; // 响应码
}
