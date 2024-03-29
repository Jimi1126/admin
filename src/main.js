import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import router from '@/router'

import 'element-plus/theme-chalk/dark/css-vars.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
import 'element-plus/theme-chalk/el-loading.css'
import 'element-plus/theme-chalk/el-notification.css'

import VueMarkdownEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'

import createMermaidPlugin from '@kangc/v-md-editor/lib/plugins/mermaid/cdn'
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index'
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index'
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css'
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index'
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css'
import createTipPlugin from '@kangc/v-md-editor/lib/plugins/tip/index'
import '@kangc/v-md-editor/lib/plugins/tip/tip.css'
// Prism
import Prism from 'prismjs'
// highlight code
import 'prismjs/components/prism-json'

VueMarkdownEditor.use(vuepressTheme, {
  Prism
})
// markdown支持流程图
VueMarkdownEditor.use(createMermaidPlugin())
// markdown支持显示代码行数
VueMarkdownEditor.use(createLineNumbertPlugin())
// markdown支持代码快速复制
VueMarkdownEditor.use(createCopyCodePlugin())
// markdown支持emoji
VueMarkdownEditor.use(createEmojiPlugin())
// markdown支持插入提示信息
VueMarkdownEditor.use(createTipPlugin())

const app = createApp(App)

app.use(createPinia())
app.use(router)
// 引入v-md-editor预览组件
app.use(VueMarkdownEditor)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
