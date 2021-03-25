import { indexChat } from '@/apps/chat/http/chat'

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
  return indexChat().then((response) => {
    commit('SET_CHATS', response.data)
  }).catch(() => {
    commit('SET_CHATS', [])
  })
}

export default {
  addOpenedChat,
  removeOpenedChat,
  truncateOpenedChats,
  setCurrentChat,
  fetchChats,
  main
}
