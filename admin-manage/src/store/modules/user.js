import { getToken, removeToken, setToken } from '@/utils/auth';
// todo 当前采用mock进行虚拟请求，如需更换实际请求可以更换为apiCommon或其它的
import { default as axios } from '../../utils/apiCommon';
import api from '@/api';

const user = {
  state: {
    username: '',
    userId: '',
    departId: '',
    departName: '',
    theme: 'light',
    menus: [],
    // 公钥
    publicKey: null,
    // 全部的按钮权限
    allAuth: null,
    // 用户的按钮权限
    userAuth: null,
    quicklyMenuList: []
  },
  mutations: {
    SET_USER: (state, userInfo) => {
      state.username = userInfo.username;
      state.userId = userInfo.id;
      state.departId = userInfo.departId;
      state.departName = userInfo.departName;
      state.theme = userInfo.theme;
      state.menus = userInfo['menuList'];
    },
    SET_USER_PUBLIC_KEY: (state, key) => {
      state.publicKey = key;
    },
    SET_ALLAUTH: (state, allAuth) => {
      state.allAuth = allAuth;
    },
    SET_USER_AUTH: (state, userAuth) => {
      state.userAuth = userAuth;
    },
    RESET_USER: (state) => {
      state.username = '';
      state.userId = '';
      state.departId = '';
      state.departName = '';
      state.theme = 'light';
      state.menus = [];
      state.publicKey = null;
      state.allAuth = null;
      state.userAuth = null;
    },
    SET_QUICKLY_MENU: (state, item) => {
      const fItem = state.quicklyMenuList.find((v) => v.path == item.path);
      console.log(
        item,
        '------',
        state.quicklyMenuList,
        '---------',
        state.quicklyMenuList.length
      );
      if (fItem) {
        const index = state.quicklyMenuList.findIndex(
          (v) => item.path == v.path
        );
        state.quicklyMenuList.splice(index, 1);
      }
      state.quicklyMenuList.push(item);
    },
    DELETE_QUICKLY_MENU: (state, item) => {
      const menus = state.quicklyMenuList.filter((v) => item.path != v.path);
      state.quicklyMenuList = menus;
    }
  },
  actions: {
    // 登录
    Login({ commit, state }, loginForm) {
      return new Promise((resolve, reject) => {
        axios({
          url: '/mlf-system-service/sys/login',
          method: 'post',
          data: loginForm
        })
          .then((data) => {
            const res = data.result;
            // 储存用户信息
            commit('SET_USER', res.userInfo);
            // cookie保存登录状态,仅靠vuex保存的话,页面刷新就会丢失登录状态
            setToken(res.token);
            resolve(data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    // 刷新页面的时候重新获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        axios({
          url: '/mlf-system-service/sys/user/getUserInfo',
          method: 'GET'
        })
          .then((data) => {
            const res = data.result;
            // 储存用户信息
            commit('SET_USER', res.userInfo);
            if (localStorage.getItem('publicKey')) {
              const publicKey = localStorage.getItem('publicKey');
              commit('SET_USER_PUBLIC_KEY', publicKey);
            }
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 获取公钥
    getUserPublicKey({ commit }) {
      return new Promise((resolve, reject) => {
        axios({
          url: '/mlf-system-service/sys/publicKey',
          method: 'post'
        })
          .then((data) => {
            const res = data.result;
            commit('SET_USER_PUBLIC_KEY', res);
            localStorage.setItem('publicKey', res);
            // 获取公钥时不需要传递token，传token会报错
            removeToken();
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 获取用户信息
    GetPermissionList({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        api.login
          .getUserPermissionByToken()
          .then((res) => {
            const menuData = res['result'].menu;
            const authData = res['result'].auth;
            const allAuthData = res['result'].allAuth;
            if (menuData && menuData.length > 0) {
              // 全部的按钮权限
              commit('SET_ALLAUTH', allAuthData);
              // 用户的按钮权限
              commit('SET_USER_AUTH', authData);
            } else {
              reject('getPermissionList: 权限列表不能为空数组 !');
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 登出
    LogOut({ commit }) {
      return new Promise((resolve) => {
        axios({
          url: '/mlf-system-service/sys/logout',
          method: 'get'
        })
          .then((data) => {
            resolve(data);
          })
          .finally(() => {
            commit('RESET_USER');
            removeToken();
          });
      });
    }
  }
};
export default user;
