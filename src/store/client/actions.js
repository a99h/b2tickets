import axios from '@/plugins/axios'

const fetchClients = ({ dispatch }) => {
  return dispatch('clients')
}

const clients = ({ commit }) => {
  return axios.get(route('api.ticketsystem.chat.user.index'),{
    params: {
      role: 'client'
    }
  }).then((response) => {
    commit('SET_CLIENTS', response.data.data)
  }).catch(() => {
    commit('SET_CLIENTS', [])
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
