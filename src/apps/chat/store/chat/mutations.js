import OpenedChat from '@/apps/chat/js/facade/OpenedChat'

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
  FLUSH_OPENED_CHATS(state) {
    state.openedChats = []
  },
  SET_CURRENT_CHAT_INDEX(state, value) {
    state.currentChatIndex = value
  },
  SET_CHAT_COLLECTION(state, value) {
    state.ChatCollection = value
  },
  SET_BACKEND_ERRORS(state, value) {
    if (state.backendErrors === null) state.backendErrors = []

    state.backendErrors.push(value)
  },
  FLUSH_BACKEND_ERRORS(state) {
    state.backendErrors = null
  }
}
