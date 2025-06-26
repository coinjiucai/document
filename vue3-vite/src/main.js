import {createApp} from 'vue'

import Cookies from 'js-cookie'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import locale from 'element-plus/es/locale/lang/zh-cn'

import '@/assets/styles/index.scss'
import '@/assets/styles/tailwindcss.css'

import App from './App.vue'
import router from './router'
import store from './store'
import directive from './directive'
import plugins from './plugins'
import {download} from '@/utils/request'
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon'
import elementIcons from '@/components/SvgIcon/svgicon'
import 'echarts-wordcloud';
import './permission'

import {useDict} from '@/utils/dict'
import {parseTime, resetForm, addDateRange, handleTree, selectDictLabel, selectDictLabels} from '@/utils/ruoyi'
import Pagination from '@/components/Pagination'

import RightToolbar from '@/components/RightToolbar'

import FileUpload from "@/components/FileUpload"

import ImageUpload from "@/components/ImageUpload"

import ImagePreview from "@/components/ImagePreview"

import TreeSelect from '@/components/TreeSelect'

import UsualTree from '@/components/UsualTree'

import DictTag from '@/components/DictTag'
import TEditor from '@/components/TEditor';

import emitter from '@/utils/eventBus'

const app = createApp(App)
app.config.globalProperties.useDict = useDict
app.config.globalProperties.download = download
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.handleTree = handleTree
app.config.globalProperties.addDateRange = addDateRange
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.selectDictLabels = selectDictLabels
app.config.globalProperties.emitter = emitter
app.component('TEditor', TEditor)
app.component('DictTag', DictTag)
app.component('Pagination', Pagination)
app.component('TreeSelect', TreeSelect)
app.component('UsualTree', UsualTree)
app.component('FileUpload', FileUpload)
app.component('ImageUpload', ImageUpload)
app.component('ImagePreview', ImagePreview)
app.component('RightToolbar', RightToolbar)

app.use(store).use(router)
app.use(plugins)
app.use(elementIcons)
app.component('svg-icon', SvgIcon)

directive(app)
app.use(ElementPlus, {
    locale: locale,
    size: Cookies.get('size') || 'default'
})

app.mount('#app')
