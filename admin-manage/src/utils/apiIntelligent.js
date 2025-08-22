import axios from 'axios';
import { MessageBox } from 'element-ui';
import { message } from './message';
import { getToken } from '@/utils/auth';
// 创建axios实例

const service = axios.create({
  // api的base_url
  // baseURL: baseUrl,
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
    // Do something with request error
    console.error(error); // for debug
    return Promise.reject(error);
  }
);
// response拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    // 返回的结果中没有success或者success为false的都当作请求错误或请求失败处理
    if (res.hasOwnProperty('success') && res.success) {
      return res;
    } else {
      MessageBox({
        title: `系统提示#${res.hasOwnProperty('code') ? res['code'] : ''}`,
        type: 'error',
        message: res.message
      });
      return Promise.reject(res);
    }
  },
  (error) => {
    message.error(error.msg || error.message);
    return Promise.reject(error);
  }
);

export default service;
