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

export default {
  main,
  fetchChatRequests
}
