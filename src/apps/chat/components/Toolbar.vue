<template>
  <!-- channel toolbar -->
  <v-app-bar flat height="64">
    <v-app-bar-nav-icon class="hidden-lg-and-up" @click="$emit('toggle-menu')"></v-app-bar-nav-icon>
    <div class="title font-weight-bold">{{ currentChat | channelTitle }}</div>

    <v-breadcrumbs :items="breadcrumbs">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item
          :to="item.to"
          :disabled="item.disabled"
          @click="breadcrumbsOnClick(item)"
        >
          <span v-if="loading.ticketForm && isCreateTicketBtn(item) && !item.disabled">
            <v-progress-circular indeterminate color="primary" size="20"></v-progress-circular>
          </span>
          <span v-else>{{ item.text }}</span>
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
    <TicketForm
      v-if="!loading.ticketForm"
      ref="ticketForm"
      :editedTicket="editedTicket"
      :tickets="getTickets"
      :activator-hidden="true"
      @closeDialog="backendErrors = null"
      @ticketFormBackendErrors="(err) => backendErrors = err"
    ></TicketForm>

    <v-spacer></v-spacer>

    <v-btn
      v-if="$route.name === 'apps-chat-channel'"
      class="mx-1"
      icon
      :disabled="isDefaultChannelActive"
      @click.stop="leaveChannel()"
    >
      <v-icon color="error">mdi-exit-run</v-icon>
    </v-btn>
    <!-- <v-btn class="mx-1" icon @click.stop="usersDrawer = !usersDrawer">
      <v-icon>mdi-account-group-outline</v-icon>
    </v-btn> -->
  </v-app-bar>
</template>

<script>
import TicketForm from '@/components/ticket/TicketForm'
import { mapActions, mapGetters } from 'vuex'
import channelTitle from '@/apps/chat/js/filters/channelTitle'
import isEmpty from '@/js/lib/isEmpty'
import RecordedChat from '@/apps/chat/js/facade/RecordedChat'

export default {
  name: 'ChatToolbar',
  components: {
    TicketForm
  },
  filters: {
    channelTitle: channelTitle
  },
  data() {
    return {
      loading: {
        ticketForm: true
      },
      // App bar navigation
      breadcrumbs: [
        // {
        //   text: this.$tc('b2tickets.chat.request.title', 0),
        //   disabled: false,
        //   to: { name: 'apps-chat-request' }
        // },
        {
          text: this.$t('b2tickets.chat.chatHistory'),
          disabled: false,
          to: { name: 'apps-chat-chats' }
        }, {
          text: this.$t('b2tickets.ticket.actions.createTicket'),
          disabled: true,
          to: { name: 'apps-chat-channel-create-ticket', params: { id: this.currentChat ? this.currentChat.channelName : 'general' } }
        }
      ],

      editedTicket: {
        issue: '',
        description: '',
        ticketChatRequests: [],
        ticketOperators: [],
        ticketStatus: {},
        ticketChat: null
      }
    }
  },
  computed: {
    ...mapGetters({
      getTickets: 'ticket/getTickets',
      currentChat: 'chat/getCurrentChat'
    }),
    isDefaultChannelActive() {
      if (this.currentChat.channelName === 'general' || this.currentChat.channelName === 'restroom') {
        return true
      }

      return false
    }
  },
  watch: {
    currentChat(val) {
      if (!isEmpty(val)) {
        this.loading.ticketForm = true
        const ticketFormActivator = this.findTicketFormActivator()

        ticketFormActivator.disabled = val.chatRequest === undefined
        this.fetchTickets().then(() => {
          if (val instanceof RecordedChat) {
            this.editedTicket.ticketChatRequests = [this.currentChat.chatRequest.show()]
            this.editedTicket.ticketOperators = [this.currentChat.user]
            this.editedTicket = { ...this.editedTicket }
          }

          this.loading.ticketForm = false
        })
      }
    }
  },
  methods: {
    ...mapActions({
      getMessages: 'message/fetchMessages',
      storeMessage: 'message/storeMessage',
      fetchTickets: 'ticket/fetchTickets'
    }),
    findTicketFormActivator() {
      return this.breadcrumbs.find(
        (item) => item.text === this.$t('b2tickets.ticket.actions.createTicket')
      )
    },
    leaveChannel() {
      this.loading.ticketForm = true
      this.$emit('leave-channel')
    },
    breadcrumbsOnClick(item) {
      if (item.text === this.$t('b2tickets.ticket.actions.createTicket')) {
        this.$refs.ticketForm.dialog = true
      }
    },
    isCreateTicketBtn(item) {
      return item.text === this.$t('b2tickets.ticket.actions.createTicket')
    }
  }
}
</script>

<style scoped>

</style>
