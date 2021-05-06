import actions from './actions'
import mutations from './mutations'

// state initial values
const state = {
  TicketCollection: {},
  backendErrors: []
}

const getters = {
  getTickets(state) {
    return state.TicketCollection.all()
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
