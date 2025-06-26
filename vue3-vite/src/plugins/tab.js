import useTagsViewStore from '@/store/modules/tagsView'
import router from '@/router'

export default {

    refreshPage(obj) {
        const {path, matched} = router.currentRoute.value;
        if (obj === undefined) {
            matched.forEach((m) => {
                if (m.components && m.components.default && m.components.default.name) {
                    if (!['Layout', 'ParentView'].includes(m.components.default.name)) {
                        obj = {name: m.components.default.name, path: path};
                    }
                }
            });
        }
        return useTagsViewStore().delCachedView(obj).then(() => {
            const {path} = obj
            router.replace({
                path: '/redirect' + path
            })
        })
    },

    closeOpenPage(obj) {
        useTagsViewStore().delView(router.currentRoute.value);
        if (obj !== undefined) {
            return router.push(obj);
        }
    },

    closePage(obj) {
        if (obj === undefined) {
            return useTagsViewStore().delView(router.currentRoute.value).then(({lastPath}) => {
                return router.push(lastPath || '/index');
            });
        }
        return useTagsViewStore().delView(obj);
    },

    closeAllPage() {
        return useTagsViewStore().delAllViews();
    },

    closeLeftPage(obj) {
        return useTagsViewStore().delLeftTags(obj || router.currentRoute.value);
    },

    closeRightPage(obj) {
        return useTagsViewStore().delRightTags(obj || router.currentRoute.value);
    },

    closeOtherPage(obj) {
        return useTagsViewStore().delOthersViews(obj || router.currentRoute.value);
    },

    openPage(url) {
        return router.push(url);
    },

    updatePage(obj) {
        return useTagsViewStore().updateVisitedView(obj);
    }
}
