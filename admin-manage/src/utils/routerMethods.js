import Layout from '@/views/layout/Layout';

const _import = require(`../router/_import_${ process.env.NODE_ENV}`);

/**
 * 生成首页路由
 * @param data
 * @returns {[{redirect: *, path: string, component, children: *[]},{redirect: *, path: string, component, hidden: boolean},{redirect: string, path: string, hidden: boolean}]}
 */
export function generateIndexRouter(data) {
  const path = data[0]?.redirect || data[0].path;
  const allRouter = generateChildRouters(data);
  return [
    {
      path: '/',
      component: Layout,
      redirect: path,
      children: [...allRouter]
    },
    {
      path: '',
      component: Layout,
      redirect: path,
      hidden: true
    },
    {
      path: '*',
      redirect: '/404',
      hidden: true
    }
  ];
}

/**
 * 生成嵌套路由（子路由）
 * @param data
 * @returns {*[]}
 */
function generateChildRouters(data) {
  const routers = [];
  for (const item of data) {
    const component = item.component;
    const menu = {
      path: item.path,
      name: item.name,
      redirect: item.redirect,
      component: tryToGetComponent(component),
      hidden: item.hidden,
      meta: {
        title: item.meta.title,
        icon: item.meta.icon,
        url: item.meta.url,
        permissionList: item.meta.permissionList,
        keepAlive: item.meta.keepAlive,
        internalOrExternal: item.meta.internalOrExternal,
        componentName: item.meta.componentName
      }
    };
    if (item.alwaysShow) {
      menu.alwaysShow = true;
      menu.redirect = menu.path;
    }
    if (item.children && item.children.length > 0) {
      menu.children = [...generateChildRouters(item.children)];
    }
    // 判断是否生成路由，item.route === '0'不生成
    // 判断是否存在对应组件，menu.component时不生成该路由
    if (!(item.route && item.route === '0') && menu.component) {
      routers.push(menu);
    }
  }
  return routers;
}

/**
 * 尝试获取路由相关组件文件
 * @param path 组件地址
 * @return {*|null} 找到则返回对应组件，找不到返回空
 */
function tryToGetComponent(path) {
  try {
    return _import(path);
  } catch (e) {
    console.debug(`找不到路由对应的组件地址：${path}\n`, e);
    return null;
  }
}
