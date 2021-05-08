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
              v-model="editedItem.issue"
              :label="$t('b2tickets.ticket.fields.issue')"
              :error-messages="issueErrors"
              @input="$v.editedItem.issue.$touch()"
              @blur="$v.editedItem.issue.$touch()"
            ></v-text-field>
            <v-textarea
              v-model="editedItem.description"
              :label="$t('b2tickets.ticket.fields.description')"
              outlined
              :error-messages="descriptionErrors"
              @input="$v.editedItem.description.$touch()"
              @blur="$v.editedItem.description.$touch()"
            ></v-textarea>
            <section v-if="dialogMode === 'show'">
              <v-input readonly>
                <v-chip v-for="item in editedItem.ticketChatRequests" :key="item.id" color="success">
                  <strong>Request #{{ item.id }} <span class="text--primary">{{ item.user.email }}</span></strong>
                </v-chip>
              </v-input>
              <v-input readonly>
                <v-chip v-for="item in editedItem.ticketOperators" :key="item.id" color="error">{{ item.name }}</v-chip>
              </v-input>
              <v-input readonly>
                <v-chip color="info">{{ editedItem.ticketStatus.title }}</v-chip>
              </v-input>
            </section>
            <section v-if="(dialogMode === 'create') || (dialogMode === 'edit')">
              <v-autocomplete
                v-model="editedItem.ticketChatRequests"
                :label="loadingLabel"
                :items="chatRequests"
                :error-messages="ticketChatRequestsErrors"
                :hint="$t('b2tickets.ticket.select.ticketChatRequests')"
                clearable
                deletable-chips
                :disabled="$route.name === 'apps-chat-channel'"
                eager
                multiple
                persistent-hint
                return-object
                small-chips
                item-color="success"
                item-text="id"
                @input="$v.editedItem.ticketChatRequests.$touch()"
                @blur="$v.editedItem.ticketChatRequests.$touch()"
              >
                <template v-slot:selection="{ item }">
                  <v-chip
                    small
                    outlined
                    color="success"
                  >
                    <strong>Request #{{ item.id }} <span class="text--primary">{{ item.user.email }}</span></strong>
                  </v-chip>
                </template>
                <template v-slot:item="data">
                  <v-list-item-content>
                    <v-list-item-title v-html="data.item.id"></v-list-item-title>
                    <v-list-item-subtitle v-html="data.item.user.email"></v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
              <v-autocomplete
                v-model="editedItem.ticketOperators"
                :label="loadingLabel"
                :items="operators"
                :error-messages="ticketOperatorsErrors"
                :hint="$t('b2tickets.ticket.select.ticketOperators')"
                clearable
                deletable-chips
                eager
                multiple
                persistent-hint
                return-object
                small-chips
                item-color="error"
                item-text="name"
              ></v-autocomplete>
              <section v-if="dialogMode === 'edit'">
                <v-select
                  v-model="editedItem.ticketStatus"
                  :label="loadingLabel"
                  :items="statuses"
                  :error-messages="ticketStatusErrors"
                  :hint="$t('b2tickets.ticket.select.ticketStatus')"
                  eager
                  persistent-hint
                  return-object
                  small-chips
                  item-color="info"
                  item-text="title"
                >
                  <template v-slot:selection="{ item }">
                    <v-chip
                      small
                      color="info"
                    >{{ $t('b2tickets.ticketStatus.' + item.title) }}
                    </v-chip>
                  </template>
                </v-select>
              </section>
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
import { required, maxLength, minLength } from 'vuelidate/lib/validators'

