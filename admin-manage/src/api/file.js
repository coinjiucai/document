import axios from '@/utils/apiCommon';
// 档案管理
export default {
  // 档案管理：分页获取档案管理
  psyarchivemanagementPage(params) {
    return axios.get('/mlf-counsel-service/psyarchivemanagement/page', {
      params
    });
  },
  // 档案管理：添加档案管理对象
  psyarchivemanagementSave(params) {
    return axios.post('/mlf-counsel-service/psyarchivemanagement/save', params);
  },
  // 档案管理：获取档案管理对象
  getPsyarchivemanagementById(params) {
    return axios.get(`/mlf-counsel-service/psyarchivemanagement/${params.id}`, {
      params
    });
  },
  // 档案管理：批量删除档案管理
  psyarchivemanagementDeleteBatch(params) {
    return axios.post(
      '/mlf-counsel-service/psyarchivemanagement/deleteBatch',
      params
    );
  },

  // 智能咨询记录：分页获取智能咨询记录
  usersmartcounselrecordsPage(params) {
    return axios.get('/mlf-counsel-service/usersmartcounselrecords/page', {
      params
    });
  },
  // 心理测评记录：分页获取心理测评记录
  userpaperrecordsPage(params) {
    return axios.get('/mlf-counsel-service/userpaperrecords/page', { params });
  },
  // 认知训练记录：添加认知训练记录对象
  usercognitivetrainrecordsPage(params) {
    return axios.get('/mlf-counsel-service/usercognitivetrainrecords/page', {
      params
    });
  },
  // 咨询预约：分页获取咨询预约
  psytraineereservationPage(params) {
    return axios.get('/mlf-counsel-service/psytraineereservation/page', {
      params
    });
  },
  // 课程学习记录：分页获取课程学习记录
  usercourserecordsPages(params) {
    return axios.get('/mlf-counsel-service/usercourserecords/pages', {
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
  // H5PC：获取学员心理咨询记录
  usersmartcounselrecordsPages(params) {
    return axios.get('/mlf-counsel-service/usersmartcounselrecords/pages', {
      params
    });
  },
  // H5PC共用：获取学员心理测评记录
  userpaperrecordsPages(params) {
    return axios.get('/mlf-counsel-service/userpaperrecords/pages', { params });
  },
  // H5PC共用：分页获取认知训练记录
  usercognitivetrainrecordsPages(params) {
    return axios.get('/mlf-counsel-service/usercognitivetrainrecords/pages', {
      params
    });
  }
  //
};
