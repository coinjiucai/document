import axios from '@/utils/apiCommon';
// 数据统计
export default {
  // H5PC共用：分页获取任务
  psytaskPages(params) {
    return axios.get('/mlf-counsel-service/psytask/pages', { params });
  },
  // H5PC共用：保存任务
  saveTask(params) {
    return axios.post('/mlf-counsel-service/psytask/saveTask', params);
  },
  // H5PC共用：保存任务
  psytaskSave(params) {
    return axios.post('/mlf-counsel-service/psytask/save', params);
  },
  // H5PC共用：获取任务详细信息
  psytaskTaskInfo(params) {
    return axios.get(`/mlf-counsel-service/psytask/taskInfo/${params.id}`, {
      params
    });
  },
  // PC：保存任务对象
  psytaskSave(params) {
    return axios.post('/mlf-counsel-service/psytask/saveTaskPC', params);
  },
  // PC：保存下发任务
  issuedTaskPC(params) {
    return axios.post('/mlf-counsel-service/psytask/issuedTaskPC', params);
  },

  // 小组管理：获取小组管理列表
  sysgroupList(params) {
    return axios.get(`/mlf-counsel-service/sysgroup/list`, { params });
  },
  // H5PC共用：一键完成子任务
  finishTopicTask(params) {
    return axios.post('/mlf-counsel-service/psytask/finishTopicTask', params);
  },
  // 任务中心：批量删除
  psytaskDeleteBatch(params) {
    return axios.post('/mlf-counsel-service/psytask/deleteBatch', params);
  },
  // 团体报告：分页获取团体报告
  groupreportPage(params) {
    return axios.get(`/mlf-counsel-service/groupreport/page`, { params });
  },
  // 团体报告：添加团体报告对象
  groupreportSave(params) {
    return axios.post('/mlf-counsel-service/groupreport/save', params);
  },
  // 团体报告：批量删除团体报告
  groupreportDeleteBatch(params) {
    return axios.post('/mlf-counsel-service/groupreport/deleteBatch', params);
  },
  // 数据统计:心灵陪伴首页统计
  homeResources(params) {
    return axios.get(
      `/mlf-counsel-service/dataAnalysis/analysis/homeResources`,
      { params }
    );
  },
  // 咨询管理：统计数据
  zyglStatistics(params) {
    return axios.get(`/mlf-counsel-service/psytraineereservation/statistics`, {
      params
    });
  },
  // 数据统计:系统使用情况
  systemusage(params) {
    return axios.get(`/mlf-counsel-service/dataAnalysis/analysis/systemusage`, {
      params
    });
  },
  // 数据统计:整体情况统计
  overallsituation(params) {
    return axios.get(
      `/mlf-counsel-service/dataAnalysis/analysis/overallsituation`,
      { params }
    );
  },
  // 数据统计:心理教育
  coursestatistics(params) {
    return axios.get(
      `/mlf-counsel-service/dataAnalysis/analysis/coursestatistics`,
      { params }
    );
  },
  // 数据统计:认知数据模型
  gametrainsituation(params) {
    return axios.get(
      `/mlf-counsel-service/dataAnalysis/analysis/gametrainsituation`,
      { params }
    );
  },
  // 数据统计:心理健康情况
  healthConditions(params) {
    return axios.get(
      `/mlf-counsel-service/dataAnalysis/analysis/healthConditions`,
      { params }
    );
  },
  // 数据统计:心理数据模型
  mentalDataModel(params) {
    return axios.get(
      `/mlf-counsel-service/dataAnalysis/analysis/mentalDataModel`,
      { params }
    );
  },
  // 数据统计:大数据首页统计
  bigdatahome(params) {
    return axios.get(`/mlf-counsel-service/dataAnalysis/analysis/bigdatahome`, {
      params
    });
  },
  // 个人画像:人格特质
  personalityTraits(params) {
    return axios.get(
      `/mlf-counsel-service/personal/profile/personalityTraits`,
      {
        params
      }
    );
  },
  // 个人画像:个人画像
  personalProfile(params) {
    return axios.get(`/mlf-counsel-service/personal/profile/personalProfile`, {
      params
    });
  },
  // 数据统计:团体情况分析
  groupsituation(params) {
    return axios.get(
      `/mlf-counsel-service/dataAnalysis/analysis/groupsituation`,
      {
        params
      }
    );
  },
  // 个人画像:职业心理
  occupationalPsychology(params) {
    return axios.get(
      `/mlf-counsel-service/personal/profile/occupationalPsychology`,
      {
        params
      }
    );
  },
  // 个人画像:个人成长路径
  growthPath(params) {
    return axios.get(`/mlf-counsel-service/personal/profile/growthPath`, {
      params
    });
  },
  // 个人画像:心理资源
  psychologicalResources(params) {
    return axios.get(
      `/mlf-counsel-service/personal/profile/psychologicalResources`,
      {
        params
      }
    );
  },
  // 个人画像: 基础脑力
  basicMind(params) {
    return axios.get(`/mlf-counsel-service/personal/profile/basicMind`, {
      params
    });
  },
  // AI智能报告：添加AI智能报告对象
  aipersonreportSave(params) {
    return axios.post('/mlf-counsel-service/aipersonreport/save', params);
  },
  // AI智能报告：分页获取AI智能报告
  aipersonreportPage(params) {
    return axios.get(`/mlf-counsel-service/aipersonreport/page`, {
      params
    });
  },
  // AI智能报告：删除一个AI智能报告
  aipersonreportDelete(params) {
    return axios.post('/mlf-counsel-service/aipersonreport/delete', params);
  },
  // AI智能报告：获取AI智能报告对象
  getAipersonreportById(params) {
    return axios.get(`/mlf-counsel-service/aipersonreport/${params.id}`, {
      params
    });
  },
  // AI智能团体报告：分页获取AI智能团体报告
  aigroupreportPage(params) {
    return axios.get(`/mlf-counsel-service/aigroupreport/page`, {
      params
    });
  },
  // AI智能团体报告：添加AI智能团体报告对象
  aigroupreportSave(params) {
    return axios.post('/mlf-counsel-service/aigroupreport/save', params);
  },
  // AI智能团体报告：删除一个AI智能团体报告
  aigroupreportDelete(params) {
    return axios.post('/mlf-counsel-service/aigroupreport/delete', params);
  },
  // AI智能团体报告：批量删除AI智能团体报告
  aigroupreportDeleteBatch(params) {
    return axios.post('/mlf-counsel-service/aigroupreport/deleteBatch', params);
  },
  // AI智能团体报告：获取AI智能团体报告对象
  getAigroupreportById(params) {
    return axios.get(`/mlf-counsel-service/aigroupreport/${params.id}`, {
      params
    });
  },
  // VR设备用户绑定：分页获取VR设备用户绑定
  vruserbindPage(params) {
    return axios.get(`/mlf-counsel-service/vruserbind/page`, {
      params
    });
  },
  // VR设备用户绑定：添加VR设备用户绑定对象
  vruserbindSave(params) {
    return axios.post('/mlf-counsel-service/vruserbind/save', params);
  },
  // VR设备用户绑定：删除一个VR设备用户绑定
  vruserbindDelete(params) {
    return axios.post('/mlf-counsel-service/vruserbind/delete', params);
  },
  // VR设备用户绑定：批量删除VR设备用户绑定
  vruserbindDeleteBatch(params) {
    return axios.post('/mlf-counsel-service/vruserbind/deleteBatch', params);
  },
  // VR设备用户绑定：获取VR设备用户绑定对象
  getVruserbindById(params) {
    return axios.get(`/mlf-counsel-service/vruserbind/${params.id}`, {
      params
    });
  },

  // VR训练记录：分页获取VR训练记录
  uservrtrainrecordsPage(params) {
    return axios.get(`/mlf-counsel-service/uservrtrainrecords/page`, {
      params
    });
  },
  //VR训练记录：添加VR训练记录对象
  uservrtrainrecordsSave(params) {
    return axios.post('/mlf-counsel-service/uservrtrainrecords/save', params);
  },
  // VR训练记录：删除一个VR训练记录
  uservrtrainrecordsDelete(params) {
    return axios.post('/mlf-counsel-service/uservrtrainrecords/delete', params);
  },
  // VR训练记录：批量删除VR训练记录
  uservrtrainrecordsDeleteBatch(params) {
    return axios.post(
      '/mlf-counsel-service/uservrtrainrecords/deleteBatch',
      params
    );
  },
  // VR训练记录：获取VR训练记录对象
  getUservrtrainrecordsById(params) {
    return axios.get(`/mlf-counsel-service/uservrtrainrecords/${params.id}`, {
      params
    });
  }
};
