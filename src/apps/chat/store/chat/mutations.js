import OpenedChat from '@/apps/chat/js/chat-facade/OpenedChat'

export default {
  ADD_OPENED_CHAT(state, value) {
    if (value instanceof OpenedChat) state.openedChats.push(value)
  },
  UPDATE_OPENED_CHAT(state, value) {
    const index = state.openedChats.indexOf(value)

    if (value instanceof OpenedChat && index > -1) state.openedChats[index] = value
  },
  REMOVE_OPENED_CHAT(state, value) {
    const index = state.openedChats.indexOf(value)

    if (value instanceof OpenedChat && index > -1) state.openedChats.splice(index,1)
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
