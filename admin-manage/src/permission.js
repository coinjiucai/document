import router from './router';
import store from './store';
// Progress 进度条
import NProgress from 'nprogress';
// Progress 进度条样式
import 'nprogress/nprogress.css';
// token相关操作
import { getToken, removeToken } from '@/utils/auth';
import { generateIndexRouter } from '@/utils/routerMethods';

// 白名单,不需要登录的路由
const whiteList = ['/login', '/404', '/naodianSystem'];

/**
 * 更新路由信息
 * @param to
 * @param from
 * @param next
 * @param res
 */
function updateRouters(to, from, next, res) {
  try {
    const menuData = res.result.menu;
    if (menuData && menuData.length > 0) {
      const constRoutes = generateIndexRouter(menuData);
      // 添加主界面路由
      store.dispatch('UpdateAppRouter', { constRoutes }).then(() => {
        // 动态添加可访问路由表
        console.log(store.getters.permissionRouters, 'sfsdf');
        router.addRoutes(store.getters.permissionRouters);
        const redirect = to.path;
        if (to.path === redirect) {
          // 第一次进入
          next({ ...to, replace: true });
        } else {
          // 以后进入
          next({ path: redirect });
        }
      });
    } else {
      next('/login');
    }
  } catch (error) {
    console.log('设置用户路由失败', error);
    store.commit('RESET_USER');
    removeToken();
    next('/login');
  }
}

// 路由守卫
router.beforeEach(async (to, from, next) => {
  if (to.meta.title) {
    document.title = `${store.state.app.systemName}-${to.meta.title}`;
  }
  // 开启进度条
  NProgress.start();
  if (getToken()) {
    console.debug('已经登录');
    // 如果已经登录，则前往登录页时自动跳转到主页
    if (to.path === '/login') {
      next({ path: '/' });
      // 关闭进度条
      NProgress.done();
    } else if (store.getters.permissionRouters.length === 0) {
      if (!store.getters.userId) {
        // 页面刷新的时候store里面的信息会重置，需要重新获取
        await store.dispatch('GetInfo').catch(() => {
          // 拿不到用户信息就退出登录
          store.dispatch('LogOut');
        });
      }
      try {
        await store
          .dispatch('GetPermissionList')
          .then((res) => {
            updateRouters(to, from, next, res);
          })
          .finally(() => {
            // 关闭进度条
            NProgress.done();
          });
      } catch (error) {
        store.dispatch('LogOut');
        next('/login');
      }
    } else {
      next();
      // 关闭进度条
      NProgress.done();
    }
  } else if (whiteList.indexOf(to.path) !== -1) {
    // 如果前往的路径是白名单内的,就可以直接前往
    next();
    // 关闭进度条
    NProgress.done();
  } else {
    // 如果路径不是白名单内的,而且又没有登录,就跳转登录页面
    store.commit('RESET_USER');
    removeToken();
    next('/login');
    // 关闭进度条
    NProgress.done();
  }
});
router.afterEach(() => {
  // 关闭进度条
  NProgress.done();
});
