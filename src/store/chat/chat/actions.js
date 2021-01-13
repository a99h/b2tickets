import axios from '@/plugins/axios'

const fetchChats = ({ dispatch }) => {
  return dispatch('main')
}

const storeChattingUsers = ({ dispatch }, value) => {
  return dispatch('setChattingUsers', value)
}

const main = ({ commit }) => {
  return new Promise((resolve, reject) => {
    axios.get(route('api.ticketsystem.chat.chat.index'))
      .then((response) => resolve(response.data))
      .catch((err) => reject(err))
  })
}

const showChat = ({ commit }, id) => {
  return new Promise((resolve, reject) => {
    axios.get(route('api.ticketsystem.chat.chat.show', id))
      .then((response) => resolve(response.data))
      .catch((err) => reject(err))
  })
}

const updateChat = ({ commit }, chat) => {
  chat._method = 'put'

  return new Promise((resolve, reject) => {
    axios.post(route('api.ticketsystem.chat.chat.update',chat.id), chat)
      .then((response) => resolve(response.data))
      .catch((err) => reject(err))
  })
}

const setChattingUsers = ({ commit }, value) => {
  commit('SET_CHATTING_USERS', value)
}

export default {
  main,
  fetchChats,
  showChat,
  updateChat,
  setChattingUsers,
  storeChattingUsers
}
