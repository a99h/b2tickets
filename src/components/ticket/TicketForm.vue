<template>
  <v-dialog v-model="dialog" max-width="1000px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="primary"
        class="mb-2"
        v-bind="attrs"
        v-on="on"
      >{{ $t('b2tickets.ticket.actions.createTicket') }}</v-btn>
    </template>
    <v-card :loading="loading.dialogForm">
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
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
                <v-chip v-for="item in editedItem.ticketClients" :key="item.id" color="success">{{ item.name }}</v-chip>
              </v-input>
              <v-input readonly>
                <v-chip v-for="item in editedItem.ticketOperators" :key="item.id" color="error">{{ item.name }}</v-chip>
              </v-input>
              <v-input readonly>
                <v-chip color="info">{{ editedItem.ticketStatus.title }}</v-chip>
              </v-input>
            </section>
            <section v-if="(dialogMode === 'create') || (dialogMode === 'edit')">
              <v-select
                v-model="editedItem.ticketClients"
                :label="loadingLabel"
                :items="clients"
                :error-messages="ticketClientsErrors"
                :hint="$t('b2tickets.ticket.select.ticketClients')"
                clearable
                deletable-chips
                eager
                multiple
                persistent-hint
                return-object
                small-chips
                item-color="success"
                item-text="name"
                @input="$v.editedItem.ticketClients.$touch()"
                @blur="$v.editedItem.ticketClients.$touch()"
              >
              </v-select>
              <v-select
                v-model="editedItem.ticketOperators"
                :label="loadingLabel"
                :items="operators"
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
              ></v-select>
              <section v-if="dialogMode === 'edit'">
                <v-select
                  v-model="editedItem.ticketStatus"
                  :label="loadingLabel"
                  :items="statuses"
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
    }
  },
  validations: {
    editedItem: {
      issue: { required },
      description: { maxLength: maxLength(10000) },
      ticketClients: { required }
    }
  },
  data: () => ({
    dialog: false,
    dialogMode: 'create',
    loading: {
      dialogForm: 'accent'
    },
    editedIndex: -1,
    editedItem: {
      issue: '',
      description: '',
      ticketClients: [],
      ticketOperators: [],
      ticketStatus: {}
    },
    defaultItem: {
      issue: '',
      description: '',
      ticketClients: [],
      ticketOperators: [],
      ticketStatus: {}
    },
    clients: [],
    operators: [],
    statuses: []
  }),
  computed: {
    ...mapGetters({
      getClients: 'user/getClients',
      getOperators: 'user/getOperators',
      getStatuses: 'ticketStatus/getStatuses'
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

      return errors
    },
    descriptionErrors () {
      const errors = []

      if (!this.$v.editedItem.description.$dirty) return errors
      !this.$v.editedItem.description.maxLength && errors.push('Описание должно быть не более '
        + this.$v.editedItem.description.$params.maxLength.max
        + ' символов')

      return errors
    },
    ticketClientsErrors () {
      const errors = []

      if (!this.$v.editedItem.ticketClients.$dirty) return errors
      !this.$v.editedItem.ticketClients.required && errors.push('Необходимо добавить хотя бы одного пользователя')

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
      fetchClients: 'user/fetchClients',
      fetchOperators: 'user/fetchOperators',
      fetchStatuses: 'ticketStatus/fetchStatuses',
      createTicket: 'ticket/storeTicket',
      updateTicket: 'ticket/updateTicket',
      deleteTicket: 'ticket/deleteTicket',
      showTicket: 'ticket/showTicket'
    }),
    async dialogInitialize() {
      this.loading.dialogForm = 'accent'
      await this.fetchClients().then(() => {
        this.clients = this.getClients
      }).catch((err) => {
        this.$emit('ticketFormBackendErrors', err.response.data.message)
      })
      await this.fetchOperators().then(() => {
        this.operators = this.getOperators
      }).catch((err) => {
        this.$emit('ticketFormBackendErrors', err.response.data.message)
      })
      await this.fetchStatuses().then(() => {
        this.statuses = this.getStatuses
      }).catch((err) => {
        this.$emit('ticketFormBackendErrors', err.response.data.message)
      })

      this.loading.dialogForm = false
    },
    openDialog(item) {
      this.editedIndex = this.tickets.indexOf(item)
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
      if (this.editedIndex > -1) {
        //Object.assign(this.tickets[this.editedIndex], this.editedItem)
        await this.updateTicket(this.filteredItem(this.editedItem)).then((response) => {
          Object.assign(this.tickets[this.editedIndex], response.data)
          this.closeDialog()
        }).catch((err) => {
          this.$emit('ticketFormBackendErrors', err.response.data.message)
        })
      } else {
        await this.createTicket(this.filteredItem(this.editedItem)).then((response) => {
          this.tickets.unshift(response.data)
          this.closeDialog()
        }).catch((err) => {
          this.$emit('ticketFormBackendErrors', err.response.data.message)
        })
      }
    },
    async edit(ticket) {
      this.dialogMode = 'edit'
      await this.showTicket(ticket).then(() => {
        this.openDialog(ticket)
      }).catch((err) => {
        this.$emit('ticketFormBackendErrors', err.response.data.message)
        this.$emit('refreshState')
        this.dialogInitialize()
      })
    },
    async show(ticket) {
      this.dialogMode = 'show'
      await this.showTicket(ticket).then((response) => {
        this.openDialog(response.data)
      }).catch((err) => {
        this.$emit('ticketFormBackendErrors', err.response.data.message)
        this.$emit('refreshState')
        this.dialogInitialize()
      })
    },
    async delete(ticket) {
      await this.deleteTicket(ticket).then(() => {
        this.tickets.splice(this.tickets.indexOf(ticket), 1)
      }).catch((err) => {
        this.$emit('ticketFormBackendErrors', err.response.data.message)
      })
    },
    filteredItem(data) {
      return {
        ...data,
        ticketClients: data.ticketClients.map((item) => item.id),
        ticketOperators: data.ticketOperators.map((item) => item.id),
        ticketStatus: data.ticketStatus.id
      }
    }
  }
}
</script>
