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
          outlined
        >
          <template v-slot:prepend="">
            <div class="d-block pr-2" style="cursor: pointer" @click="alert.active=false">
              <span class="title success--text">Accept</span>
              <v-icon x-large color="success">mdi-chat-alert</v-icon>
              <v-spacer
                class="my-5"
              ></v-spacer>
              <span class="title error--text">Decline</span>
              <v-icon x-large color="error">mdi-close-circle</v-icon>
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
import { showChatRequest } from '@/apps/chat/http/chatRequest'

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
  sockets: {
    connect() {
      console.log('socket connected')
    },
    operatorSuggested: function (data) {
      console.log(data)
      // if (data.operatorId === this.user.id) this.$socket.emit('chat-request-accepted', data)
      // this.chatRequestAlert = true

      showChatRequest(data.chatRequestId).then((res) => {
        console.log(res.data)
        this.chatRequestAlerts.push({
          active: true,
          timeout: 30,
          timer: null,
          chatRequest: res.data
        })

        this.startTimer(res.data.id)
        this.chatRequestAlert = true
      })
      // this.startTimer()

      // if (this.user.id === 6) this.$socket.emit('set-priority', { operatorId: this.user.id, priority: 15 })
    }
  },
  // watch: {
  //   timeout(time) {
  //     if (time === 0) {
  //       this.stopTimer()
  //       this.chatRequestAlert = false
  //     }
  //   }
  // },
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
        console.log(alert.timeout)
        alert.timeout--
        if (alert.timeout === 0) this.stopTimer(chatRequestId)
      }, 1000)
    },
    stopTimer(chatRequestId) {
      const alert = this.alertByChatRequestId(chatRequestId)

      clearTimeout(alert.timer)

      this.chatRequestAlerts.splice(this.chatRequestAlerts.indexOf(alert),1)

      if (this.chatRequestAlerts.length === 0) this.chatRequestAlert = false
    },
    alertByChatRequestId(chatRequestId) {
      return this.chatRequestAlerts.find((alert) => alert.chatRequest.id === chatRequestId)
    }
  }
}
</script>

<style scoped>
.row-pointer :hover {
  cursor: pointer;
}
</style>