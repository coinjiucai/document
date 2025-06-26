import { createWebHistory, createRouter } from 'vue-router'

import adminLayout from '../layout/admin_layout.vue'
import frontLayout from '../layout/front_layout.vue'

export const constantRoutes = [
  {
    path: '/redirect',
    component: adminLayout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  }
  , {
    path: '/login'
    , component: () => import('@/views/login.vue')
    , name: 'Login'
  }
  , {
    path: '/register',
    component: () => import('@/views/register.vue'),
    hidden: true
  }
  , {
    path: '/regetAccount',
    component: () => import('@/views/regetAccount.vue'),
    hidden: true
  }
  , {
    path: "/:pathMatch(.*)*",
    component: () => import('@/views/error/404.vue'),
    hidden: true
  }
  , {
    path: '/401',
    component: () => import('@/views/error/401.vue'),
    hidden: true
  }
  , {
    path: '/showUrlFile/:id?',
    component: () => import('@/views/front/index/showUrlFile.vue'),
    hidden: true
  }
  , {
    path: '/index',
    component: () => import('@/views/front/home/entrance.vue'),
  }
  , {
    path: '/',
    component: frontLayout,
    hidden: true,
    redirect: '/index',
    children: [
      {
        path: '/home/homepage',
        component: () => import('@/views/front/home/home.vue'),
        name: 'Homepage',
        meta: { title: '首页', icon: 'HomeFilled' }
      },
      {
        path: '/home/more',
        component: () => import('@/views/front/home/more.vue'),
        name: 'More',
        meta: { title: '资源库更多', icon: 'HomeFilled' }
      },
      {
        path: '/home/detail',
        component: () => import('@/views/front/home/detail.vue'),
        name: 'Detail',
        meta: { title: '资源库详情', icon: 'HomeFilled' }
      },
      {
        path: '/search/searchHome',
        component: () => import('@/views/front/search/result/searchHome.vue'),
        name: 'SearchHome',
        meta: { title: '全文检索', icon: 'HomeFilled' }
      },
      {
        path: '/search/result',
        component: () => import('@/views/front/search/result/index.vue'),
        name: 'Result',
        meta: { title: '全文检索结果', icon: 'HomeFilled' }
      },
      {
        path: '/repetition/repetition',
        component: () => import('@/views/front/repetition/index.vue'),
        name: 'Repetition',
        meta: { title: '重复度检测', icon: 'HomeFilled' }
      },
    ]
  },

  , {
    path: '/admin',
    component: adminLayout,
    redirect: '/admin/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/admin/index.vue'),
        name: 'adminIndex',
        meta: { title: '后台首页', icon: 'dashboard', affix: true }
      }
    ]
  }
  , {
    path: '/user',
    component: frontLayout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/front/system/user/profile/index.vue'),
        name: 'forntProfile',
        meta: { title: '个人资料', icon: 'user' }
      },
      {
        path: 'proList',
        component: () => import('@/views/front/system/user/proList/index.vue'),
        name: 'userProList',
        meta: { title: '用户项目列表', icon: 'user' }
      }
    ]
  }
  , {
    path: '/admin/system/dict-data',
    component: adminLayout,
    hidden: true,
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: () => import('@/views/admin/system/dict/data'),
        name: 'Data',
        meta: { title: '字典数据', activeMenu: '/admin/system/dict' }
      }]
  }
  , {
    path: '/admin/system/accesslog',
    component: adminLayout,
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/admin/system/accessLog'),
        name: 'accessLog',
        meta: { title: '访问日志', activeMenu: '/admin/access/accessStatistics' }
      }]
  }
  , 
  
  {
    path: '/admin/monitor/job-log',
    component: adminLayout,
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/admin/monitor/job/log'),
        name: 'JobLog',
        meta: { title: '调度日志', activeMenu: '/admin/monitor/job' }
      }
    ]
  }
  , {
    path: '/admin/tool/gen-edit',
    component: adminLayout,
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/admin/tool/gen/editTable'),
        name: 'GenEdit',
        meta: { title: '修改生成配置', activeMenu: '/tool/gen' }
      }
    ]
  }
];
export const dynamicRoutes = [
  {
    path: '/admin/system/user-auth',
    component: adminLayout,
    hidden: true,
    permissions: ['system:user:edit'],
    children: [
      {
        path: 'role/:userId',
        component: () => import('@/views/admin/system/user/authRole'),
        name: 'AuthRole',
        meta: { title: '分配角色', activeMenu: '/admin/system/user' }
      }
    ]
  },
  {
    path: '/admin/system/role-auth',
    component: adminLayout,
    hidden: true,
    permissions: ['system:role:edit'],
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: () => import('@/views/admin/system/role/authUser'),
        name: 'AuthUser',
        meta: { title: '分配用户', activeMenu: '/admin/system/role' }
      }
    ]
  },
  {
    path: '/admin/system/dict-data',
    component: adminLayout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: () => import('@/views/admin/system/dict/data'),
        name: 'Data',
        meta: { title: '字典数据', activeMenu: '/admin/system/dict' }
      }
    ]
  },
  {
    path: '/admin/monitor/job-log',
    component: adminLayout,
    hidden: true,
    permissions: ['monitor:job:list'],
    children: [
      {
        path: 'index',
        component: () => import('@/views/admin/monitor/job/log'),
        name: 'JobLog',
        meta: { title: '调度日志', activeMenu: '/admin/monitor/job' }
      }
    ]
  },
  {
    path: '/admin/tool/gen-edit',
    component: adminLayout,
    hidden: true,
    permissions: ['tool:gen:edit'],
    children: [
      {
        path: 'index/:tableId(\\d+)',
        component: () => import('@/views/admin/tool/gen/editTable'),
        name: 'GenEdit',
        meta: { title: '修改生成配置', activeMenu: '/admin/tool/gen' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
});

export default router
