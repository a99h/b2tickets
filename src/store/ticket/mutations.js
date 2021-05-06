export default {
  SET_TICKET_COLLECTION(state, value) {
    state.TicketCollection = value
  },
  UPDATE_TICKET(state, value) {
    state.TicketCollection.update(value.id, value)
  },
  SET_BACKEND_ERRORS(state, value) {
    state.backendErrors.push(value)
  },
  FLUSH_BACKEND_ERRORS(state) {
    state.backendErrors = []
  }
}
