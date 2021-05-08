<template>
  <v-dialog v-model="dialog" max-width="1000px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="primary"
        class="mb-2"
        v-bind="attrs"
        v-on="on"
      >{{ $t('b2tickets.user.actions.createUser') }}</v-btn>
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
            <section v-if="dialogMode === 'show'">
              <v-text-field
                v-model="editedItem.name"
                :label="$t('b2tickets.user.fields.name')"
              ></v-text-field>
              <v-text-field
                v-model="editedItem.email"
                :label="$t('b2tickets.user.fields.email')"
              ></v-text-field>
            </section>
            <section v-if="dialogMode === 'create' || dialogMode === 'edit'">
              <v-text-field
                v-model="editedItem.name"
                :label="$t('b2tickets.user.fields.name')"
                :error="error"
                :error-messages="nameErrors"
                @input="$v.editedItem.name.$touch()"
                @blur="$v.editedItem.name.$touch()"
              ></v-text-field>
              <v-text-field
                v-model="editedItem.email"
                :label="$t('b2tickets.user.fields.email')"
                :error="error"
                :error-messages="emailErrors"
                @input="$v.editedItem.email.$touch()"
                @blur="$v.editedItem.email.$touch()"
              ></v-text-field>
              <v-text-field
                v-model="editedItem.password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                :label="$t('b2tickets.user.fields.password')"
                :error="error"
                :error-messages="passwordErrors"
                @input="$v.editedItem.password.$touch()"
                @blur="$v.editedItem.password.$touch()"
                @click:append="showPassword = !showPassword"
              ></v-text-field>
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
import { required, minLength, email } from 'vuelidate/lib/validators'

export default {
  name: 'UserForm',
  props: {
    users: {
      type: Array,
      default: () => ({})
    }
  },
  validations: {
    editedItem: {
      name: { required },
      email: { email },
      password: { minLength: minLength(8) }
    }
  },
  data: () => ({
    dialog: false,
    dialogMode: 'create',
    error: false,
    loading: {
      dialogForm: 'accent'
    },
    editedIndex: -1,
    editedItem: {
      name: '',
      email: ''
    },
    defaultItem: {
      name: '',
      email: '',
      password: ''
    },
    showPassword: false
  }),
  computed: {
    formTitle() {
      let title = ''

      switch (this.dialogMode) {
      case 'show': title = this.$t('b2tickets.user.actions.showUser'); break
      case 'create': title = this.$t('b2tickets.user.actions.createUser'); break
      case 'edit': title = this.$t('b2tickets.user.actions.editUser'); break
      }

      return title
    },
    loadingLabel() {
      if (this.loading.dialogForm === 'accent') return this.$t('b2tickets.common.loading'); else return this.$t('b2tickets.common.select')
    },
    nameErrors () {
      const errors = []

      if (!this.$v.editedItem.name.$dirty) return errors
      !this.$v.editedItem.name.required && errors.push('Name field is required')

      return errors
    },
    passwordErrors () {
      const errors = []

      if (!this.$v.editedItem.password.$dirty) return errors
      !this.$v.editedItem.password.minLength && errors.push('Password must be at least 8 characters long')
      this.dialogMode === 'create' ? !this.$v.editedItem.password.required && errors.push('Password is required.') : ''

      return errors
    },
    emailErrors () {
      const errors = []

      if (!this.$v.editedItem.email.$dirty) return errors
      !this.$v.editedItem.email.email && errors.push('Must be valid e-mail')
      !this.$v.editedItem.email.required && errors.push('E-mail is required')

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
      createUser: 'operator/storeUser',
      updateOperator: 'operator/updateOperator'
    }),
    async dialogInitialize() {
      this.loading.dialogForm = 'accent'

      //fetch data here

      this.loading.dialogForm = false
    },
    openDialog(item) {
      this.editedIndex = item.id
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    closeDialog() {
      this.$emit('userFormBackendErrors', null)
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
        this.saveUser()
      }
    },
    async saveUser() {
      if (this.editedIndex > -1) {
        await this.updateOperator(this.editedItem).then(() => {
          this.closeDialog()
        })
      } else {
        await this.createUser(this.editedItem).then(() => {
          this.closeDialog()
        }).catch((err) => {
          this.$emit('userFormBackendErrors', err.response.data.message)
          this.$emit('refreshState')
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
    resetErrors() {
      this.error = false
      this.backendErrors = false
    }
  }
}
</script>
