export default {
  SET_OPERATOR_COLLECTION(state, value) {
    state.OperatorCollection = value
  },
  SET_BACKEND_ERRORS(state, value) {
    state.backendErrors.push(value)
  },
  FLUSH_BACKEND_ERRORS(state) {
    state.backendErrors = []
  }
}
