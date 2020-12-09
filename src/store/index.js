import Vue from 'vue'
import Vuex from 'vuex'

// Global vuex
import AppModule from './app'
import AuthModule from './auth'
import TicketModule from './ticket'
import UserModule from './user'
import ClientModule from './client'
import TicketStatusModule from './ticket/status'
import chat from './chat'

Vue.use(Vuex)

/**
 * Main Vuex Store
 */
const store = new Vuex.Store({
  modules: {
    app: AppModule,
    auth: AuthModule,
    ticket: TicketModule,
    ticketStatus: TicketStatusModule,
    user: UserModule,
    client: ClientModule,
    chat
  }
})

export default store
