import tab from './tab'
import auth from './auth'
import modal from './modal'
import download from './download'

export default function installPlugins(app) {

    app.config.globalProperties.$tab = tab

    app.config.globalProperties.$auth = auth

    app.config.globalProperties.$modal = modal

    app.config.globalProperties.$download = download
}
