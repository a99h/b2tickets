import axios from '@/plugins/axios'

const updateChat = (chat) => {
  chat._method = 'put'

  return new Promise((resolve, reject) => {
    axios.post(route('api.ticketsystem.chat.chat.update',chat.id), chat)
      .then((response) => resolve(response.data))
      .catch((err) => reject(err))
  })
}

const showChat = (id) => {
  return new Promise((resolve, reject) => {
    axios.get(route('api.ticketsystem.chat.chat.show', id))
      .then((response) => resolve(response.data))
      .catch((err) => reject(err))
  })
}

export {
  updateChat,
  showChat
}