export default function guest ({ next, store }) {
  if (store.getters['auth/getUser']) {
    return next({
      name: 'dashboard-analytics'
    })
  }

  return next()
}
