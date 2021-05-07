export default function guest ({ next, store }) {
  if (store.getters['auth/getUser']) {
    return next({
      name: 'dashboard-analytics'
    })
  } else {
    store.dispatch('auth/signInSpa').then(() => {
      if (store.getters['auth/getUser']) {
        return next({
          name: 'dashboard-analytics'
        })
      } else return next()
    })
  }
}
