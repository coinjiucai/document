import axios from '@/utils/apiIntelligent';
export default {
  chat(params) {
    return axios.post("http://zhongyuejiang.gnway.cc:80/chat", params);
  },

};
