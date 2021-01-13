<template>
  <div class="d-flex flex-grow-1 flex-row mt-2">
    <ChannelList
      ref="channelList"
      :channels="channels"
      :user="user"
      @changeChannel="changeChannel"
      @updateChatActiveValue="updateChatActiveValue"
      @updateUsersDrawer="updateUsersDrawer"
    ></ChannelList>

    <!-- channel view -->
    <v-card class="flex-grow-1">
      <div>

        <v-divider></v-divider>

        <router-view
          :key="$route.fullPath"
          :user="user"
          :chat-request="currentChatRequest"
          @addChannel="addChannel"
          @joinChannel="joinChannel"
          @updateChatActiveValue="updateChatActiveValue"
          @updateUsersDrawer="updateUsersDrawer"
          @toggleUsersDrawer="$refs.onlineUsersDrawer.drawer = !$refs.onlineUsersDrawer.drawer"
          @toggleChannelsDrawer="$refs.channelList.drawer = !$refs.channelList.drawer"
          @setTyping="setTyping"
          @removeChannel="removeChannel"
        ></router-view>
      </div>
    </v-card>

    <!-- Online users list -->
    <online-users-drawer
      v-if="$route.name === 'apps-chat-channel'"
      ref="onlineUsersDrawer"
      :user="user"
      :chat-request="currentChatRequest"
    ></online-users-drawer>
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
import ChannelList from './components/ChannelList'
import OnlineUsersDrawer from './components/OnlineUsersDrawer'

export default {
  components: {
    ChannelList,
    OnlineUsersDrawer
  },
  data() {
    return {
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
      getUser: 'auth/getUser',
      getChattingUsers: 'chat/getChattingUsers'
    })
  },
  created() {
    this.initialize()
  },
  methods: {
    ...mapActions({
      updateChat: 'chat/updateChat',
      storeChattingUsers: 'chat/storeChattingUsers'
    }),
    initialize() {
      this.user = this.getUser
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
        this.$router.push(`/apps/chat/channel/${chatRequest.channel_name}`)
      }
    },
    removeChannel(chatRequest) {
      const index = this.channels.indexOf(chatRequest)

      if (index > -1) {
        this.channels.splice(index, 1)
      }

      this.$router.push({ name: 'apps-chat-request' })
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
    joinChannel(chatRequest) {
      this.$refs.channelList.joinChannel(chatRequest)
    },
    updateUsersDrawer() {
      this.$refs.onlineUsersDrawer.$forceUpdate()
    },
    setChattingUsers(users) {
      this.storeChattingUsers(users).then(() => {
        this.updateUsersDrawer()
      })
    },
    setTyping(data) {
      const users = this.getChattingUsers

      users[data.channelName].some((user, index) => {
        if (user.email === data.user.email) {
          user.typing = data.typing

          return true
        }

        return false
      })
      this.setChattingUsers(users)
    }
  }
}
</script>
