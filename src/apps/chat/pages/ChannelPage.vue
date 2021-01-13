<template>
  <!-- channel messages -->
  <div class="channel-page">
    <!-- channel toolbar -->
    <v-app-bar flat height="64">

      <v-app-bar-nav-icon
        class="hidden-lg-and-up"
        @click.stop="$emit('toggleChannelsDrawer')"
      ></v-app-bar-nav-icon>

      <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>

      <v-spacer></v-spacer>

      <v-btn
        v-if="$route.name === 'apps-chat-channel'"
        class="mx-1"
        icon
        @click.stop="leaveChannel(chatRequest)"
      >
        <v-icon color="error">mdi-exit-run</v-icon>
      </v-btn>
      <v-btn
        v-if="$route.name === 'apps-chat-channel'"
        class="mx-1"
        icon
        @click.stop="$emit('toggleUsersDrawer')"
      >
        <v-icon>mdi-account-group-outline</v-icon>
      </v-btn>

    </v-app-bar>

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
      <input-box :chat-request="chatRequest" @send-message="sendMessage" @send-typing="sendTypingEvent"/>
    </div>
  </div>
</template>

<script>
import InputBox from '../components/InputBox'
import ChannelMessage from '../components/ChannelMessage'

import Echo from '@/plugins/echo'

import { mapActions } from 'vuex'

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
    ChannelMessage
  },
  props: {
    // Current logged user
    user: {
      type: Object,
      default: () => ({})
    },
    chatRequest: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      messages: [],
      // users array for online users drawer
      onlineUsers: {},
      breadcrumbs: [
        {
          text: this.$tc('b2tickets.chat.request.title', 0),
          disabled: false,
          to: { name: 'apps-chat-request' }
        }
      ]
    }
  },
  created() {
    // this.initialize()
  },
  mounted() {
    this.initialize()
  },
  methods: {
    ...mapActions({
      getMessages: 'message/fetchMessages',
      storeMessage: 'message/storeMessage'
    }),
    initialize() {
      this.startChannel(this.chatRequest)
    },
    startChannel(chatRequest) {
      this.fetchMessages(chatRequest.id).then(() => {
        this.joinEcho()
      }).catch((e) => {
        console.log(e)
      })
    },
    joinEcho() {
      this.$emit('joinChannel', this.chatRequest)
      Echo.private('App.User.' + this.chatRequest.channel_name)
        .listen('MessageSent', (event) => {
          this.messages.push(event.message)
          this.scrollToBottom()

          this.$emit('setTyping', {
            channelName: this.chatRequest.channel_name,
            user: event.message.user,
            typing: false
          })
        })
        .listenForWhisper('typing', (data) => {
          const typingData = {
            channelName: this.chatRequest.channel_name,
            user: data.user,
            typing: true
          }

          this.$emit('setTyping', typingData)
        })
    },
    async fetchMessages(chatRequestId) {
      await this.getMessages(chatRequestId).then((response) => {
        this.messages = response.data
        this.scrollToBottom()
      })
    },
    // Send message to channel
    sendMessage(messageText) {
      this.storeMessage({
        user: this.user,
        message: messageText,
        chat_request_id: this.chatRequest.id
      }).then(() => {
        this.scrollToBottom()
      }).catch((err) => {
        console.log(err)
      })
    },
    sendTypingEvent() {
      Echo.private('App.User.' + this.channel)
        .whisper('typing', this.user.name)
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight
      })
    },
    updateUsersDrawer() {
      this.$emit('updateUsersDrawer')
    },
    leaveChannel(chatRequest) {
      Echo.leave('App.User.' + chatRequest.channel_name)
      this.$emit('removeChannel', chatRequest)
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
  top: 0;
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
