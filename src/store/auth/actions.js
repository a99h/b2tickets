import axios from '@/plugins/axios'

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
    commit('SET_USER', response.data.data)
  }).catch(() => {
    commit('SET_USER', null)
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
