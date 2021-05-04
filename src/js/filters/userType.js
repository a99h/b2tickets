import Vue from 'vue'
import store from '@/store'

Vue.filter('userType', (value) => {
  const { clients, operators } = store.state.user

  switch (value) {
  case 'clients': return clients
  case 'operators': return operators
  case null: return operators
  }
})
