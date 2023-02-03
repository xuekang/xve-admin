import { Message } from 'element-ui'

/**
 * @param {string} err_msg
 */
export function showErr(err_msg) {
  Message({
    message: err_msg || 'Error',
    type: 'error',
    showClose: true,
    duration: 3 * 1000
  })
}

