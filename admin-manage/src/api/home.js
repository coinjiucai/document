import axios from '@/utils/apiCommon';
export default {
  //密码修改
  editPassword(params) {
    return axios.post(`/mlf-system-service/sys/user/updatePassword`, params);
  },
  changeUserTheme(params) {
    return axios.post(`/system/admin/alterTheme`, params);
  }
};
