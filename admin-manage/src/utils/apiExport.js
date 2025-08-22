import axios from 'axios';
import { getToken } from '@/utils/auth';
// 创建axios实例
const service = axios.create({
  baseURL: window.VUE_APP_BASE_URL, // api的base_url
  timeout: 600000 // 请求超时时间2
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
    config.headers.common['X-Access-Token'] = token;
    return config;
  },
  (error) => {
    // Do something with request error
    console.error(error); // for debug
    return Promise.reject(error);
  }
);

export default service;
