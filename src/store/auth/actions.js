import axios from '@/plugins/axios'
import Operator from '@/js/models/Operator'
import UserSettings from '@/js/models/UserSettings'

const signIn = async ({ dispatch }, credentials) => {
  await axios.get(process.env.VUE_APP_API_BASE_URL + '/sanctum/csrf-cookie')
    .then( async () => {
      await axios.post(route('login'), credentials).then(async() => {
        await dispatch('main')
      })
    })
}

const signOut = async ({ dispatch }) => {
  await axios.post(route('logout')).then(async() => {
    await dispatch('main')
  })
}

const signInSpa = ({ dispatch }) => {
  return dispatch('main')
}

const main = async ({ commit } ) => {
  await axios.get(route('api.user.whoami')).then((response) => {
    const data = Object.assign({}, response.data.data)
    const userSettings = new UserSettings({ data: data.userSettings })

    Object.keys(data)
      .filter((key) => key === 'userSettings')
      .forEach((key) => delete data[key])
    const user = new Operator({ data: data })

    commit('SET_USER', user)
    commit('SET_USER_SETTINGS', userSettings)
    commit('FLUSH_BACKEND_ERRORS')
  }).catch((err) => {
    commit('SET_USER', null)
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

export default {
  signIn,
  signInSpa,
  signOut,
  showSettings,
  updateSettings,
  main
}
