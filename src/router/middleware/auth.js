export default function auth ({ next, store }) {
  if (!store.getters['auth/getUser']) {
    return next({
      name: 'auth-signin'
    })
  }

  return next()
}
