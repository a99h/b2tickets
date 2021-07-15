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
    <div v-if="currentChat" class="channel-page">
      <div id="messages" ref="messages" class="messages mx-2">
        <!-- <transition-group name="list"> -->
        <channel-message
          v-for="message in currentChat.messages.all()"
          :key="message.id"
          :message="message"
          :user="user"
          class="my-4 d-flex"
          :loading="loading.messages"
        />
        <!-- </transition-group> -->
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
          {{ $t('chat.online', { count: currentChat.participants.length }) }}
        </v-subheader>
        <v-list-item v-for="item in currentChat.participants" :key="item.id" class="mb-1">
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

import channelTitle from '@/apps/chat/js/filters/channelTitle'

import { mapActions, mapGetters } from 'vuex'
import { messageService, channelService } from '@/apps/chat/js/services'

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

      // Instance of Chat class
      chatInstance: {}
    }
  },
  computed: {
    ...mapGetters({
      currentChat: 'chat/getCurrentChat'
    })
  },
  watch: {
    '$route.params.id'() {
      this.startChannel(this.$route.params.id)
    },
    currentChat(val) {
      if (val) this.loading.messages = false
    }
  },
  mounted() {
    this.startChannel(this.$route.params.id)
    this.loading.messages = false
  },
  beforeDestroy() {
    this.unregisterListeners()
  },
  methods: {
    ...mapActions({
      storeMessage: 'message/storeMessage',
      fetchTickets: 'ticket/fetchTickets'
    }),

    startChannel(channelId) {
      this.registerListeners()
      this.currentChat.unreadMessagesCount = 0

      this.channel = channelId
    },
    leaveChannel() {
      this.unregisterListeners()
      this.$emit('leave-channel', this.currentChat)
    },
    registerListeners() {
      window.addEventListener('channel-page-update-users-drawer', this.updateUsersDrawer)
      channelService.watchParticipants(this.currentChat)
    },
    unregisterListeners() {
      window.removeEventListener('channel-page-update-users-drawer',this.updateUsersDrawer)
    },
    // Send message to channel
    sendMessage(messageText) {
      this.currentChat.sendMessage(messageText)
      this.scrollToBottom()
    },
    watchReadAt() {
      this.currentChat.watchReadAt()
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const current = this.$refs.messages

        current.scrollTo(0, current.scrollHeight)
      })
    },
    sendTyping(typing) {
      messageService.sendTyping(this.currentChat.channelName, this.currentChat.user, typing)
    },
    updateUsersDrawer() {
      this.$forceUpdate()
      // this.watchReadAt()
      const current = this.$refs.messages
      
      if (current.scrollHeight - current.scrollTop < current.clientHeight + 100 ) {
        this.scrollToBottom()
      }
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
