import axios from '@/plugins/axios'

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
