export default function guest ({ next, store }) {
  if (store.getters['auth/getUser']) {
    return next({
      name: 'apps-chat-chats'
    })
  } else {
    store.dispatch('auth/signInSpa').then(() => {
      if (store.getters['auth/getUser']) {
        return next({
          name: 'apps-chat-chats'
        })
      } else return next()
    })
  }
}
