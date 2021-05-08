export default {
  SET_OPERATOR_COLLECTION(state, value) {
    state.OperatorCollection = value
  },
  SET_BACKEND_ERRORS(state, value) {
    state.backendErrors.push(value)
  },
  FLUSH_BACKEND_ERRORS(state) {
    state.backendErrors = []
  },
  UPDATE_OPERATOR(state, value) {
    state.OperatorCollection.update(value.id, value)
  }
}
