import actions from './actions'
import mutations from './mutations'

// state initial values
const state = {
  tickets: []
}

const getters = {
  getTickets(state) {
    return state.tickets
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
