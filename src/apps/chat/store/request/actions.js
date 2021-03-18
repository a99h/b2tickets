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

const showChatRequest = ({ commit }, id) => {
  return new Promise((resolve, reject) => {
    axios.get(route('api.ticketsystem.chat.chatrequest.show', id))
      .then((response) => resolve(response.data))
      .catch((err) => reject(err))
  })
}

export default {
  main,
  fetchChatRequests,
  showChatRequest
}
