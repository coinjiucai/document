import router, { constantRoutes } from './router'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { isHttp } from '@/utils/validate'
import { isRelogin } from '@/utils/request'
import useUserStore from '@/store/modules/user'
import useSettingsStore from '@/store/modules/settings'
import usePermissionStore from '@/store/modules/permission'

NProgress.configure({ showSpinner: false });

const whiteList = ['/login', '/auth-redirect', '/bind', '/register', '/regetAccount', '/', '/index', '/showUrlFile', '/home/more', '/home/detail', '/search/searchHome', '/search/result', '/repetition/repetition', '/home/homepage'];
// '/home/homepage'
router.beforeEach((to, from, next) => {
    NProgress.start()
    if (getToken()) {
        to.meta.title && useSettingsStore().setTitle(to.meta.title)

        if (to.path === '/login' || to.path === '/register' || to.path === '/regetAccount' || to.path === '/' || to.path === '/index') {
            next({ path: '/home/homepage' })

            NProgress.done()
        } else {
            if (useUserStore().roles.length === 0) {

                useUserStore().getInfo().then(() => {
                    isRelogin.show = false
                    usePermissionStore().generateRoutes(to.path.indexOf("/admin") === 0).then(accessRoutes => {

                        accessRoutes.forEach(route => {
                            if (!isHttp(route.path)) {
                                router.addRoute(route)
                            }
                        })
                        next({
                            ...to,
                            replace: true
                        })
                    })
                }).catch(err => {
                    useUserStore().logOut().then(() => {
                        ElMessage.error(err)
                        next({
                            path: '/'
                        })
                    })
                })
            } else {
                next()
            }
        }
    } else {
        // let pathArr = to.path.split('/');
        // let rule = /^\d+$/;
        // if (pathArr.length > 2 && rule.test(pathArr[2])) {
        //     let newPath = pathArr[0] + '/' + pathArr[1];
        //     if (whiteList.indexOf(newPath) !== -1) {

        //         next()
        //     }
        // } else if (whiteList.indexOf(to.path) !== -1) {

        //     next()
        // } else {
        //     next(`/index`)
        //     NProgress.done()
        // }

        let businessTypeNew = localStorage.getItem('businessTypeNew');

        if (to.path.indexOf('/login') > -1 && !businessTypeNew) {
            next(`/index`);
        }

        if (whiteList.indexOf(to.path) > -1) {
            next();
        } else {
            next(`/index`)
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})
