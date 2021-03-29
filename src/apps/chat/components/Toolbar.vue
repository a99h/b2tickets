<template>
  <!-- channel toolbar -->
  <v-app-bar flat height="64">
    <v-app-bar-nav-icon class="hidden-lg-and-up" @click="$emit('toggle-menu')"></v-app-bar-nav-icon>
    <div class="title font-weight-bold">{{ $route.name === 'apps-chat-channel' ? channelTitle : '' }}</div>

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
</template>

<script>

export default {
  name: 'ChatToolbar',
  props: {
    breadcrumbs: {
      type: Array,
      required: true
    },
    channelTitle: {
      type: String,
      required: true
    }
  },
  mounted() {
    console.log(this.$route.name)
  },
  methods: {
    leaveChannel() {
      this.$emit('leave-channel')
    },
    breadcrumbsOnClick(item) {
      if (item.text === this.$t('b2tickets.ticket.actions.createTicket')) {
        this.$refs.ticketForm.openDialog({
          ticketChatRequests: [this.chat.chatRequest],
          ticketOperators: [this.user]
        })
      }
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

<style scoped>

</style>