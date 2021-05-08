export default {
  SET_OPERATOR_COLLECTION(state, value) {
    state.OperatorCollection = value
  },
  STORE_OPERATOR(state, value) {
    state.OperatorCollection.record(value)
  },
  UPDATE_OPERATOR(state, value) {
    state.OperatorCollection.update(value.id, value)
  },
  SET_BACKEND_ERRORS(state, value) {
    state.backendErrors.push(value)
  },
  FLUSH_BACKEND_ERRORS(state) {
    state.backendErrors = []
  }
}
