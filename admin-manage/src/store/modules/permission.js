import { constantRouterMap } from '@/router';

const permission = {
  state: {
    // 本用户所有的路由,包括了固定的路由和下面的permissionRouters!
    allRouters: constantRouterMap,
    // 当前用户的权限路由（根据权限生成的）
    permissionRouters: [],
    // 菜单路由，从权限路由中截取用于菜单显示的路由
    menuRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      // 将固定路由和新增路由进行合并, 成为本用户最终的全部路由信息
      state.allRouters = constantRouterMap.concat(routers);
      state.permissionRouters = routers;
      // 菜单路由存放在routers[0]['children']中，参考generateIndexRouter函数
      state.menuRouters = routers[0]['children'];
    }
  },
  actions: {
    // 动态添加主界面路由，需要缓存
    UpdateAppRouter({ commit }, routes) {
      return new Promise((resolve) => {
        const routeList = routes.constRoutes;
        commit('SET_ROUTERS', routeList);
        resolve();
      });
    }
  }
};
export default permission;
