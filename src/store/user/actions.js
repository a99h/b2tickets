import axios from '@/plugins/axios'

const fetchClients = ({ dispatch }) => {
  return dispatch('clients')
}
const fetchOperators = ({ dispatch }) => {
  return dispatch('operators')
}

const showSettings = ({ commit }, id) => {
  return new Promise((resolve, reject) => {
    axios.get(route('api.user.settings.show',id))
      .then((response) => resolve(response.data))
      .catch((err) => reject(err))
  })
}
const updateSettings = ({ commit }, settings) => {
  settings._method = 'put'

  return new Promise((resolve, reject) => {
    axios.post(route('api.user.settings.update',settings.id), settings)
      .then((response) => resolve(response.data))
      .catch((err) => reject(err))
  })
}
const clients = ({ commit }) => {
  return axios.get(route('api.user.index'),{
    params: {
      role: 'client'
    }
  }).then((response) => {
    commit('SET_CLIENTS', response.data.data)
  }).catch(() => {
    commit('SET_CLIENTS', [])
  })
}
const operators = ({ commit }) => {
  return axios.get(route('api.user.index'), {
    params: {
      role: 'operator'
    }
  }).then((response) => {
    commit('SET_OPERATORS', response.data.data)
  }).catch(() => {
    commit('SET_OPERATORS', [])
  })
}

export default {
  fetchClients,
  fetchOperators,
  showSettings,
  updateSettings,
  clients,
  operators
}
