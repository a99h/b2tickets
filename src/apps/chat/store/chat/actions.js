import { indexChat } from '@/apps/chat/js/http/chat'
import ChatCollection from '@/apps/chat/js/models/ChatCollection'

const addOpenedChat = ({ commit }, value) => {
  commit('ADD_OPENED_CHAT', value)
}

const removeOpenedChat = ({ commit }, value) => {
  commit('REMOVE_OPENED_CHAT', value)
}

const truncateOpenedChats = ({ commit }) => {
  commit('FLUSH_OPENED_CHATS')
}

const setCurrentChat = ({ commit }, value) => {
  commit('SET_CURRENT_CHAT_INDEX', value)
}

const fetchChats = ({ dispatch }) => {
  return dispatch('main')
}

const main = ({ commit }) => {
  return indexChat().then((res) => {
    const collection = new ChatCollection({ data: res.data })

    commit('SET_CHAT_COLLECTION', collection)
    commit('FLUSH_BACKEND_ERRORS')
  }).catch((err) => {
    commit('SET_CHAT_COLLECTION', {})
    commit('SET_BACKEND_ERRORS', err)
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
