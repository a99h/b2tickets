<template>
  <v-dialog
    v-model="chatRequestAlert"
    persistent
    width="50vw"
    transition="scale-transition"
  >
    <div v-for="alert in chatRequestAlerts" :key="alert.chatRequest.id">
      <v-card class="darken-2">
        <!-- ChatRequestAlert -->
        <v-alert
          :v-model="alert.active"
          outlined
        >
          <template v-slot:prepend="">
            <div class="d-block pr-2">
              <v-btn :key="alert.chatRequest.id" style="cursor: pointer" @click="acceptChatRequest(alert.chatRequest.id)">
                <span class="title success--text">Accept</span>
                <v-icon x-large color="success">mdi-chat-alert</v-icon>
              </v-btn>
              <v-spacer
                class="my-5"
              ></v-spacer>
              <v-btn style="cursor: pointer" @click="stopTimer(alert.chatRequest.id)">
                <span class="title error--text">Decline</span>
                <v-icon x-large color="error">mdi-close-circle</v-icon>
              </v-btn>
            </div>
          </template>

          <div class="headline mb-4 text-center primary--text text--darken-4">
            New chat request!
          </div>
          <div><span class="font-weight-bold">Email: </span>{{ alert.chatRequest.user.email || '' }}</div>
          <div><span class="font-weight-bold">Chat request Id: </span>{{ alert.chatRequest.id || '' }}</div>

          <v-divider
            class="my-4 info"
            style="opacity: 0.22"
          ></v-divider>

          <div>
            <span class="font-weight-bold">Chat request message: </span>
            {{ alert.chatRequest.message || '' }}
          </div>

          <template v-slot:append="">
            <v-avatar>
              <div class="primary--text font-weight-light display-1 text-uppercase justify-center">
                {{ alert.timeout }}
              </div>
            </v-avatar>
          </template>

        </v-alert>
      </v-card>
    </div>
  </v-dialog>
</template>

<script>
import { showChatRequest } from '@/apps/chat/js/http/chatRequest'
import { mapGetters } from 'vuex'

export default {
  name: 'ChatRequestAlert',
  data() {
    return {
      chatRequestAlerts: [

      ],
      chatRequestAlert: false,
      timeout: 30,
      timer: null,
      chatRequest: {}
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/getUser'
    })
  },
  sockets: {
    operatorSuggested: function (data) {
      if (data.operatorId !== this.user.id) return

      showChatRequest(data.chatRequestId).then((res) => {
        console.log(res.data)
        this.chatRequestAlerts.push({
          active: true,
          timeout: data.operatorTimeout,
          timer: null,
          chatRequest: res.data,
          loading: false
        })

        this.startTimer(res.data.id)
        this.chatRequestAlert = true

        // delete this
        // if (data.operatorId === 6) this.$socket.emit('toggle-down-priority', { operatorId: data.operatorId, priority: 15 })
      })
    },
    operatorAccepted: function (data) {
      const alert = this.alertByChatRequestId(data.chatRequestId)

      alert.loading = false

      if (data.operatorId === this.user.id) this.openChat(data.chatRequestId)

      this.stopTimer(data.chatRequestId)
    }
  },
  mounted() {
  },
  destroyed() {
    this.chatRequestAlerts.forEach((alert) => {
      this.stopTimer(alert.chatRequest.id)
    })
  },
  methods: {
    startTimer(chatRequestId) {
      const alert = this.alertByChatRequestId(chatRequestId)

      alert.timer = setInterval(() => {
        alert.timeout--
        if (alert.timeout === 0) this.stopTimer(chatRequestId)
      }, 1000)
    },
    stopTimer(chatRequestId) {
      const alert = this.alertByChatRequestId(chatRequestId)

      clearTimeout(alert.timer)

      this.removeAlert(alert)
    },
    alertByChatRequestId(chatRequestId) {
      return this.chatRequestAlerts.find((alert) => alert.chatRequest.id === chatRequestId)
    },
    removeAlert(alert) {
      this.chatRequestAlerts.splice(this.chatRequestAlerts.indexOf(alert),1)

      console.log(this.chatRequestAlerts.length)

      if (this.chatRequestAlerts.length === 0) this.chatRequestAlert = false
    },
    openChat(chatRequestId) {
      console.log(chatRequestId)
    },
    acceptChatRequest(chatRequestId) {
      this.alertByChatRequestId(chatRequestId).loading = true

      this.$socket.emit('chat-request-accepted', {
        chatRequestId: chatRequestId,
        operatorId: this.user.id
      })
    }
  }
}
</script>

<style scoped>
.row-pointer :hover {
  cursor: pointer;
}
</style>