import axios from '@/plugins/axios'

const fetchStatuses = ({ dispatch }) => {
  return dispatch('main')
}

const main = ({ commit }) => {
  return axios.get(route('api.ticketsystem.ticket.status.index')).then((response) => {
    commit('SET_STATUSES', response.data.data)
  }).catch(() => {
    commit('SET_STATUSES', [])
  })
}

export default {
  fetchStatuses,
  main
}
