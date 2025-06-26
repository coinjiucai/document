import auth from '@/plugins/auth'
import router, { constantRoutes, dynamicRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import adminLayout from '@/layout/admin_layout'
import frontLayout from '@/layout/front_layout'
import ParentView from '@/components/ParentView'
import InnerLink from '@/layout/components/InnerLink'

const modules = import.meta.glob('./../../views/**/*.vue')

const usePermissionStore = defineStore(
    'permission', {
    state: () => ({
        routes: [],

        addRoutes: [],
        defaultRoutes: [],
        topbarRouters: [],
        sidebarRouters: [],
        firstMenuRoutes: [],
    }),
    actions: {
        setRoutes(routes) {
            this.addRoutes = routes
            this.routes = constantRoutes.concat(routes)
        },
        setDefaultRoutes(routes) {
            this.defaultRoutes = constantRoutes.concat(routes)
        },
        setTopbarRoutes(routes) {
            this.topbarRouters = routes
        },
        setSidebarRouters(routes) {
            routes = routes.filter(route => route !== undefined)
            this.sidebarRouters = routes
        },
        setFirstMenuRoutes(routes) {
            this.firstMenuRoutes = routes
        },
        generateRoutes(isAdminRoute = false) {
            return new Promise(resolve => {

                getRouters().then(res => {
                    const sdata = JSON.parse(JSON.stringify(res.data))
                    const rdata = JSON.parse(JSON.stringify(res.data))
                    const defaultData = JSON.parse(JSON.stringify(res.data))
                    const sidebarRoutes = filterAsyncRouter(filterAdminNode(sdata, isAdminRoute))
                    const rewriteRoutes = filterAsyncRouter(filterAdminNode(rdata, isAdminRoute), false, true)
                    let defaultRoutes = filterAsyncRouter(filterAdminNode(defaultData, isAdminRoute))
                    const asyncRoutes = filterDynamicRoutes(dynamicRoutes)
                    asyncRoutes.forEach(route => {
                        router.addRoute(route)
                    })
                    if (isAdminRoute) {
                        const index = [{
                            name: "adminIndex",
                            path: 'admin/index',
                            meta: { title: '统计报表', icon: 'dashboard' }
                        }]
                        defaultRoutes = index.concat(defaultRoutes)
                    } else {
                        // const index = [{
                        //     path: '/index',
                        //     meta: {title: '首页', icon: 'dashboard'}
                        // }]
                        // defaultRoutes = index.concat(defaultRoutes)
                    }
                    this.setRoutes(rewriteRoutes)
                    this.setSidebarRouters(constantRoutes.concat(sidebarRoutes))
                    this.setDefaultRoutes(sidebarRoutes)
                    this.setTopbarRoutes(defaultRoutes)
                    // 一级菜单权限
                    this.setFirstMenuRoutes(res.data.map(data => data.name))

                    resolve(rewriteRoutes)
                })
            })
        }
    }
})

function filterAdminNode(nodeMap, type = true) {
    var children = []
    nodeMap.forEach((el, index) => {
        if (el.isAdminRoute === type) {
            if (el.children != null && el.children != "undefined" && el.children && el.children.length) {
                el.children = filterAdminNode(el.children, type)
            }

            children.push(el)
        }
    })
    return children
}

function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
    return asyncRouterMap.filter(route => {
        if (type && route.children) {
            route.children = filterChildren(route.children)
        }
        if (route.component) {

            if (route.component === 'adminLayout') {
                route.component = adminLayout
            } else if (route.component === 'frontLayout') {
                route.component = frontLayout
            } else if (route.component === 'ParentView') {
                route.component = ParentView
            } else if (route.component === 'InnerLink') {
                route.component = InnerLink
            } else {
                route.component = loadView(route.component)
            }
        }
        if (route.children != null && route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children, route, type)
        } else {
            delete route['children']
            delete route['redirect']
        }
        return true
    })
}

function filterChildren(childrenMap, lastRouter = false) {
    var children = []
    childrenMap.forEach((el, index) => {
        if (el.children && el.children.length) {
            if (el.component === 'ParentView' && !lastRouter) {
                el.children.forEach(c => {
                    c.path = el.path + '/' + c.path
                    if (c.children && c.children.length) {
                        children = children.concat(filterChildren(c.children, c))
                        return
                    }
                    children.push(c)
                })
                return
            }
        }
        if (lastRouter) {
            el.path = lastRouter.path + '/' + el.path
        }
        children = children.concat(el)
    })
    return children
}

export function filterDynamicRoutes(routes) {
    const res = []
    routes.forEach(route => {
        if (route.permissions) {
            if (auth.hasPermiOr(route.permissions)) {
                res.push(route)
            }
        } else if (route.roles) {
            if (auth.hasRoleOr(route.roles)) {
                res.push(route)
            }
        }
    })
    return res
}

export const loadView = (view) => {
    let res;
    for (const path in modules) {
        const dir = path.split('views/')[1].split('.vue')[0];

        if (dir === view) {
            res = () => modules[path]();
        }
    }
    return res;
}

export default usePermissionStore
