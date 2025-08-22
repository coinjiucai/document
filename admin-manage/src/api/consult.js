import axios from "@/utils/apiCommon";
// 咨询管理
export default {
    // 咨询预约：分页获取咨询预约
    psytraineereservationPage(params) {
        return axios.get("/mlf-counsel-service/psytraineereservation/page", { params });
    },
    // 咨询预约：添加咨询预约对象
    psytraineereservationSave(params) {
        return axios.post("/mlf-counsel-service/psytraineereservation/save", params);
    },
    // 咨询预约：获取咨询预约对象
    getPsytraineereservationById(params) {
        return axios.get(`/mlf-counsel-service/psytraineereservation/${params.id}`, { params });
    },
    // 咨询预约：批量删除咨询预约
    psytraineereservationDeleteBatch(params) {
        return axios.post("/mlf-counsel-service/psytraineereservation/deleteBatch", params);
    },

    // 学员咨询：分页获取学员咨询
    psytraineeconsultationage(params) {
        return axios.get("/mlf-counsel-service/psytraineeconsultation/page", { params });
    },
    // 学员咨询：添加学员咨询对象
    psytraineeconsultationSave(params) {
        return axios.post("/mlf-counsel-service/psytraineeconsultation/save", params);
    },
    // 学员咨询：获取学员咨询对象
    getPsytraineeconsultationById(params) {
        return axios.get(`/mlf-counsel-service/psytraineeconsultation/${params.id}`, { params });
    },
    // 学员咨询：批量删除学员咨询
    psytraineeconsultationDeleteBatch(params) {
        return axios.post("/mlf-counsel-service/psytraineeconsultation/deleteBatch", params);
    },

    // 心理咨询轮播图：分页获取心理咨询轮播图
    psycounselcarouselPage(params) {
        return axios.get("/mlf-counsel-service/psycounselcarousel/page", { params });
    },
    // 心理咨询轮播图：添加心理咨询轮播图对象
    psycounselcarouselSave(params) {
        return axios.post("/mlf-counsel-service/psycounselcarousel/save", params);
    },
    // 心理咨询轮播图：获取心理咨询轮播图对象
    getPsycounselcarouselById(params) {
        return axios.get(`/mlf-counsel-service/psycounselcarousel/${params.id}`, { params });
    },
    // 心理咨询轮播图：批量删除心理咨询轮播图
    psycounselcarouselDeleteBatch(params) {
        return axios.post("/mlf-counsel-service/psycounselcarousel/deleteBatch", params);
    },

    // 心理咨询师：分页获取心理咨询师
    psycounselorPage(params) {
        return axios.get("/mlf-counsel-service/psycounselor/page", { params });
    },
    // 心理咨询师：添加心理咨询师对象
    psycounselorSave(params) {
        return axios.post("/mlf-counsel-service/psycounselor/save", params);
    },
    // 心理咨询师：获取心理咨询师对象
    getPsycounselorById(params) {
        return axios.get(`/mlf-counsel-service/psycounselor/${params.id}`, { params });
    },
    // 心理咨询师：批量删除心理咨询师
    psycounselorDeleteBatch(params) {
        return axios.post("/mlf-counsel-service/psycounselor/deleteBatch", params);
    },
};
