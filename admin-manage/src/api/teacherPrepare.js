import axios from "@/utils/apiCommon";
// 教师备课
export default {
    // 课件：分页获取课件
    coursewarePage(params) {
        return axios.get("/mlf-counsel-service/courseware/page", { params });
    },
    // 课件：添加课件对象
    coursewareSave(params) {
        return axios.post("/mlf-counsel-service/courseware/save", params);
    },
    // 教师备课：获取课件对象
    getCoursewareById(params) {
        return axios.get(`/mlf-counsel-service/courseware/${params.id}`, { params });
    },
    // 课件：润色
    coursewarePolish(params) {
        return axios.post("/mlf-counsel-service/courseware/polish", params);
    },
    // 课件：格式调整
    coursewareFormat(params) {
        return axios.post("/mlf-counsel-service/courseware/format", params);
    },
    // 课件：批量删除课件
    coursewareDeleteBatch(params) {
        return axios.post("/mlf-counsel-service/courseware/deleteBatch", params);
    },

};
