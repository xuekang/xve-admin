import {
  localRoutes,
  constantRoutes,
  loadView,
  commonComponent
} from '@/router'
/**
 * Use meta.role to determine if the current user has permission
 *
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

/**
 * format asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function formatAsyncRoutes(accessedRoutes) {
  const res = []
  // console.log('formatAsyncRoutes --------------------', res)
  accessedRoutes.forEach(route => {
    const tmp = { ...route }
    // console.log('formatAsyncRoutes tmp.component', tmp.component)
    if (tmp.component) {
      tmp.component = commonComponent[tmp.component]
    } else if (tmp.path) {
      tmp.component = loadView(tmp.path)
      // tmp.component = localRoutes[tmp.name]
    }
    if (tmp.children) {
      tmp.children = formatAsyncRoutes(tmp.children)
    }
    res.push(tmp)
  })
  // console.log('000000000000001111', res)

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, asyncRoutes) {
    return new Promise(resolve => {
      const accessedRoutes = formatAsyncRoutes(asyncRoutes)
      accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
      // console.log('accessedRoutes', accessedRoutes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
