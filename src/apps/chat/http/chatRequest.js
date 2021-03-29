import axios from '@/plugins/axios'

const indexChatRequest = () => {
  return new Promise((resolve, reject) => {
    axios.get(route('api.ticketsystem.chat.chatrequest.index'))
      .then((response) => resolve(response.data))
      .catch((err) => reject(err))
  })
}

const showChatRequest = (id) => {
  return new Promise((resolve, reject) => {
    axios.get(route('api.ticketsystem.chat.chatrequest.show', id))
      .then((response) => resolve(response.data))
      .catch((err) => reject(err))
  })
}

const updateChatRequest = (chatRequest) => {
  chatRequest._method = 'put'

  return new Promise((resolve, reject) => {
    axios.post(route('api.ticketsystem.chat.chatrequest.update',chatRequest.id), chatRequest)
      .then((response) => resolve(response.data))
      .catch((err) => reject(err))
  })
}

export {
  indexChatRequest,
  updateChatRequest,
  showChatRequest
}