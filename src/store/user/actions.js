import axios from '@/plugins/axios'

const fetchClients = ({ dispatch }) => {
  return dispatch('clients')
}
const fetchOperators = ({ dispatch }) => {
  return dispatch('operators')
}
const clients = ({ commit }) => {
  return axios.get(route('api.ticketsystem.user.index'),{
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
  return axios.get(route('api.ticketsystem.user.index'), {
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
  clients,
  operators
}
