import actions from './actions'
import mutations from './mutations'

// state initial values
const state = {
  User: null,
  UserSettings: null,
  backendErrors: []
}

const getters = {
  getUser(state) {
    return state.User ? state.User.show() : state.User
  },
  getUserSettings(state) {
    return state.UserSettings.show()
  },
  getBackendErrors(state) {
    return state.backendErrors
  },
  userCan: (state) => (permissionName) => {
    return state.User.show().userRoles.some((role) => {
      return role.hasPermissions.some((permission) => permission.name === permissionName)
    })
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
