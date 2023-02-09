import axios from 'axios'
import { MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { showErr } from '@/utils/common-tool'
// var JSONbig = require('json-bigint')
// var JSONbigString = require('json-bigint')({ storeAsString: true })
// var JSONbigNative = require('json-bigint')({ useNativeBigInt: true });

// data 是服务器响应回来的，待处理的数据
// const transBigInt = response => {
//   try {
//     // 尝试进行大数处理
//     // 优选方案
//     // console.log(JSONbigString.parse(response))
//     return JSONbigString.parse(response)
//   } catch {
//     // 大数处理失败，单纯的进行 JSON -> 对象的转换
//     // 兜底的方案
//     return JSON.parse(response)
//   }
// }

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // transformResponse: [transBigInt], // 对服务器响应回来的数据，进行预处理
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['token'] = getToken()
    }
    config.headers['appdebug'] = 0
    return config
  },
  error => {
    // do something with request error
    console.log('error1', error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 0) {
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 10001) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } else {
        showErr(res.message)
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('error2', error) // for debug
    showErr(error.message)
    return Promise.reject(error)
  }
)

export default service
