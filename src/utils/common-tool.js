import { Message } from 'element-ui'

/**
 * @param {string} msg
 */
export function showErr(msg) {
  Message({
    message: msg || '错误',
    type: 'error',
    showClose: true,
    duration: 3 * 1000
  })
}

/**
 * @param {string} msg
 */
export function showInfo(msg) {
  Message({
    message: msg || '提示信息',
    type: '',
    showClose: true,
    duration: 1 * 1000
  })
}
