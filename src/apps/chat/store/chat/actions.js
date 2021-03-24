import axios from '@/plugins/axios'

const addOpenedChat = ({ commit }, value) => {
  commit('ADD_OPENED_CHAT', value)
}

const removeOpenedChat = ({ commit }, value) => {
  commit('REMOVE_OPENED_CHAT', value)
}

const truncateOpenedChats = ({ commit }) => {
  commit('TRUNCATE_OPENED_CHATS')
}

const setCurrentChat = ({ commit }, value) => {
  commit('SET_CURRENT_CHAT_INDEX', value)
}

const fetchChats = ({ dispatch }) => {
  return dispatch('main')
}

const main = ({ commit }) => {
  return axios.get(route('api.ticketsystem.ticket.ticket.index')).then((response) => {
    commit('SET_TICKETS', response.data.data)
  }).catch(() => {
    commit('SET_TICKETS', [])
  })
}

export default {
  addOpenedChat,
  removeOpenedChat,
  truncateOpenedChats,
  setCurrentChat
}
