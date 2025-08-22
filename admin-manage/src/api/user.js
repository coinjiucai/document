import axios from '@/utils/apiCommon';
export default {
  // H5PC共用：分页获取咨询预约
  psytraineereservationPage(params) {
    return axios.get(`/mlf-counsel-service/psytraineereservation/pages`, {
      params
    });
  },
  // H5PC共用：获取咨询预约对象
  getPsytraineereservationById(params) {
    return axios.get(
      `/mlf-counsel-service/psytraineereservation/${params.id}`,
      { params }
    );
  },
  // 角色列表（按登录端过滤）
  roleList(params) {
    return axios.get(`/mlf-system-service/sys/role/list`, { params });
  },
  // 获取用户信息
  userQueryById(params) {
    return axios.get(`/mlf-system-service/sys/user/queryById`, { params });
  },
  // 修改用户信息
  userAppEdit(params) {
    return axios.post(`/mlf-system-service/sys/user/edit`, params);
  },
  // 修改密码
  changePassword(params) {
    return axios.post(`/mlf-system-service/sys/user/changePassword`, params);
  },
  // 个人收藏：分页获取个人收藏
  psypersonalfavoritesPage(params) {
    return axios.get(`/mlf-counsel-service/psypersonalfavorites/page`, {
      params
    });
  },
  // 心理漫画：获取心理漫画对象
  getPsycomicsById(params) {
    return axios.get(`/mlf-counsel-service/psycomics/${params.id}`, { params });
  },

  // 小组管理：分页获取小组管理
  sysgroupPage(params) {
    return axios.get(`/mlf-counsel-service/sysgroup/page`, { params });
  },
  // 小组成员表：获取小组成员表列表
  sysgroupuserList(params) {
    return axios.get(`/mlf-counsel-service/sysgroupuser/list`, { params });
  },
  // 获取用户列表数据
  listUsers(params) {
    return axios.get(`/mlf-system-service/sys/user/list`, { params });
  },
  // 小组管理：添加小组管理对象
  sysgroupSave(params) {
    return axios.post(`/mlf-counsel-service/sysgroup/save`, params);
  },
  // 小组管理：人员设置
  sysgroupUserSet(params) {
    return axios.post(`/mlf-counsel-service/sysgroup/userSet`, params);
  },
  // 小组管理：批量删除小组管理
  sysgroupDeleteBatch(params) {
    return axios.post(`/mlf-counsel-service/sysgroup/deleteBatch`, params);
  },
  // 小组成员表：分页获取小组成员表
  sysgroupuserPage(params) {
    return axios.get(`/mlf-counsel-service/sysgroupuser/page`, { params });
  },
  // 个人收藏：添加个人收藏对象
  psypersonalfavoritesSave(params) {
    return axios.post(`/mlf-counsel-service/psypersonalfavorites/save`, params);
  },
  // 个人收藏：取消收藏
  unablepsypersonalfavorites(params) {
    return axios.get(`/mlf-counsel-service/unablepsypersonalfavorites`, {
      params
    });
  },
  // H5PC：获取学员心理咨询记录
  usersmartcounselrecordsPages(params) {
    return axios.get(`/mlf-counsel-service/usersmartcounselrecords/pages`, {
      params
    });
  },
  // 账号注册
  register(params) {
    return axios.post(`/mlf-system-service/sys/user/register`, params);
  },
  // 量表测试：分页获取量表测试
  psypapermemberPage(params) {
    return axios.get(`/mlf-counsel-service/psypapermember/page`, { params });
  },
  // H5PC共用：获取咨询预约对象
  psytraineereservationById(params) {
    return axios.get(
      `/mlf-counsel-service/psytraineereservation/${params.id}`,
      { params }
    );
  },
  // 个性化课程：分页获取个性化课程
  personalizecoursePage(params) {
    return axios.get(`/mlf-counsel-service/personalizecourse/page`, { params });
  },
  // 个性化资讯：分页获取个性化资讯
  personalizenewsPage(params) {
    return axios.get(`/mlf-counsel-service/personalizenews/page`, { params });
  },
  // 个性化漫画：分页获取个性化漫画
  personalizecomicsPage(params) {
    return axios.get(`/mlf-counsel-service/personalizecomics/page`, { params });
  },
  // 个性化音乐：分页获取个性化音乐
  personalizemusicsPage(params) {
    return axios.get(`/mlf-counsel-service/personalizemusics/page`, { params });
  },
  // 消息通知：分页获取消息通知
  sysmsgPage(params) {
    return axios.get(`/mlf-system-service/sysmsg/page`, { params });
  },
  // 消息通知：获取未读消息数量
  sysmsgUnreadNum(params) {
    return axios.get(`/mlf-system-service/sysmsg/unreadNum`, { params });
  },
  // 消息通知：读消息
  sysmsgRead(params) {
    return axios.get(`/mlf-system-service/sysmsg/read`, { params });
  },
  // 预警干预：更改状态
  psyearlywarnmanagementinterveneStatus(params) {
    return axios.get(
      `/mlf-counsel-service/psyearlywarnmanagementintervene/status`,
      { params }
    );
  },
  // 点击事件表：添加点击事件表对象
  clickeventsSave(params) {
    return axios.post(`/mlf-counsel-service/clickevents/save`, params);
  },
  // 获取用户列表数据
  userList(params) {
    return axios.get('/mlf-system-service/sys/user/list', { params });
  }
};
