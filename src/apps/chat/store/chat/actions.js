const addChat = ({ commit }, value) => {
  commit('ADD_CHAT', value)
}

const removeChat = ({ commit }, value) => {
  commit('REMOVE_CHAT', value)
}

const truncateChats = ({ commit }) => {
  commit('TRUNCATE_CHATS')
}

const setCurrentChat = ({ commit }, value) => {
  commit('SET_CURRENT_CHAT_INDEX', value)
}

export default {
  addChat,
  removeChat,
  truncateChats,
  setCurrentChat
}
