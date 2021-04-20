<template>
  <div>
    <v-divider></v-divider>

    <!-- channel messages -->
    <v-progress-linear
      v-if="loading.messages"
      color="deep-purple accent-4"
      indeterminate
      rounded
      height="6"
    ></v-progress-linear>
    <div v-if="!loading.messages" class="channel-page">
      <div id="messages" ref="messages" class="messages mx-2">
        <transition-group name="list">
          <channel-message
            v-for="message in chat.messages"
            :key="message.id"
            v-model="chat.messages"
            :message="message"
            :user="user"
            class="my-4 d-flex"
            :loading="loading.messages"
            :read_at="read_at"
          />
        </transition-group>
      </div>

      <div class="input-box pa-2">
        <input-box :channel="channel" @send-message="sendMessage" @send-typing="sendTyping"/>
      </div>
    </div>

    <!-- online users drawer -->
    <v-navigation-drawer
      v-model="usersDrawer"
      width="180"
      :right="!$vuetify.rtl"
      app
    >
      <v-list dense>
        <v-subheader class="mx-1 overline">
          {{ $t('chat.online', { count: chat.participants.length }) }}
        </v-subheader>
        <v-list-item v-for="item in chat.participants" :key="item.id" class="mb-1">
          <user-avatar :user="item" class="mx-1" />
          <v-list-item-content>
            <v-list-item-title :class="{ 'primary--text': item.email === user.email }">{{ item.name }}</v-list-item-title>
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

import channelTitle from '@/apps/chat/filters/channelTitle'

import { mapActions, mapGetters } from 'vuex'
import { messageService, channelService } from '@/apps/chat/services'

import Echo from '@/plugins/echo'

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
  filters: {
    channelTitle: channelTitle
  },
  props: {
    // Current logged user
    user: {
      type: Object,
      default: () => ({})
    },
    chat: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: {
        messages: false,
        tickets: true
      },

      // users online drawer
      usersDrawer: true,

      // channel information and messages
      channel: '',
      messages: [],
      read_at: 0,

      // Instance of Chat class
      chatInstance: {}
    }
  },
  watch: {
    '$route.params.id'() {
      this.startChannel(this.$route.params.id)
    }
  },
  mounted() {
    this.startChannel(this.$route.params.id)
    Echo.private('App.User.' + this.channel).listenForWhisper('last-message-read', () => {
      this.read_at = Date.now()
    })
  },
  beforeDestroy() {
    this.unregisterListeners()
  },
  methods: {
    ...mapActions({
      showChatRequest: 'chatRequest/showChatRequest',
      getMessages: 'message/fetchMessages',
      storeMessage: 'message/storeMessage',
      fetchTickets: 'ticket/fetchTickets'
    }),

    startChannel(channelId) {
      this.registerListeners()
      this.chat.unreadMessagesCount = 0

      this.channel = channelId
    },
    leaveChannel() {
      this.unregisterListeners()
      this.$emit('leave-channel', this.chat)
    },
    registerListeners() {
      window.addEventListener('channel-page-update-users-drawer', this.updateUsersDrawer)
      channelService.watchParticipants(this.chat)
    },
    unregisterListeners() {
      window.removeEventListener('channel-page-update-users-drawer',this.updateUsersDrawer)
    },
    // Send message to channel
    sendMessage(messageText) {
      this.chat.sendMessage(messageText)
      this.scrollToBottom()
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight
      })
    },
    sendTyping(typing) {
      messageService.sendTyping(this.chat.channelName, this.chat.user, typing)
    },
    updateUsersDrawer() {
      this.$forceUpdate()
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
