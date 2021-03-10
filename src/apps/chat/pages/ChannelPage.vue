<template>
  <div>
    <!-- channel toolbar -->
    <v-app-bar flat height="64">
      <v-app-bar-nav-icon class="hidden-lg-and-up" @click="$emit('toggle-menu')"></v-app-bar-nav-icon>
      <div class="title font-weight-bold">{{ chat | channelTitle }}</div>

      <v-breadcrumbs :items="breadcrumbs">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item
            :to="item.to"
            :disabled="item.disabled"
            @click="breadcrumbsOnClick(item)"
          >
            {{ item.text }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
      <TicketForm
        ref="ticketForm"
        :tickets="getTickets"
        @closeDialog="backendErrors = null"
        @ticketFormBackendErrors="(err) => backendErrors = err"
        @refreshState="refreshTickets"
      ></TicketForm>

      <v-spacer></v-spacer>

      <v-btn
        v-if="$route.name === 'apps-chat-channel'"
        class="mx-1"
        icon
        @click.stop="leaveChannel()"
      >
        <v-icon color="error">mdi-exit-run</v-icon>
      </v-btn>
      <v-btn class="mx-1" icon @click.stop="usersDrawer = !usersDrawer">
        <v-icon>mdi-account-group-outline</v-icon>
      </v-btn>
    </v-app-bar>

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
            :message="message"
            :user="user"
            class="my-4 d-flex"
            :loading="loading.messages"
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
import TicketForm from '@/components/ticket/TicketForm'

import channelTitle from '@/apps/chat/filters/channelTitle'

import { mapActions, mapGetters } from 'vuex'

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
    ChannelMessage,
    TicketForm
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

      // Instance of Chat class
      chatInstance: {},

      // App bar navigation
      breadcrumbs: [
        {
          text: this.$tc('b2tickets.chat.request.title', 0),
          disabled: false,
          to: { name: 'apps-chat-request' }
        },
        {
          text: this.$t('b2tickets.ticket.actions.createTicket'),
          disabled: true,
          to: { name: 'apps-chat-channel-create-ticket' }
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      getTickets: 'ticket/getTickets'
    })
  },
  watch: {
    '$route.params.id'() {
      this.startChannel(this.$route.params.id)
    }
  },
  mounted() {
    this.startChannel(this.$route.params.id)
    this.prepareTicketForm().then(() => {
      this.breadcrumbs[1].disabled = this.chat.chatRequest === undefined
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

      this.channel = channelId
    },
    leaveChannel() {
      this.unregisterListeners()
      this.$emit('leave-channel', this.chat)
    },
    registerListeners() {
      window.addEventListener('channel-page-update-users-drawer', this.updateUsersDrawer)
      this.chat.watchParticipants()
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
      this.chat.sendTyping(typing)
    },
    updateUsersDrawer() {
      this.$forceUpdate()
    },
    prepareTicketForm() {
      return new Promise((resolve, reject) => {
        this.fetchTickets()
          .then((response) => resolve(response))
          .catch((err) => reject(err))
      })
    },
    breadcrumbsOnClick(item) {
      if (item.text === this.$t('b2tickets.ticket.actions.createTicket')) {
        this.$refs.ticketForm.openDialog({
          ticketChatRequests: [this.chat.chatRequest],
          ticketOperators: [this.user]
        })
      }
    },
    setTicketFormDefaultValues() {
      this.$refs.ticketForm.editedItem.ticketChatRequests = [this.chat.chatRequest]
      this.$refs.ticketForm.editedItem.ticketOperators = [this.user]
    },
    async refreshTickets() {
      console.log('loading spinner true')
      await this.fetchTickets().then(() => {
        console.log('loading spinner false')
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
