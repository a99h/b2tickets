import actions from './actions'
import mutations from './mutations'

// state initial values
const state = {
  ClientCollection: {}
}

const getters = {
  getClients(state) {
    return state.ClientCollection.all()
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
