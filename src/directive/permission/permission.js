import store from '@/store'

function checkPermission(el, binding) {
  const { value } = binding
  const auth = store.getters && store.getters.auth

  if (auth && auth.button !== null) {
    const hasPermission = auth.button.length > 0 && auth.button.includes(value)

    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}

// function checkPermission(el, binding) {
//   const { value } = binding
//   const roles = store.getters && store.getters.roles

//   if (value && value instanceof Array) {
//     if (value.length > 0) {
//       const permissionRoles = value

//       const hasPermission = roles.some(role => {
//         return permissionRoles.includes(role)
//       })

//       if (!hasPermission) {
//         el.parentNode && el.parentNode.removeChild(el)
//       }
//     }
//   } else {
//     throw new Error(`need roles! Like v-permission="['admin','editor']"`)
//   }
// }

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}
