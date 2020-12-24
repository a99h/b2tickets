<template>
  <div class="d-flex flex-grow-1 flex-row mt-2">
    <v-navigation-drawer
      v-model="drawer"
      :app="$vuetify.breakpoint.mdAndDown"
      :permanent="$vuetify.breakpoint.lgAndUp"
      floating
      class="elevation-1 rounded flex-shrink-0 mr-3"
      width="240"
    >
      <div class="px-2 py-1">
        <div class="title font-weight-bold primary--text">{{ $t('b2tickets.chat.chatChannels') }}</div>
      </div>

      <v-list dense>
        <!-- channels list -->
        <v-list-item
          v-for="channelItem in channels"
          :key="channelItem.channel_name"
          exact
          :class="($route.path === `/apps/chat/channel/${channelItem.channel_name}`) ? 'surface' : ''"
          @click="changeChannel(channelItem)"
        >
          <v-list-item-avatar>
            <v-icon :color="channelItem.chat.active ? 'primary' : 'error'">mdi-radiobox-marked</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ channelItem.user.email }}</v-list-item-title>
            <v-list-item-action-text>{{ $tc('b2tickets.chat.request.title', 1) + ' #' + channelItem.id }}</v-list-item-action-text>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- channel view -->
    <v-card class="flex-grow-1">
      <router-view
        :key="$route.fullPath"
        :user="user"
        :online-users="onlineUsers"
        :chat-request="currentChatRequest"
        @toggle-menu="drawer = !drawer"
        @addChannel="addChannel"
      ></router-view>
    </v-card>
  </div>
</template>

<script>
/*
|---------------------------------------------------------------------
| Chat App Main Layout Component
|---------------------------------------------------------------------
|
| Navigation drawer with channels for the chat application
|
*/
import { mapActions, mapGetters } from 'vuex'
import Echo from '@/plugins/echo'

export default {
  data() {
    return {
      // navigation drawer
      drawer: null,

      // logged user
      user: null,

      // users array for online users drawer
      onlineUsers: {},

      // initial channels
      channels: [],

      currentChatRequest: {}
    }
  },
  computed: {
    ...mapGetters({
      getUser: 'auth/getUser'
    })
  },
  created() {
    this.initialize()
  },
  methods: {
    ...mapActions({
      updateChat: 'chat/updateChat',
      showClient: 'client/showClient'
    }),
    initialize() {
      this.user = this.getUser
    },
    updateChatActiveValue(chatRequest, chatActiveValue) {
      const data = {
        id: chatRequest.chat.id,
        active: chatActiveValue,
        chat_request_id: chatRequest.id
      }

      this.updateChat(data).then((response) => {
        this.channels[this.channels.indexOf(chatRequest)].chat.active = response.data.active
      }).catch((e) => {
        console.log(e)
      })
    },
    // Add and join the channel on creation
    addChannel(chatRequest) {
      if (!chatRequest) {
        this.$refs.channel.focus()

        return
      }

      const channelInList = this.channels.some((ch) => {
        return chatRequest.channel_name === ch.channel_name
      })

      if (!channelInList) this.channels.push(chatRequest)

      this.changeChannel(chatRequest)
    },
    changeChannel(chatRequest) {
      this.currentChatRequest = chatRequest
      if (this.$route.path !== `/apps/chat/channel/${chatRequest.channel_name}`) {
        this.joinEchoCommonEvents(chatRequest)
        this.$router.push(`/apps/chat/channel/${chatRequest.channel_name}`)
      }
    },
    joinEchoCommonEvents(chatRequest) {
      if (chatRequest.channel_name !== '') {
        const { channel_name } = chatRequest

        Echo.join('App.User.' + chatRequest.channel_name)
          .here((users) => {
            this.onlineUsers[channel_name] = users

            this.onlineUsers[channel_name].some((user) => {
              this.showClient(user).then((response) => {
                if (response.data.email === user.email) this.updateChatActiveValue(chatRequest,1)

                return true
              })

              this.updateChatActiveValue(chatRequest,0)

              return false
            })
          })
          .joining((user) => {
            this.onlineUsers[channel_name].push(user)

            this.showClient(user).then((response) => {
              if (response.data.email === user.email) this.updateChatActiveValue(chatRequest,1)
            }).catch((e) => {
              console.log(e)
            })
          })
          .leaving((user) => {
            this.onlineUsers[channel_name] = this.onlineUsers[channel_name].filter((u) => u.id !== user.id)
            if (user.email !== this.user.email) this.updateChatActiveValue(chatRequest,0)
          })

        Echo.private('App.User.' + chatRequest.channel_name)
          .listenForWhisper('typing', ({ id }) => {
            this.onlineUsers[channel_name].forEach((user, index) => {
              if (user.id === id) {
                user.typing = true
                this.$set(this.users, index, user)
              }
            })
          })
      }
    }
  }
}
</script>
