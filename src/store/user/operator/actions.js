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

const showOperator = ({ commit }, user) => {
  return new Promise((resolve, reject) => {
    axios.get(route('api.user.show',user.id))
      .then((res) => {
        commit('UPDATE_OPERATOR', res.data.data)
        commit('FLUSH_BACKEND_ERRORS')

        resolve(res.data)
      })
      .catch((err) => {
        commit('SET_BACKEND_ERRORS', err)

        reject(err)
      })
  })
}

const storeOperator = ({ commit }, operator) => {
  return new Promise((resolve, reject) => {
    axios.post(route('api.user.store'), operator)
      .then((res) => {
        commit('STORE_OPERATOR', [res.data.data])
        commit('FLUSH_BACKEND_ERRORS')

        resolve(res.data)
      })
      .catch((err) => {
        commit('SET_BACKEND_ERRORS', err)

        reject(err)
      })
  })
}

const updateOperator = ({ commit }, operator) => {
  operator._method = 'put'

  return new Promise((resolve, reject) => {
    axios.post(route('api.user.update', operator.id), operator)
      .then((res) => {
        commit('UPDATE_OPERATOR', res.data.data)
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
  fetchOperators,
  operators,
  storeOperator,
  updateOperator,
  showOperator
}
