import axios from '@/plugins/axios'

const getMessages = (chatRequestId) => {
  return new Promise((resolve, reject) => {
    axios.get(route('api.ticketsystem.chat.message.index', chatRequestId))
      .then((response) => resolve(response.data))
      .catch((err) => reject(err))
  })
}

const storeMessage = (message) => {
  return new Promise((resolve, reject) => {
    axios.post(route('api.ticketsystem.chat.message.store'), message)
      .then((response) => resolve(response.data))
      .catch((err) => reject(err))
  })
}

export {
  getMessages,
  storeMessage
}