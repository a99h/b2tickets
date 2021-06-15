import actions from './actions'
import mutations from './mutations'
import ChatRequestCollection from '@/apps/chat/js/models/ChatRequestCollection'

// state initial values
const state = {
  ChatRequestCollection: new ChatRequestCollection()
}

const getters = {
  getChatRequests(state) {
    return state.ChatRequestCollection.all()
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
