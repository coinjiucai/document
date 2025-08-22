// todo 当前采用mock进行虚拟请求，如需更换实际请求可以更换为apiCommon或其它的
// import axios from "@/utils/apiMock";
import axios from '@/utils/apiCommon';
export default {
  applyResetPassword(params) {
    return axios.post('/system/admin/forgetPassword', params);
  },
  getUserPermissionByToken() {
    return axios.get(
      '/mlf-system-service/sys/permission/getUserPermissionByToken'
    );
  }
};
