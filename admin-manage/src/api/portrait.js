import axios from '@/utils/apiCommon';
// 人物画像
export default {
    // 睡眠
    psyresourceSleep(params) {
        return axios.get(
            '/mlf-counsel-service/userportrait/psyresource/sleep', { params }
        );
    },
    // 心理韧性
    psyresourcePsyresilience(params) {
        return axios.get(
            '/mlf-counsel-service/userportrait/psyresource/psyresilience', { params }
        );
    },
    // 生命意义
    psyresourceLifemeaning(params) {
        return axios.get(
            '/mlf-counsel-service/userportrait/psyresource/lifemeaning', { params }
        );
    },
    // 人际：人际信任
    interpersonalTrust(params) {
        return axios.get(
            '/mlf-counsel-service/userportrait/psyresource/interpersonal/trust', { params }
        );
    },
    // 人际：社会交往
    interpersonalSocial(params) {
        return axios.get(
            '/mlf-counsel-service/userportrait/psyresource/interpersonal/social', { params }
        );
    },
    // 情绪
    psyresourceEmotion(params) {
        return axios.get(
            '/mlf-counsel-service/userportrait/psyresource/emotion', { params }
        );
    },
};
