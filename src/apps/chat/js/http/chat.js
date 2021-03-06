import axios from '@/plugins/axios'

const indexChat = () => {
  return new Promise((resolve, reject) => {
    axios.get(route('api.ticketsystem.chat.chat.index'))
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

const updateChat = (chat) => {
  return new Promise((resolve, reject) => {
    axios.post(route('api.ticketsystem.chat.chat.update', chat.id), { ...chat, _method: 'put' })
      .then((response) => resolve(response.data))
      .catch((err) => reject(err))
  })
}

export {
  indexChat,
  updateChat,
  showChat
}