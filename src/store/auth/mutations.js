export default {
  SET_USER(state, value) {
    state.User = value
  },
  SET_USER_SETTINGS(state, value) {
    state.UserSettings = value
  },
  SET_BACKEND_ERRORS(state, value) {
    state.backendErrors.push(value)
  },
  FLUSH_BACKEND_ERRORS(state) {
    state.backendErrors = []
  }
}
