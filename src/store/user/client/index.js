import actions from './actions'
import mutations from './mutations'
import ClientCollection from '@/js/models/ClientCollection'

// state initial values
const state = {
  ClientCollection: new ClientCollection(),
  backendErrors: []
}

const getters = {
  getClients(state) {
    return state.ClientCollection.all()
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
