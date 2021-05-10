import axios from '@/plugins/axios'
import ChatRequestCollection from '@/apps/chat/js/models/ChatRequestCollection'

const fetchChatRequests = ({ dispatch }) => {
  return dispatch('main')
}

const main = ({ commit }) => {
  return axios.get(route('api.ticketsystem.chat.chatrequest.index')).then((response) => {
    const collection = new ChatRequestCollection({ data: response.data.data })

    commit('SET_CHAT_REQUEST_COLLECTION', collection)
  }).catch(() => {
    commit('SET_CHAT_REQUEST_COLLECTION', null)
  })
}

export default {
  main,
  fetchChatRequests
}
