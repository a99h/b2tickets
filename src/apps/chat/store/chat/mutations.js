import Chat from '@/apps/chat/js/classes/Chat'

export default {
  ADD_OPENED_CHAT(state, value) {
    if (value instanceof Chat) state.openedChats.push(value)
  },
  UPDATE_OPENED_CHAT(state, value) {
    const index = state.openedChats.indexOf(value)

    if (value instanceof Chat && index > -1) state.openedChats[index] = value
  },
  REMOVE_OPENED_CHAT(state, value) {
    const index = state.openedChats.indexOf(value)

    if (value instanceof Chat && index > -1) state.openedChats.splice(index,1)
  },
  TRUNCATE_OPENED_CHATS(state) {
    state.openedChats = []
  },
  SET_CURRENT_CHAT_INDEX(state, value) {
    state.currentChatIndex = value
  },
  SET_CHATS(state, value) {
    state.chats = value
  }
}
