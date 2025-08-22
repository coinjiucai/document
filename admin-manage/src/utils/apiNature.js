import axios from 'axios';
import { message } from './message';
import { getToken } from '@/utils/auth';

/**
 * 该实例不对响应中的错误内容做任何处理
 */
const service = axios.create({
  // api的base_url
  baseURL: window.VUE_APP_BASE_URL,
  // 请求超时时间
  timeout: 10000
});
let token = '';
service.defaults.headers.common['token'] = token;
service.defaults.headers.post['Content-Type'] =
  'application/json;charset=UTF-8';
// request拦截器
service.interceptors.request.use(
  (config) => {
    if (getToken()) {
      token = getToken();
    }
    config.headers['X-Access-Token'] = token;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    // 不对响应内容中的错误做任何处理
    return response.data;
  },
  (error) => {
    message.error(error.msg || error.message);
    return Promise.reject(error);
  }
);

export default service;
