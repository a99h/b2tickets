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
    commit('FLUSH_BACKEND_ERRORS')
  }).catch((err) => {
    commit('SET_CLIENT_COLLECTION', {})
    commit('SET_BACKEND_ERRORS', err)
  })
}

const showClient = ({ commit }, client) => {
  return new Promise((resolve, reject) => {
    axios.get(route('api.ticketsystem.chat.user.show', client.id))
      .then((res) => {
        commit('UPDATE_CLIENT', res.data.data)
        commit('FLUSH_BACKEND_ERRORS')

        resolve(res.data)
      })
      .catch((err) => {
        commit('SET_BACKEND_ERRORS', err)

        reject(err)
      })
  })
}

export default {
  fetchClients,
  clients,
  showClient
}
