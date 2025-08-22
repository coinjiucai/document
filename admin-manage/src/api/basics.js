import axios from '@/utils/apiCommon';
// 基础管理
export default {
  // 给指定角色添加用户
  addSysUserRole(params) {
    return axios.post('/mlf-system-service/sys/user/addSysUserRole', params);
  },
  // 获取用户列表数据
  userList(params) {
    return axios.get('/mlf-system-service/sys/user/list', { params });
  },
  // 添加用户
  userAdd(params) {
    return axios.post('/mlf-system-service/sys/user/add', params);
  },
  // 编辑用户
  userEdit(params) {
    return axios.post('/mlf-system-service/sys/user/edit', params);
  },
  // 批量删除用户
  deleteBatch(params) {
    return axios.delete('/mlf-system-service/sys/user/deleteBatch', { params });
  },
  // 用户重置密码
  resetPass(params) {
    return axios.post(
      `/mlf-system-service/sys/user/resetPass?ids=${params.ids}`,
      params
    );
  },
  // 获取用户信息
  userQueryById(params) {
    return axios.get('/mlf-system-service/sys/user/queryById', { params });
  },

  // 素材标签分类：素材标签分类树
  sysmateriallabelTreeList(params) {
    return axios.get('/mlf-counsel-service/sysmateriallabel/treeList', {
      params
    });
  },
  // 素材标签分类：添加素材标签分类对象
  sysmateriallabelSave(params) {
    return axios.post('/mlf-counsel-service/sysmateriallabel/save', params);
  },
  // 素材标签分类：获取素材标签分类对象
  getSysmateriallabelById(params) {
    return axios.get(`/mlf-counsel-service/sysmateriallabel/${params.id}`, {
      params
    });
  },
  // 素材标签分类：删除一个素材标签分类
  sysmateriallabelDelete(params) {
    return axios.post('/mlf-counsel-service/sysmateriallabel/delete', params);
  },

  // 素材标签分类：分页获取素材标签分类
  sysmateriallabelPage(params) {
    return axios.get('/mlf-counsel-service/sysmateriallabel/page', { params });
  },
  // 素材标签分类：批量删除素材标签分类
  sysmateriallabelDeleteBatch(params) {
    return axios.post(
      '/mlf-counsel-service/sysmateriallabel/deleteBatch',
      params
    );
  },
  // 标签管理：分页获取标签管理
  syslabelPage(params) {
    return axios.get('/mlf-counsel-service/syslabel/page', { params });
  },
  // 标签管理：添加标签管理对象
  syslabelSave(params) {
    return axios.post('/mlf-counsel-service/syslabel/save', params);
  },
  // 标签管理：获取标签管理对象
  getSyslabelById(params) {
    return axios.get(`/mlf-counsel-service/syslabel/${params.id}`, { params });
  },
  // 标签管理：批量删除标签管理
  syslabelDeleteBatch(params) {
    return axios.post('/mlf-counsel-service/syslabel/deleteBatch', params);
  },
  // 标签管理：素材资源数据
  sourceList(params) {
    return axios.get('/mlf-counsel-service/syslabel/sourceList', { params });
  },
  // 标签管理：标签数据
  dataList(params) {
    return axios.post('/mlf-system-service/syslabel/dataList', params);
  },
  // 小组管理：分页获取小组管理
  sysgroupPage(params) {
    return axios.get('/mlf-counsel-service/sysgroup/page', { params });
  },
  // 小组管理：添加小组管理对象
  sysgroupSave(params) {
    return axios.post('/mlf-counsel-service/sysgroup/save', params);
  },
  // 小组管理：获取小组管理对象
  getSysgroupById(params) {
    return axios.get(`/mlf-counsel-service/sysgroup/${params.id}`, { params });
  },
  // 小组管理：批量删除小组管理
  sysgroupDeleteBatch(params) {
    return axios.post('/mlf-counsel-service/sysgroup/deleteBatch', params);
  },
  // 小组成员表：获取小组成员表列表
  sysgroupuserList(params) {
    return axios.get('/mlf-counsel-service/sysgroupuser/list', { params });
  },
  // 小组管理：人员设置
  sysgroupUserSet(params) {
    return axios.post('/mlf-counsel-service/sysgroup/userSet', params);
  },
  // 问卷：分页获取问卷
  getQuestionnaireList(params) {
    return axios.get('/mlf-counsel-service/questionnair/page', { params });
  },
  // 问卷：批量删除问卷
  delMulQuestionnaire(params) {
    return axios.post('/mlf-counsel-service/questionnair/deleteBatch', params);
  },
  // 问卷：添加问卷对象
  addQuestionnaire(params) {
    return axios.post('/mlf-counsel-service/questionnair/save', params);
  },
  // 问卷：获取问卷对象
  getQuestionnaireDesc(id) {
    return axios.get(`/mlf-counsel-service/questionnair/${id}`);
  },
  // 问卷：设置用户
  xfQuestionnaire(id, params) {
    return axios.post(
      `/mlf-counsel-service/questionnair/setUser/${id}`,
      params
    );
  },
  // 题库分类：获取题库分类树
  taclassifyList() {
    return axios.get(`/mlf-counsel-service/taclassify/treeList`);
  },
  // 题库分类：删除一个题库分类
  taclassifyDelete(params) {
    return axios.post(`/mlf-counsel-service/taclassify/delete`, params);
  },
  // 心理咨询轮播图：分页获取心理咨询轮播图
  psycounselcarouselPage(params) {
    return axios.get('/mlf-counsel-service/psycounselcarousel/page', {
      params
    });
  },
  // 心理咨询轮播图：添加心理咨询轮播图对象
  psycounselcarouselSave(params) {
    return axios.post(`/mlf-counsel-service/psycounselcarousel/save`, params);
  },
  // 心理咨询轮播图：获取心理咨询轮播图对象
  getPsycounselcarouselById(params) {
    return axios.post(
      `/mlf-counsel-service/psycounselcarousel/${params.id}`,
      params
    );
  },
  // 心理咨询轮播图：批量删除心理咨询轮播图
  psycounselcarouselDeleteBatch(params) {
    return axios.post(
      '/mlf-counsel-service/psycounselcarousel/deleteBatch',
      params
    );
  },

  // 心理专家：分页获取心理专家
  psyexpertPage(params) {
    return axios.get('/mlf-counsel-service/psyexpert/page', { params });
  },
  // 心理专家：添加心理专家对象
  psyexpertSave(params) {
    return axios.post('/mlf-counsel-service/psyexpert/save', params);
  },
  // 心理专家：获取心理专家对象
  getPsyexpertById(params) {
    return axios.post(`/mlf-counsel-service/psyexpert/${params.id}`, params);
  },
  // 心理专家：批量删除心理专家
  psyexpertDeleteBatch(params) {
    return axios.post('/mlf-counsel-service/psyexpert/deleteBatch', params);
  },
  // 心理工作情况：获取心理工作情况列表
  psyworkconditionList() {
    return axios.get('/mlf-counsel-service/psyworkcondition/list');
  },
  // 心理工作情况：分页获取心理工作情况
  psyworkconditionPage(params) {
    return axios.get('/mlf-counsel-service/psyworkcondition/page', { params });
  },
  // 心理工作情况：添加心理工作情况对象
  psyworkconditionSave(params) {
    return axios.post('/mlf-counsel-service/psyworkcondition/save', params);
  },
  // 心理工作情况：批量删除心理工作情况
  psyworkconditionBatch(params) {
    return axios.post(
      '/mlf-counsel-service/psyworkcondition/deleteBatch',
      params
    );
  }
};
