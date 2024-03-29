import { defaultAlova } from './alova'
import qs from 'qs'
import * as commonApi from './api.common.js'

const models = ['catalog', 'post', 'essay', 'tag', 'image']

const restful = {}

models.forEach((model) => {
  const upFristChatModelName = model.slice(0, 1).toUpperCase() + model.slice(1)
  restful[`get${upFristChatModelName}`] = (_id) => defaultAlova.Get(`/${model}/${_id}`)
  restful[`get${upFristChatModelName}s`] = (params) =>
    defaultAlova.Get(`/${model}?${qs.stringify(params)}`)
  restful[`update${upFristChatModelName}`] = (data) =>
    defaultAlova.Put(`/${model}/${data._id}`, data)
  restful[`add${upFristChatModelName}`] = (data) => defaultAlova.Post(`/${model}`, data)
  restful[`del${upFristChatModelName}`] = (_id) => defaultAlova.Delete(`/${model}/${_id}`)
})

Object.keys(commonApi).forEach((method) => (restful[method] = commonApi[method]))

export default restful
