export default {
  SET_CLIENT_COLLECTION(state, value) {
    state.ClientCollection = value
  },
  SET_BACKEND_ERRORS(state, value) {
    state.backendErrors.push(value)
  },
  FLUSH_BACKEND_ERRORS(state) {
    state.backendErrors = []
  },
  UPDATE_CLIENT(state, value) {
    state.ClientCollection.update(value.id, value)
  }
}
