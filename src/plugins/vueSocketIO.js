import Vue from 'vue'
import store from '@/store'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'

const options = {
  path: '/socket.io/socket.io.js'
} //Options object to pass into SocketIO

const socketInstance = new VueSocketIO({
  debug: true,
  connection: SocketIO(process.env.VUE_APP_CHAT_MANAGER_HOST, options), //options object is Optional
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  }
})

Vue.use(socketInstance)

export default socketInstance
