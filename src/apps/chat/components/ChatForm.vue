<template>
  <v-dialog v-model="dialog" max-width="1000px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        id="ticketFormActivator"
        :hidden="activatorHidden"
        color="primary"
        class="mb-2"
        v-bind="attrs"
        v-on="on"
        @click="$route.name === 'apps-chat-channel' ? $emit('setTicketFormDefaultValues') : ''"
      >{{ $t('b2tickets.ticket.actions.createTicket') }}</v-btn>
    </template>
    <v-card :loading="loading.dialogForm">
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
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
        <v-container>
          <v-form
            id="form"
            ref="form"
            :readonly="dialogMode === 'show'"
          >
            <v-text-field
              v-model="editedItem.chat_request_id"
              :label="$t('b2tickets.chat.fields.chat_request_id')"
            ></v-text-field>
            <section v-if="dialogMode === 'show'">
              <v-input readonly>
                <v-chip v-modl="editedItem.chatClient" color="success">
                  <span class="text--primary">{{ editedItem.chatClient.email }}</span>
                </v-chip>
              </v-input>
            </section>
            <v-spacer></v-spacer>
            <v-btn color="warning" text @click="closeDialog">{{ $t('common.cancel') }}</v-btn>
            <v-btn
              v-if="(dialogMode !== 'show') && !loading.dialogForm"
              text
              color="accent"
              for="form"
              @click="submit"
            >{{ $t('common.save') }}</v-btn>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>

      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ChatForm',
  props: {
    chats: {
      type: Array,
      default: () => ({}),
      required: true
    },
    activatorHidden: {
      type: Boolean,
      required: false
    }
  },
  data: () => ({
    backendErrors: null,
    dialog: false,
    dialogMode: 'create',
    loading: {
      dialogForm: 'accent'
    },
    editedIndex: -1,
    editedItem: {
      chat_request_id: -1,
      chatClient: {},
      active: 0
    },
    defaultItem: {
      chat_request_id: -1,
      chatClient: {},
      active: 0
    },
    chatRequests: [],
    operators: [],
    statuses: []
  }),
  computed: {
    ...mapGetters({
      getChatRequests: 'chatRequest/getChatRequests',
      getOperators: 'user/getOperators',
      getStatuses: 'ticketStatus/getStatuses'
    }),
    formTitle() {
      let title = ''

      switch (this.dialogMode) {
      case 'show': title = this.$t('b2tickets.chat.form.show'); break
      case 'create': title = this.$t('b2tickets.chat.form.create'); break
      case 'edit': title = this.$t('b2tickets.chat.form.edit'); break
      }

      return title
    },
    loadingLabel() {
      if (this.loading.dialogForm === 'accent') return this.$t('b2tickets.common.loading'); else return this.$t('b2tickets.common.select')
    }
  },
  watch: {
    dialog(val) {
      val || this.closeDialog()
    }
  },
  mounted() {
    this.dialogInitialize()
  },
  methods: {
    ...mapActions({
      fetchChatRequests: 'chatRequest/fetchChatRequests',
      fetchOperators: 'user/fetchOperators',
      fetchStatuses: 'ticketStatus/fetchStatuses',
      createTicket: 'ticket/storeTicket',
      updateTicket: 'ticket/updateTicket'
    }),
    async dialogInitialize() {
      this.loading.dialogForm = 'accent'

      this.loading.dialogForm = false
    },
    openDialog(item) {
      this.editedIndex = this.chats.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    closeDialog() {
      this.$emit('formBackendErrors', null)
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
      this.dialogMode = 'create'
    },
    submit () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.saveChat()
      }
    },
    async saveChat() {
      this.backendErrors = null

      if (this.editedIndex > -1) {
        await this.updateChat(this.filteredItem(this.editedItem)).then((response) => {
          Object.assign(this.tickets[this.editedIndex], response.data)
          this.closeDialog()
        }).catch((err) => {
          this.backendErrors = err.response.data
          this.dialogInitialize()
        })
      } else {
        await this.createChat(this.filteredItem(this.editedItem)).then((response) => {
          this.chats.unshift(response.data)
          this.closeDialog()
        }).catch((err) => {
          this.backendErrors = err.response.data
          this.dialogInitialize()
        })
      }
    },
    edit(item) {
      this.dialogMode = 'edit'
      this.openDialog(item)
    },
    show(item) {
      this.dialogMode = 'show'
      this.openDialog(item)
    },
    filteredItem(data) {
      const { ticketClient } = data
      const filteredData = { ...data }

      if (ticketClient) Object.assign(filteredData, { ticketClient: data.ticketClient.map((item) => item.id) })

      return filteredData
    }
  }
}
</script>
