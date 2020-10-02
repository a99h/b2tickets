import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import axios from '@/plugins/axios'

export default new Echo({
  broadcaster: 'pusher',
  key: 'websocketkey',
  forceTLS: false,
  wsHost: '127.0.0.1',
  wsPort: 6001,
  disableStats: true,
  encrypted: true,
  authorizer: (channel, options) => {
    return {
      authorize: (socketId, callback) => {
        axios.post('http://localhost/broadcasting/auth', {
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
