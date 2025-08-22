import axios from "axios";
import "@/mock/mock.js";
import { MessageBox } from "element-ui";
import { message } from "./message";
import { getToken } from "@/utils/auth";
// 创建axios实例
const service = axios.create({
  // 请求超时时间
  timeout: 10000000,
});

let token = "";
service.defaults.headers.common["token"] = token;
service.defaults.headers.post["Content-Type"] =
  "application/json;charset=UTF-8";
// request拦截器
service.interceptors.request.use(
  (config) => {
    if (getToken()) {
      token = getToken();
    }
    config.headers["X-Access-Token"] = token;
    return config;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  }
);

// response拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    //返回的结果中没有success或者success为false的都当作请求错误或请求失败处理
    if (res.hasOwnProperty("success") && res.success) {
      const requestInfo = {
        请求类型: response.config.method,
        请求路径: response.config.url,
        请求参数: response.config.params,
        请求结果: response.data,
      };
      console.debug(requestInfo);
      return res;
    } else {
      MessageBox({
        title: `系统提示#${res.hasOwnProperty("code") ? res["code"] : ""}`,
        type: "error",
        message: res.message,
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
