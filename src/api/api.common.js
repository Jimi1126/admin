import { uploadAlova, defaultAlova } from '@/api/alova'

export function getToken(pwd) {
  return defaultAlova.Post('user/token', { pwd }, { headers: { skipauth: true } })
}

export function addImage(formData) {
  return uploadAlova.Post('/image', formData, { shareRequest: false })
}

export function getImageNotBit(_id) {
  return uploadAlova.Post('/image/' + _id + '/notbit')
}
