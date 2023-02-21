import request from '@/utils/request'

export function getTableConf(auth_id) {
  return request({
    url: '/elem/Index/getTableConf',
    method: 'post',
    data: { auth_id }
  })
}

export function getFormConf() {
  return request({
    url: '/elem/Index/getFormConf',
    method: 'post'
  })
}

export function getFormData(getFormDataUrl, data) {
  return request({
    url: getFormDataUrl,
    method: 'post',
    data
  })
}
