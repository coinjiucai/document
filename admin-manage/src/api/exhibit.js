import axios from '@/utils/apiCommon';
// 自定义看板管理 
export default {
    // 通用：分页获取通用
    testexamplegeneralPage(params) {
        return axios.get(
            '/mlf-counsel-service/testexamplegeneral/page', { params }
        );
    },
    // 通用：添加通用对象
    testexamplegeneralSave(params) {
        return axios.post("/mlf-counsel-service/testexamplegeneral/save", params);
    },
    // 通用：获取通用对象
    gettesTexamplegeneralById(params) {
        return axios.get(`/mlf-counsel-service/testexamplegeneral/${params.id}`, { params });
    },
    // 通用：批量删除通用
    testexamplegeneralBatchDelete(params) {
        return axios.post("/mlf-counsel-service/testexamplegeneral/deleteBatch", params);
    },
    // 通用：根据用户ID获取通用对象
    testexamplegeneralByUserId(params) {
        return axios.get(`/mlf-counsel-service/testexamplegeneralByUserId/${params.userId}`, { params });
    },
};
