import {
    login,
    logout,
    getInfo
} from "@/api/login"
import {
    getToken,
    setToken,
    removeToken
} from '@/utils/auth'
import defAva from '@/assets/images/profile.png'
import defAva_girl from '@/assets/images/profile_girl.png'
import Cookies from 'js-cookie'
import consts from "@/utils/consts";

const useUserStore = defineStore(
    'user', {
    state: () => ({
        token: getToken(),
        id: '',
        name: '',
        nickName: '',
        idcard: '',
        dept: {},
        avatar: '',
        roles: [],
        permissions: [],
        businessType: '',
        zj: '', // 是否专家，Y是，N否
        isAdmin: false // 是否管理员，true是，false否
    }),
    actions: {

        login(userInfo) {
            const username = userInfo.username.trim()
            const password = userInfo.password
            const code = userInfo.code
            const uuid = userInfo.uuid
            return new Promise((resolve, reject) => {
                login(username, password, code, uuid).then(res => {
                    setToken(res.token)
                    this.token = res.token
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        getInfo() {
            return new Promise((resolve, reject) => {
                getInfo().then(res => {
                    const user = res.user
                    const avatar = {};
                    if (res.user.sex === '1') {
                        const avatar = user.avatar == "" ? defAva_girl : import.meta.env.VITE_APP_BASE_API + user.avatar;
                        this.avatar = avatar
                    } else {
                        const avatar = user.avatar == "" ? defAva : import.meta.env.VITE_APP_BASE_API + user.avatar;
                        this.avatar = avatar
                    }
                    if (res.roles && res.roles.length > 0) {
                        this.roles = res.roles
                        this.permissions = res.permissions
                    } else {
                        this.roles = ['ROLE_DEFAULT']
                    }
                    this.id = user.userId
                    this.name = user.userName
                    this.nickName = user.nickName
                    this.dept = user.dept
                    this.idcard = user.idcard
                    this.businessType = user.businessType
                    this.isAdmin = user.admin
                    this.zj = user.zj
                    Cookies.set("nickName", user.nickName)
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        logOut() {
            return new Promise((resolve, reject) => {
                logout(this.token).then(() => {
                    this.token = ''
                    this.roles = []
                    this.permissions = []
                    removeToken()
                    Cookies.remove("nickName")
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        }
    }
})

export default useUserStore