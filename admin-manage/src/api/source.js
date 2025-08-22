import axios from "@/utils/apiCommon";
// 资源管理
export default {
  // 量表分类：获取量表分类列表
  psypapercategoryList(params) {
    return axios.get("/mlf-counsel-service/psypapercategory/list", { params });
  },
  // 心理量表：分页获取心理量表
  psypaperPage(params) {
    return axios.get("/mlf-counsel-service/psypaper/page", { params });
  },
  // 心理量表：添加心理量表对象
  psypaperSave(params) {
    return axios.post("/mlf-counsel-service/psypaper/save", params);
  },
  // 心理量表：获取心理量表对象
  getPsypaperById(params) {
    return axios.get(`/mlf-counsel-service/psypaper/${params.id}`, { params });
  },
  // 心理量表：批量删除心理量表 
  psypaperDeleteBatch(params) {
    return axios.post("/mlf-counsel-service/psypaper/deleteBatch", params);
  },

  // 心理漫画：分页获取心理漫画
  psycomicsPage(params) {
    return axios.get("/mlf-counsel-service/psycomics/page", { params });
  },
  // 心理漫画：添加心理漫画对象
  psycomicsSave(params) {
    return axios.post("/mlf-counsel-service/psycomics/save", params);
  },
  // 心理漫画：获取心理漫画对象
  getPsycomicsById(params) {
    return axios.get(`/mlf-counsel-service/psycomics/${params.id}`, { params });
  },
  // 心理漫画：批量删除心理漫画
  psycomicsDeleteBatch(params) {
    return axios.post("/mlf-counsel-service/psycomics/deleteBatch", params);
  },


  // 心理资讯：分页获取心理资讯
  psynewsPage(params) {
    return axios.get("/mlf-counsel-service/psynews/page", { params });
  },
  // 心理资讯：添加心理资讯对象
  psynewsSave(params) {
    return axios.post("/mlf-counsel-service/psynews/save", params);
  },
  // 心理资讯：获取心理资讯对象
  getPsynewsById(params) {
    return axios.get(`/mlf-counsel-service/psynews/${params.id}`, { params });
  },
  // 心理资讯：批量删除心理资讯
  psynewsDeleteBatch(params) {
    return axios.post("/mlf-counsel-service/psynews/deleteBatch", params);
  },

  // 心理游戏分类：心理游戏分类树
  psygameclassifyTreeList(params) {
    return axios.get(`/mlf-counsel-service/psygameclassify/treeList`, { params });
  },
  // 心理游戏分类：添加心理游戏分类对象
  psygameclassifySave(params) {
    return axios.post("/mlf-counsel-service/psygameclassify/save", params);
  },
  // 心理游戏分类：删除一个心理游戏分类
  psygameclassifyDelete(params) {
    return axios.post("/mlf-counsel-service/psygameclassify/delete", params);
  },

  // 心理游戏：分页获取心理游戏
  psygamesPage(params) {
    return axios.get("/mlf-counsel-service/psygames/page", { params });
  },
  // 心理游戏：添加心理游戏对象
  psygamesSave(params) {
    return axios.post("/mlf-counsel-service/psygames/save", params);
  },
  // 心理游戏：获取心理游戏对象
  getPsygamesById(params) {
    return axios.get(`/mlf-counsel-service/psygames/${params.id}`, { params });
  },
  // 心理游戏：批量删除心理游戏
  psygamesDeleteBatch(params) {
    return axios.post("/mlf-counsel-service/psygames/deleteBatch", params);
  },



  // 心理音乐：分页获取心理音乐
  psymusicsPage(params) {
    return axios.get("/mlf-counsel-service/psymusics/page", { params });
  },
  // 心理音乐：添加心理音乐对象
  psymusicsSave(params) {
    return axios.post("/mlf-counsel-service/psymusics/save", params);
  },
  // 心理音乐：获取心理音乐对象
  getPsymusicsById(params) {
    return axios.get(`/mlf-counsel-service/psymusics/${params.id}`, { params });
  },
  // 心理音乐：批量删除心理音乐
  psymusicsDeleteBatch(params) {
    return axios.post("/mlf-counsel-service/psymusics/deleteBatch", params);
  },

  // 心理预警管理：分页获取心理预警管理
  psyearlywarnmanagementPage(params) {
    return axios.get("/mlf-counsel-service/psyearlywarnmanagement/page", { params });
  },
  // 心理预警管理：添加心理预警管理对象
  psyearlywarnmanagementSave(params) {
    return axios.post("/mlf-counsel-service/psyearlywarnmanagement/save", params);
  },
  // 心理预警管理：获取心理预警管理对象
  getPsyearlywarnmanagementById(params) {
    return axios.get(`/mlf-counsel-service/psyearlywarnmanagement/${params.id}`, { params });
  },
  // 心理预警管理：批量删除心理预警管理
  psyearlywarnmanagementDeleteBatch(params) {
    return axios.post("/mlf-counsel-service/psyearlywarnmanagement/deleteBatch", params);
  },
  // 预警干预：分页获取预警干预
  psyearlywarnmanagementintervenePage(params) {
    return axios.get("/mlf-counsel-service/psyearlywarnmanagementintervene/page", { params });
  },
  // 预警干预：批量删除预警干预
  psyearlywarnmanagementinterveneDeleteBatch(params) {
    return axios.post("/mlf-counsel-service/psyearlywarnmanagementintervene/deleteBatch", params);
  },

  // 人工干预：分页获取人工干预
  psyearlywarnmanagementintraocularPage(params) {
    return axios.get("/mlf-counsel-service/psyearlywarnmanagementintraocular/page", { params });
  },
  // 人工干预：批量删除人工干预
  psyearlywarnmanagementintraocularDeleteBatch(params) {
    return axios.post("/mlf-counsel-service/psyearlywarnmanagementintraocular/deleteBatch", params);
  },
  // 人工干预：添加人工干预对象
  psyearlywarnmanagementintraocularSave(params) {
    return axios.post("/mlf-counsel-service/psyearlywarnmanagementintraocular/save", params);
  },
  // 人工干预：获取人工干预对象
  getPsyearlywarnmanagementintraocularById(params) {
    return axios.get(`/mlf-counsel-service/psyearlywarnmanagementintraocular/${params.id}`, { params });
  },


  // 题库分类：获取题库分类树 
  taclassifyTreeList(params) {
    return axios.get(`/mlf-counsel-service/taclassify/treeList`, { params });
  },


  // 心理课堂分类：心理课堂分类树
  getXlkcflList(params) {
    return axios.get(`/mlf-counsel-service/psycourseclassify/treeList`, { params });
  },
  // 心理课堂分类：删除一个心理课堂分类
  delXlkcfl(params) {
    return axios.post("/mlf-counsel-service/psycourseclassify/delete", params);
  },
  // 心理课堂：分页获取心理课堂
  getXlkcList(params) {
    return axios.get(`/mlf-counsel-service/psycourse/page`, { params });
  },
  // 心理课堂：批量删除心理课堂
  delMulXlkc(params) {
    return axios.post("/mlf-counsel-service/psycourse/deleteBatch", params);
  },
  // 心理课堂：添加心理课堂对象
  addXlkc(params) {
    return axios.post("/mlf-counsel-service/psycourse/save", params);
  },
  // 心理课堂：获取心理课堂对象
  getXlkcDesc(id) {
    return axios.get(`/mlf-counsel-service/psycourse/${id}`);
  },
  // 章节：章节树
  getZjList(params) {
    return axios.get(`/mlf-counsel-service/psycourse/chaptrt/treeList`, { params });
  },
  // 章节：添加章节对象
  addZj(params) {
    return axios.post("/mlf-counsel-service/psycourse/chaptrt/save", params);
  },
  // 章节：删除一个章节
  delZj(params) {
    return axios.post("/mlf-counsel-service/psycourse/chaptrt/delete", params);
  },
  // 章节：获取章节对象
  getZjDesc(id) {
    return axios.get(`/mlf-counsel-service/psycourse/chaptrt/${id}`);
  },
  // 文件上传
  importFile(data) {
    return axios.post("/mlf-system-service/sys/common/upload", data);
  },
  // 心理课堂：添加课件
  importKj(data) {
    return axios.post("/mlf-counsel-service/psycourse/courseware/save", data);
  },
  // 心理课堂：更换课程分类
  changeKcSort(data) {
    return axios.post("/mlf-counsel-service/psycourse/updateClassifyBatch", data);
  },
  // 心理课堂：添加-修改试题 试卷ID为课程ID
  addKcQuestion(data) {
    return axios.post("/mlf-counsel-service/psycourse/examination/save", data);
  },
  // 问卷：分页获取问卷
  getQuestionnairPage(params) {
    return axios.get(`/mlf-counsel-service/questionnair/page`, { params });
  },

  // 量表推送：分页获取量表推送
  getPsypaperpublishPage(params) {
    return axios.get(`/mlf-counsel-service/psypaperpublish/page`, { params });
  },
  // 量表推送：添加量表推送对象
  psypaperpublishSave(params) {
    return axios.post("/mlf-counsel-service/psypaperpublish/save", params);
  },
  // 量表推送：批量删除量表推送
  psypaperpublishDeleteBatch(params) {
    return axios.post("/mlf-counsel-service/psypaperpublish/deleteBatch", params);
  },
  // 心理量表：树形数据
  psypaperTreeList(params) {
    return axios.get("/mlf-counsel-service/psypaper/treeList");
  },
  // 量表测试：分页获取量表测试
  getPsypapermemberPage(params) {
    return axios.get(`/mlf-counsel-service/psypapermember/page`, { params });
  },
};
