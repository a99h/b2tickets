import axios from '@/plugins/axios'

const fetchChatRequests = ({ dispatch }) => {
  return dispatch('main')
}

const main = ({ commit }) => {
  return axios.get(route('api.ticketsystem.chat.chatrequest.index')).then((response) => {
    commit('SET_CHAT_REQUESTS', response.data.data)
  }).catch(() => {
    commit('SET_CHAT_REQUESTS', [])
  })
}
const listTicket = ({ commit }) => {
  return new Promise((resolve, reject) => {
    axios.get(route('api.ticketsystem.ticket.ticket.index'))
      .then((response) => resolve(response.data))
      .catch((err) => reject(err))
  })
}
const storeTicket = ({ commit }, ticket) => {
  return new Promise((resolve, reject) => {
    axios.post(route('api.ticketsystem.ticket.ticket.store'), ticket)
      .then((response) => resolve(response.data))
      .catch((err) => reject(err))
  })
}
const updateTicket = ({ commit }, ticket) => {
  ticket._method = 'put'

  return new Promise((resolve, reject) => {
    axios.post(route('api.ticketsystem.ticket.ticket.update',ticket.id), ticket)
      .then((response) => resolve(response.data))
      .catch((err) => reject(err))
  })
}
const showTicket = ({ commit }, ticket) => {
  return new Promise((resolve, reject) => {
    axios.get(route('api.ticketsystem.ticket.ticket.show',ticket.id))
      .then((response) => resolve(response.data))
      .catch((err) => reject(err))
  })
}
const deleteTicket = ({ commit }, ticket) => {
  axios.post(route('api.ticketsystem.ticket.ticket.delete',ticket.id), { _method: 'delete' })
}

export default {
  main,
  fetchChatRequests
}
