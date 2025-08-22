/**
 * 引入方式：
 * import {mapGetters} from 'vuex'
 * computed: {
 *   ...mapGetters([键名])
 * }
 */
const getters = {
  //app
  systemName: state => state.app.systemName,
  systemSortName: state => state.app.systemSortName,
  //user
  userId: state => state.user.userId,
  departId: state => state.user.departId,
  allAuth: state => state.user?.allAuth || [],
  userAuth: state => state.user?.userAuth || [],
  //permission
  allRouters: state => state.permission.allRouters,
  permissionRouters: state => state.permission.permissionRouters,
  menuRouters: state => state.permission.menuRouters
}
export default getters
