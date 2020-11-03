<template>
  <div>
    <!-- channel toolbar -->
    <v-app-bar flat height="64">
      <v-app-bar-nav-icon class="hidden-lg-and-up" @click="$emit('toggle-menu')"></v-app-bar-nav-icon>
      <div class="title font-weight-bold">
        <v-btn class="primary" :to="{ name: 'apps-chat-request'}">Chat request</v-btn>
      </div>

      <v-spacer></v-spacer>

      <v-btn class="mx-1" icon @click.stop="toggleUsersDrawer">
        <v-icon>mdi-account-group-outline</v-icon>
      </v-btn>
    </v-app-bar>

    <v-divider></v-divider>

    <!-- channel messages -->
    <div class="channel-page">
      <div id="messages" ref="messages" class="messages mx-2">
        <transition-group name="list">
          <channel-message
            v-for="message in messages"
            :key="message.id"
            :message="message"
            :user="user"
            class="my-4 d-flex"
          />
        </transition-group>
      </div>

      <div class="input-box pa-2">
        <input-box :channel="channel" @send-message="sendMessage" @send-typing="sendTypingEvent"/>
      </div>
    </div>

    <online-users-drawer ref="onlineUsersDrawer" :user="user" :channel="channel"></online-users-drawer>
  </div>
</template>

<script>
import InputBox from '../components/InputBox'
import ChannelMessage from '../components/ChannelMessage'
import OnlineUsersDrawer from '../components/OnlineUsersDrawer'

import Echo from '@/plugins/echo'

import axios from '@/plugins/axios'

/*
|---------------------------------------------------------------------
| Chat Channel Page Component
|---------------------------------------------------------------------
|
| Layout to display the channel messages and users online
|
*/
export default {
  components: {
    InputBox,
    ChannelMessage,
    OnlineUsersDrawer
  },
  props: {
    // Current logged user
    user: {
      type: Object,
      default: () => ({})
    },
    channelobj: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // users online drawer
      usersDrawer: false,

      // channel information and messages
      channel: '',
      messages: [],
      // online users
      users: [
        this.user
      ]
    }
  },
  watch: {
    '$route.params.id'() {
      this.startChannel(this.$route.params.id)
    }
  },
  created() {
    this.initialize()
  },
  mounted() {

  },
  methods: {
    initialize() {
      this.startChannel(this.$route.params.id)
      this.joinEcho()
    },
    startChannel(channelId) {
      this.channel = channelId
      this.fetchMessages()
    },
    joinEcho() {
      Echo.private('App.User.' + this.channel)
        .listenForWhisper('typing', ({ id, name }) => {
          this.users.forEach((user, index) => {
            if (user.id === id) {
              user.typing = true
              this.$set(this.users, index, user)
            }
          })
        })
        .listen('MessageSent', (event) => {
          this.messages.push(event.message)
          this.scrollToBottom()

          this.users.forEach((user, index) => {
            if (user.id === event.message.user.id) {
              user.typing = false
              this.$set(this.users, index, user)
            }
          })
        })
    },
    fetchMessages() {
      axios.get(route('api.ticketsystem.chat.index',this.channelobj.chatRequest)).then((response) => {
        this.messages = response.data.data
        this.scrollToBottom()
      })
    },
    // Send message to channel
    sendMessage(messageText) {
      console.log(this.channelobj)
      console.log(this.user)
      axios.post(route('api.ticketsystem.chat.store'),
        {
          user: this.user,
          message: messageText,
          chat_request_id: this.channelobj.chatRequest
        }).then(() => {
        this.scrollToBottom()
      }).catch((err) => {
        console.log(err)
      })
    },
    sendTypingEvent() {
      Echo.private('App.User.' + this.channel)
        .whisper('typing', this.user)
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight
      })
    },
    addChannel(channel) {
      this.channel = channel.name
      this.$emit('addChannel', channel)
    },
    toggleUsersDrawer() {
      this.$refs.onlineUsersDrawer.usersDrawer = !this.$refs.onlineUsersDrawer.usersDrawer
    }
  }
}
</script>
<style lang="scss" scoped>
// List Transition Animation
.list-enter-active {
  transition: all 0.3s;
}

.list-move {
  transition: transform 0.3s;
}

.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
// -- End List Transition Animation

.channel-page {
  position: absolute;
  top: 65px;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: url("/images/chat/chat-bg-2.png");

  .messages {
    flex-grow: 1;
    margin-bottom: 68px;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    min-height: 0;
  }

  .input-box {
    position: fixed;
    bottom: 12px;
    width: 100%;
  }

  .messages {
    padding-bottom: 0px;
  }

  .input-box {
    position: absolute;
    bottom: 12px;
  }
}

.theme--dark {
  .channel-page {
    background: none;
  }
}
</style>
