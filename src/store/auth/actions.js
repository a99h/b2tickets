import axios from '@/plugins/axios'

const signIn = async ({ dispatch }, credentials) => {
  await axios.get(process.env.VUE_APP_API_BASE_URL + '/sanctum/csrf-cookie')
    .then( async () => {
      await axios.post(process.env.VUE_APP_API_BASE_URL + route('login'), credentials).then(async() => {
        await dispatch('main')
      })
    })
}

const signOut = async ({ dispatch }) => {
  await axios.post(process.env.VUE_APP_API_BASE_URL + route('logout')).then(async() => {
    await dispatch('main')
  })
}

const signInSpa = ({ dispatch }) => {
  return dispatch('main')
}

const main = async ({ commit } ) => {
  await axios.get(process.env.VUE_APP_API_URL + route('api.user.whoami')).then((response) => {
    commit('SET_USER', response.data)
  }).catch(() => {
    commit('SET_USER', null)
  })
}

export default {
  signIn,
  signInSpa,
  signOut,
  main
}
