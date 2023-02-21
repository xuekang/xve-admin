import permission from './permission'
// 全局指令
const directives = {
  permission
}

// 批量注册
export default {
  install(Vue) {
    Object.keys(directives).forEach(key => {
      Vue.directive(key, directives[key])
    })
  }
}
