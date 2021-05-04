import axios from '@/plugins/axios'
import ClientCollection from '@/js/models/ClientCollection'

const fetchClients = ({ dispatch }) => {
  return dispatch('clients')
}

const clients = ({ commit }) => {
  return axios.get(route('api.ticketsystem.chat.user.index'),{
    params: {
      role: 'client'
    }
  }).then((response) => {
    const collection = new ClientCollection({ data: response.data.data })

    commit('SET_CLIENT_COLLECTION', collection)
  }).catch(() => {
    commit('SET_CLIENT_COLLECTION', [])
  })
}

const showClient = ({ commit }, user) => {
  return new Promise((resolve, reject) => {
    axios.get(route('api.ticketsystem.chat.user.show',user.id))
      .then((response) => resolve(response.data))
      .catch((err) => reject(err))
  })
}

export default {
  fetchClients,
  clients,
  showClient
}
