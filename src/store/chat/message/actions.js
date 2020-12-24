import axios from '@/plugins/axios'

const fetchMessages = ({ dispatch }, chatRequest) => {
  return dispatch('main', chatRequest)
}

const main = ({ commit }, chatRequest) => {
  return new Promise((resolve, reject) => {
    axios.get(route('api.ticketsystem.chat.message.index', chatRequest))
      .then((response) => resolve(response.data))
      .catch((err) => reject(err))
  })
}

const storeMessage = ({ commit }, message) => {
  return new Promise((resolve, reject) => {
    axios.post(route('api.ticketsystem.chat.message.store'), message)
      .then((response) => resolve(response.data))
      .catch((err) => reject(err))
  })
}

export default {
  main,
  fetchMessages,
  storeMessage
}
