import Vue from 'vue'
import Vuex from 'vuex'

// Global vuex
import AppModule from './app'
import AuthModule from './auth'
import TicketModule from './ticket'
import ClientModule from './user/client'
import OperatorModule from './user/operator'
import TicketStatusModule from './ticket/status'
import chat from '@/apps/chat/store'

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
    client: ClientModule,
    operator: OperatorModule,
    chat
  }
})

export default store
