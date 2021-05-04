import actions from './actions'
import mutations from './mutations'

// state initial values
const state = {
  clientCollection: {}
}

const getters = {
  getClients(state) {
    return state.clientCollection.all()
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
