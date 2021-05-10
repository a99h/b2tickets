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
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
