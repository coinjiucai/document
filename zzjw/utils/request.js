import axios from 'axios'
import { ElNotification, ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import useUserStore from '@/store/modules/user'
import { getToken } from '@/utils/auth'
import { tansParams, blobValidate } from '@/utils/ruoyi'
import errorCode from '@/utils/errorCode'
import { saveAs } from 'file-saver'
import request from '@/utils/request'

const route = useRoute();
const router = useRouter();
let downloadLoadingInstance;

export let isRelogin = { show: false };

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
const service = axios.create({

    baseURL: import.meta.env.VITE_APP_BASE_API,

    timeout: 20000
})
service.interceptors.request.use(config => {

    const isToken = (config.headers || {}).isToken === false
    if (getToken() && !isToken) {
        config.headers['Authorization'] = 'Bearer ' + getToken()
    }

    if (config.method === 'get' && config.params) {
        let url = config.url + '?' + tansParams(config.params);
        url = url.slice(0, -1);
        config.params = {};
        config.url = url;
    }
    return config
}, error => {
    console.log(error)
    Promise.reject(error)
})
service.interceptors.response.use(res => {

    const code = res.data.code || 200;

    const msg = errorCode[code] || res.data.msg || errorCode['default']

    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
        return res.data
    }
    if (code === 401) {
        ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
        }
        ).then(() => {
            useUserStore().logOut().then(() => {
                location.href = '/login';
            })
        }).catch(() => {
        });
        return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
    } else if (code === 500) {
        ElMessage({
            message: msg,
            type: 'error'
        })
        return Promise.reject(new Error(msg))
    } else if (code === 301) {
        ElMessage({
            message: msg,
            type: 'error'
        })
        return Promise.reject(new Error(msg))
    } else if (code >= 1000) {

        return Promise.resolve(res.data)

    } else if (code !== 200) {
        ElNotification.error({
            title: msg
        })
        return Promise.reject('error')
    } else {
        return Promise.resolve(res.data)
    }
},
    error => {
        console.log('err' + error)
        let { message } = error;
        if (message == "Network Error") {
            message = "后端接口连接异常";
        } else if (message.includes("timeout")) {
            message = "系统接口请求超时";
        } else if (message.includes("Request failed with status code")) {
            message = "系统接口" + message.substr(message.length - 3) + "异常";
        }
        ElMessage({
            message: message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export function download(url, params, filename) {
    console.log("download!!!");

    downloadLoadingInstance = ElLoading.service({ text: "正在下载数据，请稍候", background: "rgba(0, 0, 0, 0.7)", })
    return service.post(url, params, {
        transformRequest: [(params) => {
            return tansParams(params)
        }],
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        responseType: 'blob',
        timeout: 10 * 60 * 1000
    }).then(async (data) => {
        const isLogin = await blobValidate(data);
        if (isLogin) {
            const blob = new Blob([data])
            console.log("download", data)
            saveAs(blob, filename)
        } else {
            const resText = await data.text();
            const rspObj = JSON.parse(resText);
            const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
            ElMessage.error(errMsg);
        }
        downloadLoadingInstance.close();
    }).catch((r) => {
        console.error(r)
        ElMessage.error('下载文件出现错误，请联系管理员！')
        downloadLoadingInstance.close();
    })
}

export function downloadBgFile(url, params, filename) {
    console.log("downloadBgFile!!!");
    downloadLoadingInstance = ElLoading.service({ text: "正在下载数据，请稍候", background: "rgba(0, 0, 0, 0.7)", })
    return service.post(url, params, {

        headers: { 'Content-Type': 'application/json' },
        responseType: 'blob',
        timeout: 10 * 60 * 1000
    }).then(async (data) => {
        const isLogin = await blobValidate(data);
        if (isLogin) {
            const blob = new Blob([data])
            console.log("download", data)
            saveAs(blob, filename)
        } else {
            const resText = await data.text();
            const rspObj = JSON.parse(resText);
            const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
            ElMessage.error(errMsg);
        }
        downloadLoadingInstance.close();
    }).catch((r) => {
        console.error(r)
        ElMessage.error('下载文件出现错误，请联系管理员！')
        downloadLoadingInstance.close();
    })
}

export function pdfPreview(baseURL, type, path, flag, showInCurrentPage, extra) {

    let ext = path.split('.').pop().toLowerCase();
    let name = path.split('/').pop();
    let url = baseURL + "/common/preview?type=" + type + "&path=" + path;
    if (extra) {
        // 添加额外的参数
        Object.keys(extra).forEach(key => {
            url = url + '&' + key + '=' + extra[key]
        })
    }
    if (ext == 'pdf') {

        var addDivDom = window.document.getElementById('childrenUrl');
        if (addDivDom === undefined || addDivDom === null) {
            addDivDom = window.document.createElement('div');
            var bodyDom = window.document.body;

            addDivDom.setAttribute('id', 'childrenUrl');
            addDivDom.setAttribute('style', 'display: none;')
            bodyDom.insertBefore(addDivDom, bodyDom.lastChild);
        }
        if (window.opener === null) {
            window.opener = window;
        }
        if (flag === null || flag === undefined || flag === 'primary') {
            window.document.mode = 'noReview';
            let pdfUrl = '/pdf/web/viewer.html?file=' + encodeURIComponent(url);
            addDivDom.innerHTML = pdfUrl;

            if (showInCurrentPage !== null && showInCurrentPage !== undefined && showInCurrentPage === true) {
                window.open(pdfUrl);

            } else {
                window.open(pdfUrl);
            }
        } else {
            window.document.mode = 'review';
            let pdfUrl = '/pdf/web/viewer_clean.html?file=' + encodeURIComponent(url);
            addDivDom.innerHTML = pdfUrl;

            if (showInCurrentPage !== null && showInCurrentPage !== undefined && showInCurrentPage === true) {
                window.open(pdfUrl);

            } else {
                window.open(pdfUrl);
            }
        }
    } else {
        axios({
            method: 'get',
            url: url,
            responseType: 'blob',
            headers: { 'Authorization': 'Bearer ' + getToken() }
        }).then(async (res) => {
            const isLogin = await blobValidate(res.data);
            if (isLogin) {
                const blob = new Blob([res.data])
                saveAs(blob, name)
            } else {
                ElMessage.error('下载文件出现错误，请联系管理员！');
            }
        })
    }
}

export function uploadFile(uploadurl, urlParam) {
    return request({
        url: uploadurl,
        method: 'post',
        data: urlParam,
        timeout: 20 * 60 * 1000,
        headers: {
            'Content-Type': 'application/form-data'
        }
    })
}

export function downloadfile(url, params, filename) {
    downloadLoadingInstance = ElLoading.service({ text: "正在下载数据，请稍候", background: "rgba(0, 0, 0, 0.7)", })
    return service.post(url, params, {
        transformRequest: [(params) => {
            return tansParams(params)
        }],
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        responseType: 'blob',
        timeout: 10 * 60 * 1000
    }).then(async (data) => {
        const blob = new Blob([data])
        saveAs(blob, filename)

        downloadLoadingInstance.close();
    }).catch((r) => {
        console.error(r)
        ElMessage.error('下载文件出现错误，请联系管理员！')
        downloadLoadingInstance.close();
    })
}

export function downloadfileAndMsg(url, params, filename, msg) {
    downloadLoadingInstance = ElLoading.service({ text: "正在下载数据，请稍候", background: "rgba(0, 0, 0, 0.7)", })
    return service.post(url, params, {
        transformRequest: [(params) => {
            return tansParams(params)
        }],
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        responseType: 'blob',
        timeout: 20 * 60 * 1000
    }).then(async (data) => {
        const blob = new Blob([data])
        console.log("下载完成")
        console.log("blob", blob)
        if (blob.size > 0) {
            saveAs(blob, filename)
        } else {
            ElMessage.warning(msg)
        }
        downloadLoadingInstance.close();
    }).catch((r) => {
        console.error(r)
        ElMessage.error('下载文件出现错误，请联系管理员！')
        downloadLoadingInstance.close();
    })
}

export default service
