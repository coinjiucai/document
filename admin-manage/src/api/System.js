import axios from '@/utils/apiCommon';
export default {
  // 组织管理-start
  getDepartTree() {
    return axios.get('/mlf-system-service/sys/sysDepart/queryTreeByKeyWord');
  },
  // 添加单位
  addDepartTree(params) {
    return axios.post('/mlf-system-service/sys/sysDepart/addUnit', params);
  },
  // 通过id删除单位
  deleteDepart(params) {
    return axios.delete('/mlf-system-service/sys/sysDepart/delete', {
      data: params
    });
  },
  // 获取某个部门的所有父级部门的ID
  departQueryAllParentId(params) {
    return axios.get('/mlf-system-service/sys/sysDepart/queryAllParentId', {
      params
    });
  },
  //
  // 字典管理-start
  dictionaryCategoryAdd(params) {
    return axios.post('/mlf-system-service/sys/dict/add', params);
  },
  dictionaryCategoryEdit(params) {
    return axios.post('/mlf-system-service/sys/dict/edit', params);
  },
  dictionaryCategoryDeleteBatch(params) {
    return axios.delete('/mlf-system-service/sys/dict/deleteBatch', { params });
  },
  getDictionaryCategory(params) {
    return axios.get('/mlf-system-service/sys/dict/listAll', { params });
  },
  getDictionaryContentPageList(params) {
    return axios.get('/mlf-system-service/sys/dictItem/page', { params });
  },
  addDictionaryContent(params) {
    return axios.post('/mlf-system-service/sys/dictItem/add', params);
  },
  editDictionaryContent(params) {
    return axios.post('/mlf-system-service/sys/dictItem/edit', params);
  },
  deleteDictionaryContent(params) {
    return axios.post('/mlf-system-service/sys/dictItem/deleteBatch', params);
  },

  // 日志记录-获取日志列表
  getLogList(params) {
    return axios.get('/mlf-system-service/sys/log/list', { params });
  },
  // 菜单管理-新增
  addPermission(params) {
    return axios.post('/mlf-system-service/sys/permission/add', params);
  },
  // 菜单管理-编辑
  editPermission(params) {
    return axios.post('/mlf-system-service/sys/permission/edit', params);
  },
  // 菜单管理-列表
  getPermissionList() {
    return axios.get('/mlf-system-service/sys/permission/list');
  },
  // 菜单管理-删除
  deletePermission(params) {
    return axios.delete('/mlf-system-service/sys/permission/deleteBatch', {
      params
    });
  },
  // 用户管理-获取用户
  getUserList(params) {
    return axios.get('/mlf-system-service/sys/user/list', {
      params
    });
  },

  addUser(params) {
    return axios.post('/mlf-system-service/sys/user/add', params);
  },
  editUser(params) {
    return axios.post('/mlf-system-service/sys/user/edit', params);
  },
  userQueryById(params) {
    return axios.get(`/mlf-system-service/sys/user/queryById`, {
      params
    });
  },
  batchDeleteUser(params) {
    return axios.delete('/mlf-system-service/sys/user/deleteBatch', { params });
  },
  // 角色管理-角色列表获取
  getRoleList(params) {
    return axios.get('/mlf-system-service/sys/role/list', { params });
  },
  roleAdd(params) {
    return axios.post('/mlf-system-service/sys/role/add', params);
  },
  // 角色管理-获取全部角色
  getAllRole() {
    return axios.get('/mlf-system-service/sys/role/queryall');
  },
  // // 角色管理-批量删除角色
  batchDeleteRole(params) {
    return axios.post(
      `/mlf-system-service/sys/role/deleteBatch2?ids=${params.ids}`,
      params
    );
  },
  // 角色管理-修改角色
  saveRoleInfo(type, params) {
    if (type === 'new') {
      return axios.post('/mlf-system-service/sys/role/add', params);
    } else {
      return axios.post('/mlf-system-service/sys/role/edit', params);
    }
  },
  // 角色管理-获取当前角色的全局人员
  getUserListByRoleId(params) {
    return axios.get('/mlf-system-service/sys/role/roleIdGetUserList', {
      params
    });
  },
  // 用户管理- 重置密码
  resetPass(ids) {
    return axios.post(`/mlf-system-service/sys/user/resetPass?ids=${ids}`);
  },
  // 权限管理-获取全部的权限树
  getPermissionTreeList() {
    return axios.get('/mlf-system-service/sys/permission/queryTreeList');
  },
  // 权限管理-获取单位拥有的权限
  getDepartPermissionList(id) {
    return axios.get(
      `/mlf-system-service/sys/permission/saveDepartPermission?departId=${id}`
    );
  },
  //权限管理-保存模块列表权限
  saveModelListPermission(params) {
    return axios.post('/mlf-system-service/sys/menuradius/save', params);
  },
  // 权限管理-保存单位拥有的权限
  saveDepartPermissionList(params) {
    return axios.post(
      '/mlf-system-service/sys/permission/saveRolePermission',
      params
    );
  },

  // 权限管理-获取角色权限
  getRolePermissionList(roleId) {
    return axios.get(
      `/mlf-system-service/sys/permission/queryRolePermission?roleId=${roleId}`
    );
  },
  // 权限管理-保存角色权限
  saveRolePermissionList(params) {
    return axios.post(
      '/mlf-system-service/sys/permission/saveRolePermission',
      params
    );
  },
  // 权限管理-获取模块列表权限
  getModelListPermission(roleId) {
    return axios.get(
      `/mlf-system-service/sys/menuradius/list?roleId=${roleId}`
    );
  },

  // 政策法规
  getPolicyList(params) {
    return axios.get('/mlf-system-service/sys/policy/page', { params });
  },
  batchPolicyDelete(params) {
    return axios.post('/mlf-system-service/sys/policy/deleteBatch', params);
  },
  savePolicy(params) {
    return axios.post('/mlf-system-service/sys/policy/save', params);
  },
  // 通知公告
  getSysannouncementList(params) {
    return axios.get('/mlf-system-service/sysannouncement/page', { params });
  },
  batchSysannouncementDelete(params) {
    return axios.post(
      '/mlf-system-service/sysannouncement/deleteBatch',
      params
    );
  },
  saveSysannouncement(params) {
    return axios.post('/mlf-system-service/sysannouncement/save', params);
  },
  // 要害部位信息：分页获取要害部位信息
  getSysprivacyplacePageList(params) {
    return axios.get('/mlf-system-service/sysprivacyplace/page', { params });
  },

  getSysprivacyplaceList(params) {
    return axios.get('/mlf-system-service/sysprivacyplace/list', { params });
  },
  // 要害部位信息：添加要害部位信息对象
  saveSysprivacyplace(params) {
    return axios.post('/mlf-system-service/sysprivacyplace/save', params);
  },
  // 要害部位信息：批量删除要害部位信息
  batchSysprivacyplaceDelete(params) {
    return axios.post(
      '/mlf-system-service/sysprivacyplace/deleteBatch',
      params
    );
  },
  // 要害部位人员出入：分页获取要害部位人员出入登记
  getSysprivacyplaceaccessList(params) {
    return axios.get('/mlf-system-service/sysprivacyplaceaccess/page', {
      params
    });
  },
  // 要害部位人员出入：添加要害部位人员出入登记对象
  savesySprivacyplaceaccessSave(params) {
    return axios.post('/mlf-system-service/sysprivacyplaceaccess/save', params);
  },
  // 要害部位人员出入：批量删除要害部位人员出入登记
  batchSysprivacyplaceaccessDelete(params) {
    return axios.post(
      '/mlf-system-service/sysprivacyplaceaccess/deleteBatch',
      params
    );
  },
  // 要害部位人员出入：导入要害部位人员出入登记
  importSysprivacyplaceaccess(params) {
    return axios.post(
      '/mlf-system-service/sysprivacyplaceaccess/import',
      params
    );
  },
  // sm人员信息档案
  // getSysprivacyuserPageList(params) {
  //   return axios.get("/mlf-system-service/sysprivacyuser/page", {
  //     params,
  //   });
  // },
  // savesySyssecrecyagreementSave(params) {
  //   return axios.post("/mlf-system-service/syssecrecyagreement/save", params);
  // },
  // batchSyssecrecyagreementDelete(params) {
  //   return axios.post(
  //     "/mlf-system-service/syssecrecyagreement/deleteBatch",
  //     params
  //   );
  // },
  // sm人员变更
  // sm人员出国（境）申请
  // sm 人要离任/离岗申请

  // 责任书
  getSyssecrecyagreementPageList(params) {
    return axios.get(
      '/mlf-system-service/sysprivacyuser/syssecrecyagreement/page',
      {
        params
      }
    );
  },
  savesySyssecrecyagreementSave(params) {
    return axios.post(
      '/mlf-system-service/sysprivacyuser/syssecrecyagreement/save',
      params
    );
  },
  batchSyssecrecyagreementDelete(params) {
    return axios.post(
      '/mlf-system-service/sysprivacyuser/syssecrecyagreement/deleteBatch',
      params
    );
  },
  // 保密教育
  getSyssecrecyeduPageList(params) {
    return axios.get('/mlf-system-service/sysprivacyuser/syssecrecyedu/page', {
      params
    });
  },
  syssecrecyeduSave(params) {
    return axios.post(
      '/mlf-system-service/sysprivacyuser/syssecrecyedu/save',
      params
    );
  },
  batchSyssecrecyeduDelete(params) {
    return axios.post(
      '/mlf-system-service/sysprivacyuser/syssecrecyedu/deleteBatch',
      params
    );
  },
  // 考核：获取导入保密教育考核模板

  // 保密检查计划：
  checkplanPageList(params) {
    return axios.get('/mlf-system-service/censor/checkplan/page', {
      params
    });
  },
  checkplanSave(params) {
    return axios.post('/mlf-system-service/censor/checkplan/save', params);
  },
  batchCheckplanDelete(params) {
    return axios.post(
      '/mlf-system-service/censor/checkplan/deleteBatch',
      params
    );
  },
  getCheckplanOne(id) {
    return axios.get(`/mlf-system-service/censor/checkplan//${id}`);
  },
  // 计划：发布和撤销发布 2发布 1撤销
  checkPlanSent(params, sentStatus) {
    return axios.post(
      `/mlf-system-service/censor/checkplan/sent/${sentStatus}`,
      params
    );
  },
  // 保密检查-清单
  checklistPageList(params) {
    return axios.get('/mlf-system-service/censor/checklist/page', {
      params
    });
  },
  checklistSave(params) {
    return axios.post('/mlf-system-service/censor/checklist/save', params);
  },
  batchChecklistDelete(params) {
    return axios.post(
      '/mlf-system-service/censor/checklist/deleteBatch',
      params
    );
  },

  // 私密人员管理
  sysprivacyuserPageList(params) {
    return axios.get('/mlf-system-service/sysprivacyuser/sysprivacyuser/list', {
      params
    });
  },
  sysprivacyuserSave(params) {
    return axios.post(
      '/mlf-system-service/sysprivacyuser/sysprivacyuser/save',
      params
    );
  },
  batchSysprivacyuserDelete(params) {
    return axios.post(
      '/mlf-system-service/sysprivacyuser/sysprivacyuser/deleteBatch',
      params
    );
  },

  // 首页布局相关接口
  // 列表
  getSysLayoutList(params) {
    return axios.get('/mlf-system-service/sysfront/list', {
      params
    });
  },
  // 保存
  saveSysLayout(params) {
    return axios.post('/mlf-system-service/sysfront/save', params);
  },

  // 获取用户信息
  getUserInfo() {
    return axios.get('/mlf-system-service/sys/user/getUserInfo');
  },
  // 部门单位：添加部门单位对象
  psysysdepartSave(params) {
    return axios.post('/mlf-system-service/psysysdepart/save', params);
  },
  // 部门单位：单位树
  psysysdepartTreeList(params) {
    return axios.get('/mlf-system-service/psysysdepart/treeList', params);
  },
  // 部门单位：批量删除部门单位
  sysprivacyuserDeleteBatch(params) {
    return axios.post('/mlf-system-service/psysysdepart/deleteBatch', {
      ids: params.id
    });
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
  }
};
