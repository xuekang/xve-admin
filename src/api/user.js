import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/Login/loginIn',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/auth/Login/getUserInfo',
    method: 'post',
    data: { token }
  })
}

export function logout() {
  return request({
    url: '/auth/Login/loginOut',
    method: 'post'
  })
}
