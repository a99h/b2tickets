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
      @click.stop="leaveChannel()"
    >
      <v-icon color="error">mdi-exit-run</v-icon>
    </v-btn>
    <v-btn class="mx-1" icon @click.stop="usersDrawer = !usersDrawer">
      <v-icon>mdi-account-group-outline</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import TicketForm from '@/components/ticket/TicketForm'
import { mapActions, mapGetters } from 'vuex'
import channelTitle from '@/apps/chat/js/filters/channelTitle'
import isEmpty from '@/js/lib/isEmpty'
import OpenedRecordedChat from '@/apps/chat/js/chat-facade/OpenedRecordedChat'

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
          to: { name: 'apps-chat-list' }
        }, {
          text: this.$t('b2tickets.ticket.actions.createTicket'),
          disabled: true,
          to: { name: 'apps-chat-channel-create-ticket', params: { id: this.currentChat ? this.currentChat.channelName : 'general' } }
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      getTickets: 'ticket/getTickets',
      currentChat: 'chat/getCurrentChat'
    })
  },
  watch: {
    currentChat(val) {
      if (!isEmpty(val)) {
        this.loading.ticketForm = true
        const ticketFormActivator = this.findTicketFormActivator()

        ticketFormActivator.disabled = val.chatRequest === undefined
        this.fetchTickets().then(() => {
          if (val instanceof OpenedRecordedChat) this.setTicketFormDefaultValues()

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
    setTicketFormDefaultValues() {
      if (this.$refs.ticketForm) {
        this.$refs.ticketForm.editedItem.ticketChatRequests = [this.currentChat.chatRequest.show()]
        this.$refs.ticketForm.editedItem.ticketOperators = [this.currentChat.user]
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