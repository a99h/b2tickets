export default function auth ({ next, store }) {
  if (!store.getters['auth/getUser']) {
    store.dispatch('auth/signInSpa').then(() => {
      if (!store.getters['auth/getUser']) {
        return next({
          name: 'auth-signin'
        })
      } else return next()
    })
  }

  return next()
}
