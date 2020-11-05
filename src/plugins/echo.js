import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import axios from '@/plugins/axios'

export default new Echo({
  broadcaster: 'pusher',
  namespace: process.env.VUE_APP_WS_EVENT_NAMESPACE,
  key: process.env.VUE_APP_WS_KEY,
  forceTLS: process.env.VUE_APP_WS_TLS !== 'false',
  wsHost: process.env.VUE_APP_WS_HOST,
  wsPort: process.env.VUE_APP_WS_PORT,
  wssPort: process.env.VUE_APP_WS_PORT,
  disableStats: true,
  encrypted: true,
  authorizer: (channel, options) => {
    return {
      authorize: (socketId, callback) => {
        axios.post(process.env.VUE_APP_API_BASE_URL + '/broadcasting/auth', {
          socket_id: socketId,
          channel_name: channel.name
        })
          .then((response) => {
            callback(false, response.data)
          })
          .catch((error) => {
            callback(true, error)
          })
      }
    }
  }
})