export default {
  name: 'TicketForm',
  props: {
    tickets: {
      type: Array,
      default: () => ({})
    },
    activatorHidden: {
      type: Boolean,
      required: false
    },
    chatId: {
      type: Number,
      required: false
    }
  },
  validations: {
    editedItem: {
      issue: { required },
      description: { maxLength: maxLength(10000) },
      ticketChatRequests: { required }
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
      issue: '',
      description: '',
      ticketChatRequests: [],
      ticketOperators: [],
      ticketStatus: {},
      ticketChat: null
    },
    defaultItem: {
      issue: '',
      description: '',
      ticketChatRequests: [],
      ticketOperators: [],
      ticketStatus: {}
    },
    chatRequests: [],
    operators: [],
    statuses: []
  }),
  computed: {
    ...mapGetters({
      getChatRequests: 'chatRequest/getChatRequests',
      getOperators: 'operator/getOperators',
      getStatuses: 'ticketStatus/getStatuses',
      findTicketById: 'ticket/findTicketById'
    }),
    formTitle() {
      let title = ''

      switch (this.dialogMode) {
      case 'show': title = this.$t('b2tickets.ticket.actions.showTicket'); break
      case 'create': title = this.$t('b2tickets.ticket.actions.createTicket'); break
      case 'edit': title = this.$t('b2tickets.ticket.actions.editTicket'); break
      }

      return title
    },
    loadingLabel() {
      if (this.loading.dialogForm === 'accent') return this.$t('b2tickets.common.loading'); else return this.$t('b2tickets.common.select')
    },
    issueErrors () {
      const errors = []

      if (!this.$v.editedItem.issue.$dirty) return errors
      !this.$v.editedItem.issue.required && errors.push('Необходимо обозначить проблему')

      if (this.backendErrors && this.backendErrors.errors.issue) this.backendErrors.errors.issue.forEach((error) => {
        errors.push(error)
      })

      return errors
    },
    descriptionErrors () {
      const errors = []

      if (!this.$v.editedItem.description.$dirty) return errors
      !this.$v.editedItem.description.maxLength && errors.push('Описание должно быть не более '
        + this.$v.editedItem.description.$params.maxLength.max
        + ' символов')

      if (this.backendErrors && this.backendErrors.errors.description) this.backendErrors.errors.description.forEach((error) => {
        errors.push(error)
      })

      return errors
    },
    ticketChatRequestsErrors () {
      const errors = []

      if (!this.$v.editedItem.ticketChatRequests.$dirty) return errors
      !this.$v.editedItem.ticketChatRequests.required && errors.push('Необходимо добавить хотя бы один запрос на чат')

      if (this.backendErrors && this.backendErrors.errors.ticketChatRequests)
        this.backendErrors.errors.ticketChatRequests.forEach((error) => {
          errors.push(error)
        })

      return errors
    },
    ticketOperatorsErrors () {
      const errors = []

      if (this.backendErrors && this.backendErrors.errors.ticketOperators) this.backendErrors.errors.ticketOperators.forEach((error) => {
        errors.push(error)
      })

      return errors
    },
    ticketStatusErrors () {
      const errors = []

      if (this.backendErrors && this.backendErrors.errors.ticketStatus) this.backendErrors.errors.ticketStatus.forEach((error) => {
        errors.push(error)
      })

      return errors
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
      fetchOperators: 'operator/fetchOperators',
      fetchStatuses: 'ticketStatus/fetchStatuses',
      createTicket: 'ticket/storeTicket',
      updateTicket: 'ticket/updateTicket'
    }),
    async dialogInitialize() {
      this.loading.dialogForm = 'accent'
      await this.fetchChatRequests().then(() => {
        this.chatRequests = this.getChatRequests
      }).catch((err) => {
        this.$emit('ticketFormBackendErrors', err.response.data)
      })
      await this.fetchOperators().then(() => {
        this.operators = this.getOperators
      }).catch((err) => {
        this.$emit('ticketFormBackendErrors', err.response.data)
      })
      await this.fetchStatuses().then(() => {
        this.statuses = this.getStatuses
      }).catch((err) => {
        this.$emit('ticketFormBackendErrors', err.response.data)
      })

      this.loading.dialogForm = false
    },
    openDialog(item) {
      this.editedIndex = this.findTicketById(item.id).id
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    closeDialog() {
      this.$emit('ticketFormBackendErrors', null)
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
        this.saveTicket()
      }
    },
    async saveTicket() {
      this.backendErrors = null

      if (this.editedIndex > -1) {
        await this.updateTicket(this.filteredItem(this.editedItem)).then(() => {
          this.closeDialog()
        }).catch(() => {
          this.dialogInitialize()
        })
      } else {
        await this.createTicket(this.filteredItem(this.editedItem)).then(() => {
          this.closeDialog()
        }).catch(() => {
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
      const { ticketChatRequests, ticketOperators, ticketStatus } = data
      const filteredData = { ...data }

      if (ticketChatRequests) Object.assign(filteredData, { ticketChatRequests: data.ticketChatRequests.map((item) => item.id) })
      if (ticketOperators !== []) Object.assign(filteredData, { ticketOperators: data.ticketOperators.map((item) => item.id) })
      if (ticketStatus) Object.assign(filteredData, { ticketStatus: data.ticketStatus.id })

      if (this.chatId) Object.assign(filteredData, { ticketChat: this.chatId })

      return filteredData
    }
  }
}
</script>
