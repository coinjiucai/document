import Vue from 'vue';
import Router from 'vue-router';

const _import = require('./_import_' + process.env.NODE_ENV);
Vue.use(Router);
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/naodianSystem', component: _import('naodian'), hidden: true },
  // { path: "/home", component: _import("home/index"), hidden: true },
  {
    path: '/404',
    component: _import('404'),
    hidden: true,
    meta: { title: '404' }
  }
];
export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
