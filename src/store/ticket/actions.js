import axios from '@/plugins/axios'
import TicketCollection from '@/js/models/TicketCollection'

const fetchTickets = ({ dispatch }) => {
  return dispatch('main')
}

const main = ({ commit }) => {
  return axios.get(route('api.ticketsystem.ticket.ticket.index')).then((response) => {
    const collection = new TicketCollection({ data: response.data.data })

    commit('SET_TICKET_COLLECTION', collection)
  }).catch((err) => {
    commit('SET_TICKET_COLLECTION', [])
    commit('SET_BACKEND_ERRORS', err)
  })
}
const storeTicket = ({ commit }, ticket) => {
  return new Promise((resolve, reject) => {
    axios.post(route('api.ticketsystem.ticket.ticket.store'), ticket)
      .then((res) => {
        commit('STORE_TICKET', [res.data.data])
        commit('FLUSH_BACKEND_ERRORS')

        resolve(res.data)
      })
      .catch((err) => {
        commit('SET_BACKEND_ERRORS', err)

        reject(err)
      })
  })
}
const updateTicket = ({ commit }, ticket) => {
  ticket._method = 'put'

  return new Promise((resolve, reject) => {
    axios.post(route('api.ticketsystem.ticket.ticket.update',ticket.id), ticket)
      .then((res) => {
        commit('UPDATE_TICKET', res.data.data)
        commit('FLUSH_BACKEND_ERRORS')

        resolve(res.data)
      })
      .catch((err) => {
        commit('SET_BACKEND_ERRORS', err)

        reject(err)
      })
  })
}
const showTicket = ({ commit }, ticket) => {
  return new Promise((resolve, reject) => {
    axios.get(route('api.ticketsystem.ticket.ticket.show',ticket.id))
      .then((res) => {
        commit('UPDATE_TICKET', res.data.data)
        commit('FLUSH_BACKEND_ERRORS')

        resolve(res.data)
      })
      .catch((err) => {
        commit('SET_BACKEND_ERRORS', err)

        reject(err)
      })
  })
}
const deleteTicket = ({ commit }, ticket) => {
  axios.post(route('api.ticketsystem.ticket.ticket.delete', ticket.id), { _method: 'delete' })
    .then(() => {
      commit('DELETE_TICKET', ticket.id)
      commit('FLUSH_BACKEND_ERRORS')
    })
    .catch((err) => {
      commit('SET_BACKEND_ERRORS', err)
    })
}

export default {
  fetchTickets,
  main,
  storeTicket,
  updateTicket,
  showTicket,
  deleteTicket
}
