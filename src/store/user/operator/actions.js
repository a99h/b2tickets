import axios from '@/plugins/axios'
import OperatorCollection from '@/js/models/OperatorCollection'

const fetchOperators = ({ dispatch }) => {
  return dispatch('operators')
}

const operators = ({ commit }) => {
  return axios.get(route('api.user.index'), {
    params: {
      role: 'operator'
    }
  }).then((res) => {
    const collection = new OperatorCollection({ data: res.data.data })

    commit('SET_OPERATOR_COLLECTION', collection)
    commit('FLUSH_BACKEND_ERRORS')
  }).catch((err) => {
    commit('SET_OPERATOR_COLLECTION', {})
    commit('SET_BACKEND_ERRORS', err)
  })
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

const storeUser = ({ commit }, user) => {
  return new Promise((resolve, reject) => {
    axios.post(route('api.user.store'), user)
      .then((response) => resolve(response.data))
      .catch((err) => reject(err))
  })
}
const updateUser = ({ commit }, user) => {
  user._method = 'put'

  return new Promise((resolve, reject) => {
    axios.post(route('api.user.update',user.id), user)
      .then((response) => resolve(response.data))
      .catch((err) => reject(err))
  })
}
const showUser = ({ commit }, user) => {
  return new Promise((resolve, reject) => {
    axios.get(route('api.user.show',user.id))
      .then((response) => resolve(response.data))
      .catch((err) => reject(err))
  })
}

export default {
  fetchOperators,
  showSettings,
  updateSettings,
  operators,
  storeUser,
  updateUser,
  showUser
}
