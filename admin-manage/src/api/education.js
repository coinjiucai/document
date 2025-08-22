import axios from '@/utils/apiCommon';
export default {
  // 心理咨询师：分页获取心理咨询师
  psycounselorPage(params) {
    return axios.get(`/mlf-counsel-service/psycounselor/page`, { params });
  },
  // 心理咨询师：获取心理咨询师对象
  getPsycounselorById(params) {
    return axios.get(`/mlf-counsel-service/psycounselor/${params.id}`, {
      params
    });
  },
  // 心理专家：获取心理专家列表
  psyexpertList(params) {
    return axios.get(`/mlf-counsel-service/psyexpert/list`, { params });
  },
  // 心理专家：获取心理专家对象
  getPsyexpertById(params) {
    return axios.get(`/mlf-counsel-service/psyexpert/${params.id}`, { params });
  },

  // 课程学习记录：分页获取课程学习记录
  usercourserecordsPage(params) {
    return axios.get(`/mlf-counsel-service/usercourserecords/page`, { params });
  },
  // H5PC共用：分页获取课程学习记录
  usercourserecordsPages(params) {
    return axios.get(`/mlf-counsel-service/usercourserecords/pages`, {
      params
    });
  },
  // 课程学习记录：获取课程学习记录对象
  getUsercourserecordsById(params) {
    return axios.get(`/mlf-counsel-service/usercourserecords/${params.id}`, {
      params
    });
  },
  // 章节：章节树
  getChaptTreeList(params) {
    return axios.get(`/mlf-counsel-service/psycourse/chaptrt/treeList`, {
      params
    });
  },
  // 章节：获取章节对象
  getChaptrtyId(params) {
    return axios.get(`/mlf-counsel-service/psycourse/chaptrt/${params.id}`, {
      params
    });
  },
  // 心理课堂：获取心理课堂对象
  getPsycourseById(params) {
    return axios.get(`/mlf-counsel-service/psycourse/${params.id}`, { params });
  },

  // 心理教育课程便签：获取某人的所有课程
  psynotesListCourses(params) {
    return axios.get(`/mlf-counsel-service/psynotes/listCourses`, { params });
  },
  // 心理教育课程专题笔记：获取某人的所有课程
  psyspecialnotesListCourses(params) {
    return axios.get(`/mlf-counsel-service/psyspecialnotes/listCourses`, {
      params
    });
  },

  // 心理教育课程便签：获取某人某课程的便签
  psynotesListNotes(params) {
    return axios.get(`/mlf-counsel-service/psynotes/listNotes`, { params });
  },
  // 心理教育课程便签：编辑便签
  psynotesSave(params) {
    return axios.post(`/mlf-counsel-service/psynotes/save`, params);
  },
  // 心理教育课程专题笔记：获取某人某课程的专题笔记
  psyspecialnotesListSpecialNotes(params) {
    return axios.get(`/mlf-counsel-service/psyspecialnotes/listSpecialNotes`, {
      params
    });
  },
  // 心理教育课程专题笔记：编辑专题笔记
  psyspecialnotesSave(params) {
    return axios.post(`/mlf-counsel-service/psyspecialnotes/save`, params);
  },
  // 智能咨询记录：添加智能咨询记录对象
  usersmartcounselrecordsSave(params) {
    return axios.post(
      `/mlf-counsel-service/usersmartcounselrecords/save`,
      params
    );
  },
  // 心理预警管理：添加心理预警管理对象
  psyearlywarnmanagementSave(params) {
    return axios.post(
      `/mlf-counsel-service/psyearlywarnmanagement/save`,
      params
    );
  },
  // H5PC：获取学员心理咨询记录
  usersmartcounselrecordsPages(params) {
    return axios.get(`/mlf-counsel-service/usersmartcounselrecords/pages`, {
      params
    });
  },
  // 智能咨询记录：获取智能咨询记录对象
  getUsersmartcounselrecordsById(params) {
    return axios.get(
      `/mlf-counsel-service/usersmartcounselrecords/${params.id}`,
      { params }
    );
  },
  // 课程学习记录：添加课程学习记录对象
  usercourserecordsSave(params) {
    return axios.post(`/mlf-counsel-service/usercourserecords/save`, params);
  },
  // 课程学习记录：根据课程ID和用户ID获取课程学习记录对象
  usercourserecordsByCourseId(params) {
    return axios.get(
      `/mlf-counsel-service/usercourserecordsByCourseId/${params.courseId}/${params.userId}`,
      { params }
    );
  },
  // 心理教育课程便签：获取用户便签
  userListNotes(params) {
    return axios.get(`/mlf-counsel-service/psynotes/userListNotes`, {
      params
    });
  }
};
