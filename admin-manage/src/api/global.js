//在不同页面多次使用的接口放在这里
import axios from "@/utils/apiCommon";
import apiNature from "@/utils/apiNature";
import apiExport from "@/utils/apiExport";

export default {
  // 检查字段重复
  duplicateCheck(params) {
    return apiNature.get("/mlf-system-service/sys/duplicate/check", { params });
  },
  // 通用请求:获取列表
  getList(url, params) {
    return axios.get(url, { params });
  },
  // 通用请求:获取详情
  getDetail(url, id) {
    return axios.get(`${url}${id}`);
  },
  // 通用请求:批量删除
  batchDelete(url, params) {
    return axios.post(url, params);
  },
  // 通用请求:保存内容
  saveRecord(url, params) {
    return axios.post(url, params);
  },
  //  通用请求:获取树列表
  getTreeList(url) {
    return axios.get(url);
  },
  // 获取文件流
  getFileStream(url, params, method) {
    if (method == 'get') {
      return apiExport.get(
        url, {
        responseType: 'blob' // 设置响应类型为 blob
      });
    } else {
      return apiExport.post(
        url,
        params
      );
    }

  },
  // 文件上传
  fileUpload(url, params) {
    return axios.post(url, params);
  },
};
