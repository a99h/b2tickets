import actions from './actions'
import mutations from './mutations'
import TicketCollection from '@/js/models/TicketCollection'

// state initial values
const state = {
  TicketCollection: new TicketCollection(),
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
