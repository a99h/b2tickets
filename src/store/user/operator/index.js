import actions from './actions'
import mutations from './mutations'
import OperatorCollection from '@/js/models/OperatorCollection'

// state initial values
const state = {
  OperatorCollection: new OperatorCollection(),
  backendErrors: []
}

const getters = {
  getOperators(state) {
    return state.OperatorCollection.all()
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
