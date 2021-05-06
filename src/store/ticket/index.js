import actions from './actions'
import mutations from './mutations'

// state initial values
const state = {
  TicketCollection: {},
  backendErrors: null
}

const getters = {
  getTickets(state) {
    return state.TicketCollection.all()
  },
  getBackendErrors(state) {
    return state.backendErrors
  },
  findTicketById: (state) => (id) => {
    return state.TicketCollection.find(id)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
