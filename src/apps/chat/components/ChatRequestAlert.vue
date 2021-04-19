<template>
  <v-dialog
    v-model="chatRequestAlert"
    persistent
    width="50vw"
    transition="scale-transition"
  >
    <div>
      <v-card class="darken-2">
        <!-- ChatRequestAlert -->
        <v-alert
          outlined
        >
          <template v-slot:prepend="">
            <div class="d-block pr-2" style="cursor: pointer" @click="chatRequestAlert=false">
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
          <div><span class="font-weight-bold">Email: </span>client@example.com</div>
          <div><span class="font-weight-bold">Chat request Id: </span>148</div>

          <v-divider
            class="my-4 info"
            style="opacity: 0.22"
          ></v-divider>

          <div>
            <span class="font-weight-bold">Chat request message: </span>
            Proin magna. Vivamus in erat ut urna cursus vestibulum. Etiam imperdiet imperdiet orci.
          </div>

          <template v-slot:append="">
            <div class="primary--text font-weight-light display-2 text-uppercase justify-center">
              48
            </div>
          </template>

        </v-alert>
      </v-card>
    </div>
    <div>
      <v-card class="darken-2">
        <!-- ChatRequestAlert -->
        <v-alert
          outlined
        >
          <template v-slot:prepend="">
            <div class="d-block pr-2" style="cursor: pointer" @click="chatRequestAlert=false">
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
          <div><span class="font-weight-bold">Email: </span>client@example.com</div>
          <div><span class="font-weight-bold">Chat request Id: </span>148</div>

          <v-divider
            class="my-4 info"
            style="opacity: 0.22"
          ></v-divider>

          <div>
            <span class="font-weight-bold">Chat request message: </span>
            Proin magna. Vivamus in erat ut urna cursus vestibulum. Etiam imperdiet imperdiet orci.
          </div>

          <template v-slot:append="">
            <div class="primary--text font-weight-light display-2 text-uppercase justify-center">
              48
            </div>
          </template>

        </v-alert>
      </v-card>
    </div>
    <div>
      <v-card class="darken-2">
        <!-- ChatRequestAlert -->
        <v-alert
          outlined
        >
          <template v-slot:prepend="">
            <div class="d-block pr-2" style="cursor: pointer" @click="chatRequestAlert=false">
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
          <div><span class="font-weight-bold">Email: </span>client@example.com</div>
          <div><span class="font-weight-bold">Chat request Id: </span>148</div>

          <v-divider
            class="my-4 info"
            style="opacity: 0.22"
          ></v-divider>

          <div>
            <span class="font-weight-bold">Chat request message: </span>
            Proin magna. Vivamus in erat ut urna cursus vestibulum. Etiam imperdiet imperdiet orci.
          </div>

          <template v-slot:append="">
            <div class="primary--text font-weight-light display-2 text-uppercase justify-center">
              48
            </div>
          </template>

        </v-alert>
      </v-card>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'ChatRequestAlert',
  data() {
    return {
      chatRequestAlert: true
    }
  },
  sockets: {
    connect() {
      console.log('socket connected')
    },
    operatorSuggested: function (data) {
      console.log(data)
      // if (data.operatorId === this.user.id) this.$socket.emit('chat-request-accepted', data)
      this.chatRequestAlert = true

      // if (this.user.id === 6) this.$socket.emit('set-priority', { operatorId: this.user.id, priority: 15 })
    }
  }
}
</script>

<style scoped>
.row-pointer :hover {
  cursor: pointer;
}
</style>