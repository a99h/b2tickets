export default {
  SET_TICKET_COLLECTION(state, value) {
    state.TicketCollection = value
  },
  STORE_TICKET(state, value) {
    state.TicketCollection.record(value, true)
  },
  UPDATE_TICKET(state, value) {
    state.TicketCollection.update(value.id, value)
  },
  DELETE_TICKET(state, id) {
    state.TicketCollection.delete(id)
  },
  SET_BACKEND_ERRORS(state, value) {
    if (state.backendErrors === null) state.backendErrors = []

    state.backendErrors.push(value)
  },
  FLUSH_BACKEND_ERRORS(state) {
    state.backendErrors = null
  }
}
