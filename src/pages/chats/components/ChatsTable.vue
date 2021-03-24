<template>
  <v-sheet min-height="100vh">
    <v-row
      dense
      align-content="center"
      justify="center"
    >
      <v-col cols="11">
        <v-hover v-slot:default="{ hover }">
          <v-row :elevation="hover ? 24 : 2">
            <v-col cols="12">
              <v-alert
                v-if="backendErrors"
                dismissible
                border="left"
                color="error"
                class="mt-2"
                type="error"
              >
                {{ backendErrors.message }}
              </v-alert>
              <v-data-table
                :headers="headers"
                :items="tickets"
                :loading="loading.dataTable"
                :search="search"
                fixed
                sort-by="name"
                class="elevation-1"
                :class="$vuetify.theme.dark ? 'surface' : ''"
                style="min-width: 100%"
              >
                <template v-slot:top>
                  <v-toolbar flat class="primary--text">
                    <v-toolbar-title>{{ $t('b2tickets.ticket.tickets') }}</v-toolbar-title>
                    <v-divider
                      class="mx-4"
                      inset
                      vertical
                    ></v-divider>
                    <v-text-field
                      v-model="search"
                      append-icon="mdi-magnify"
                      :label="$t('common.search')"
                      single-line
                      hide-details
                    ></v-text-field>
                    <v-spacer></v-spacer>
                    <TicketForm
                      ref="dialog"
                      :tickets="tickets"
                      @closeDialog="onCloseDialog"
                      @ticketFormBackendErrors="(err) => backendErrors = err"
                      @refreshState="dataTableInitialize"
                    ></TicketForm>
                  </v-toolbar>
                </template>
                <template v-slot:item.created_at="{ item }">
                  {{ new Date(item.created_at).toLocaleString() }}
                </template>
                <template v-slot:item.ticketChatRequests="{ item }">
                  <v-chip
                    v-for="chatRequest in item.ticketChatRequests"
                    :key="chatRequest.id"
                    small
                    outlined
                    color="success"
                  >
                    <strong>Request #{{ chatRequest.id }} <span class="text--primary">{{ chatRequest.user.email }}</span></strong>
                  </v-chip>
                </template>
                <template v-slot:item.ticketOperators="{ item }">
                  <v-chip
                    v-for="operator in item.ticketOperators"
                    :key="operator.id"
                    small
                    color="error"
                  >{{ operator.name }}
                  </v-chip>
                </template>
                <template v-slot:item.ticketStatus="{ item }">
                  <div class="font-weight-bold d-flex align-center">
                    <div :class="item.ticketStatus.color + '--text'">
                      <v-icon small :color="item.ticketStatus.color">mdi-circle-medium</v-icon>
                      <span>{{ $t('b2tickets.ticketStatus.' + item.ticketStatus.title) }}</span>
                    </div>
                  </div>
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-icon
                    small
                    class="mr-2"
                    @click="showItem(item)"
                  >
                    mdi-eye
                  </v-icon>
                  <v-icon
                    small
                    class="mr-2"
                    @click="editItem(item)"
                  >
                    mdi-pencil
                  </v-icon>
                  <v-icon
                    small
                    @click="deleteItem(item)"
                  >
                    mdi-delete
                  </v-icon>
                </template>
                <template v-slot:no-data>
                  <v-btn color="warning" @click="dataTableInitialize">Обновить</v-btn>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-hover>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TicketForm from '@/components/ticket/TicketForm'

export default {
  name: 'Chats',
  components: { TicketForm },
  data: () => ({
    loading: {
      dataTable: 'info'
    },
    backendErrors: null,
    search: '',
    chats: []
  }),
  computed: {
    ...mapGetters({
      getChats: 'chat/getChats'
    }),
    headers() { return [
      {
        text: 'ID',
        align: 'start',
        value: 'id'
      },
      { text: this.$tc('b2tickets.chat.fields.chatChatRequest', 1), value: 'ticketChatRequest' },
      { text: this.$t('b2tickets.chat.fields.active'), value: 'active' },
      { text: this.$t('b2tickets.common.created_at'), value: 'created_at' },
      { text: this.$t('b2tickets.common.created_at'), value: 'created_at' },
      { text: '', value: 'actions', sortable: false }
    ]}
  },
  mounted() {
    this.dataTableInitialize()
  },
  methods: {
    ...mapActions({
      fetchChats: 'chat/fetchChats',
      showTicket: 'ticket/showTicket',
      deleteTicket: 'ticket/deleteTicket'
    }),
    async dataTableInitialize() {
      this.loading.dataTable = 'info'

      await this.fetchTickets().then(() => {
        this.tickets = this.getTickets
      })

      this.loading.dataTable = false
      this.backendErrors = null
    },
    onCloseDialog() {
      this.backendErrors = null
    },
    async showItem(item) {
      this.backendErrors = null
      await this.showTicket(item).then((response) => {
        this.$refs.dialog.show(response.data)
      }).catch((err) => {
        this.$refs.dialog.dialogInitialize()
        this.backendErrors = err.response.data.message
      })
    },
    async editItem(item) {
      this.backendErrors = null
      await this.showTicket(item).then((response) => {
        Object.assign(this.tickets[this.tickets.indexOf(item)], response.data)
        this.$refs.dialog.edit(this.tickets[this.tickets.indexOf(item)])
      }).catch((err) => {
        this.$refs.dialog.dialogInitialize()
        this.backendErrors = err.response.data.message
      })
    },
    async deleteItem(item) {
      this.backendErrors = null
      confirm('Are you sure you want to delete this item?') &&
      await this.deleteTicket(item).then(() => {
        this.tickets.splice(this.tickets.indexOf(item), 1)
      }).catch((err) => {
        this.backendErrors = err.response.data.message
      })
    }
  }
}
</script>
