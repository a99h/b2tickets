import Chat from '@/apps/chat/classes/Chat'

export default {
  ADD_CHAT(state, value) {
    if (value instanceof Chat) state.chats.push(value)
  },
  UPDATE_CHAT(state, value) {
    const index = state.chats.indexOf(value)

    if (value instanceof Chat && index > -1) state.chats[index] = value
  },
  REMOVE_CHAT(state, value) {
    const index = state.chats.indexOf(value)

    if (value instanceof Chat && index > -1) state.chats.splice(index,1)
  },
  TRUNCATE_CHATS(state) {
    state.chats = []
  },
  SET_CURRENT_CHAT_INDEX(state, value) {
    state.currentChatIndex = value
  }
}
