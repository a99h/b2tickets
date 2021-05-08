import actions from './actions'
import mutations from './mutations'

// state initial values
const state = {
  OperatorCollection: {}
}

const getters = {
  getOperators(state) {
    return state.OperatorCollection.all()
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
