import axios from "axios";

const app = {
  state: {
    //系统名称
    systemName: ""
  },
  mutations: {
    SET_CUSTOM_VALUE: (state, value) => {
      state.systemName = value
    },
  },
  actions: {
    getCustomValue({commit, state}) {
      return new Promise((resolve, reject) => {
        axios.get(`http://${window.location.host}/customConfig.json`, {}).then(res => {
          let value = res.data
          commit('SET_CUSTOM_VALUE', value['systemName']);
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
  }
}

export default app
