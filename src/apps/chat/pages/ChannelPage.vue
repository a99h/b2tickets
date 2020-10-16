<template>
  <div>
    <!-- channel toolbar -->
    <v-app-bar flat height="64">
      <v-app-bar-nav-icon class="hidden-lg-and-up" @click="$emit('toggle-menu')"></v-app-bar-nav-icon>
      <div class="title font-weight-bold"># {{ $route.params.id }}</div>

      <v-spacer></v-spacer>

      <v-btn class="mx-1" icon @click.stop="usersDrawer = !usersDrawer">
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

    <!-- online users drawer -->
    <v-navigation-drawer
      v-model="usersDrawer"
      width="240"
      right
      app
    >
      <v-list dense>
        <v-subheader class="mx-1 overline">
          {{ $t('b2tickets.chat.online', { count: users.length }) }}
        </v-subheader>
        <v-list-item v-for="item in users" :key="item.id" class="mb-1">
          <user-avatar :user="item" class="mx-1" />
          <v-list-item-content>
            <v-list-item-title :class="{ 'primary--text': item.id === user.id }">
              @{{ item.name }}
            </v-list-item-title>
            <v-list-item-action-text>
              <v-chip v-if="item.typing" class="primary" x-small>печатает...</v-chip>
            </v-list-item-action-text>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import InputBox from '../components/InputBox'
import UserAvatar from '../components/UserAvatar'
import ChannelMessage from '../components/ChannelMessage'

// Demo messages and users
import getMessage, { users } from '../content/messages'

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
    UserAvatar,
    ChannelMessage
  },
  props: {
    // Current logged user
    user: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // users online drawer
      usersDrawer: true,

      // channel information and messages
      channel: '',
      messages: [],

      // online users
      users: [
        this.user,
        ...users
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
    this.startChannel(this.$route.params.id)
  },
  methods: {
    initialize() {
      this.joinEcho()
      this.fetchMessages()
    },
    startChannel(channelId) {
      clearTimeout(this.timeoutGenerator)

      this.messages = []

      this.channel = channelId
    },
    joinEcho() {
      Echo.join('chat')
        .here((users) => {
          this.users = users
        })
        .joining((user) => {
          this.users.push(user)
        })
        .leaving((user) => {
          this.users = this.users.filter((u) => u.id !== user.id)
        })
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
      axios.get(route('api.ticketsystem.chat.index')).then((response) => {
        this.messages = response.data.data
        this.scrollToBottom()
      })
    },
    // Send message to channel
    sendMessage(messageText) {
      axios.post(route('api.ticketsystem.chat.store'),
        {
          user: this.user,
          message: messageText
        }).then(() => {
        this.scrollToBottom()
      }).catch((err) => {
        console.log(err)
      })
    },
    sendTypingEvent() {
      console.log('im typing')
      Echo.join('chat')
        .whisper('typing', this.user)
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight
      })
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
