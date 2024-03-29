import { createAlova, useRequest } from 'alova'
import GlobalFetch from 'alova/GlobalFetch'
import VueHook from 'alova/vue'
import { axiosRequestAdapter } from '@alova/adapter-axios'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import restful from '@/api'

let opened = false

function login() {
  if (opened) return
  opened = !opened
  ElMessageBox.prompt('', '认证密钥', {
    inputType: 'password',
    confirmButtonText: '认证',
    'show-close': false,
    showCancelButton: false,
    'close-on-click-modal': false,
    'close-on-press-escape': false,
    'close-on-hash-change': false
  }).then(({ value }) => {
    const { send: getToken } = useRequest(restful.getToken, { immediate: false })
    getToken(value).then((res) => {
      localStorage.setItem('authorization', res)
      ElMessage.success('认证成功')
      window.location.reload()
    })
  })
}

function authed(method) {
  const authorization = localStorage.getItem('authorization')
  if (authorization) {
    return (method.config.headers['authorization'] = 'Bearer ' + authorization)
  }
  if (method.config.headers.skipauth) {
    return true
  }
  login()
  return false
}

// 使用数组的两个项，分别指定请求成功的拦截器和请求失败的拦截器
const responded = {
  // 请求成功的拦截器
  // 当使用GlobalFetch请求适配器时，第一个参数接收Response对象
  // 第二个参数为当前请求的method实例，你可以用它同步请求前后的配置信息
  onSuccess: async (response) => {
    if (response.status >= 400) {
      ElNotification.warning(response.statusText)
      return Promise.reject(response.statusText)
    }
    const json = await response.json()
    if (json.code) {
      // 抛出错误或返回reject状态的Promise实例时，此请求将抛出错误
      ElNotification.warning(json.message)
      return Promise.reject(json.message)
    }

    // 解析的响应数据将传给method实例的transformData钩子函数，这些函数将在后续讲解
    return json.data
  },

  // 请求失败的拦截器
  // 请求错误时将会进入该拦截器。
  // 第二个参数为当前请求的method实例，你可以用它同步请求前后的配置信息
  onError: (err) => {
    ElNotification.warning(err.message)
    return Promise.reject(err.message)
  }
}

// upload alova instance
export const uploadAlova = createAlova({
  baseURL: '/rest',
  statesHook: VueHook,
  requestAdapter: axiosRequestAdapter(),
  beforeRequest(method) {
    if (!authed(method)) {
      return Promise.reject('需要认证')
    }
    if (!method.config.headers['Content-Type']) {
      method.config.headers['Content-Type'] = 'multipart/form-data'
    }
  },
  // 使用数组的两个项，分别指定请求成功的拦截器和请求失败的拦截器
  responded: {
    // 请求成功的拦截器
    // 当使用GlobalFetch请求适配器时，第一个参数接收Response对象
    // 第二个参数为当前请求的method实例，你可以用它同步请求前后的配置信息
    onSuccess: async (response) => {
      if (response.status >= 400) {
        ElNotification.warning(response.statusText)
        return Promise.reject(response.statusText)
      }
      const json = response.data
      if (json.code) {
        // 抛出错误或返回reject状态的Promise实例时，此请求将抛出错误
        ElNotification.warning(json.message)
        return Promise.reject(json.message)
      }
      // 解析的响应数据将传给method实例的transformData钩子函数，这些函数将在后续讲解
      return json.data
    },
    // 请求失败的拦截器
    // 请求错误时将会进入该拦截器。
    // 第二个参数为当前请求的method实例，你可以用它同步请求前后的配置信息
    onError: (err) => {
      ElNotification.warning(err.message)
      return Promise.reject(err.message)
    }
  }
})

export const defaultAlova = createAlova({
  // 假设我们需要与这个域名的服务器交互
  baseURL: '/rest',
  // 在vue项目下引入VueHook，它可以帮我们用vue的ref函数创建请求相关的，可以被alova管理的状态
  statesHook: VueHook,
  // 请求适配器，这里我们使用fetch请求适配器
  requestAdapter: GlobalFetch(),
  // 设置全局的请求拦截器，与axios相似
  beforeRequest(method) {
    if (!authed(method)) {
      return Promise.reject('需要认证')
    }
    if (!method.config.headers['Content-Type']) {
      if (typeof method.config.data == 'string') {
        method.config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      } else {
        method.config.headers['Content-Type'] = 'application/json;charset=UTF-8'
      }
    }
  },
  responded,
  // 缓存时间
  localCache: -1,
  // 请求超时时间，单位为毫秒，默认为0，表示永不超时
  timeout: 50000
})
