<template>
  <div>
    <v-card class="text-center pa-1">
      <v-card-title class="justify-center display-1 mb-2">{{ $t('common.welcome') }}</v-card-title>
      <v-card-subtitle>{{ $t('login.title') }}</v-card-subtitle>

      <!-- sign in form -->
      <v-card-text>
        <v-form ref="form" v-model="isFormValid" lazy-validation>
          <v-text-field
            v-model="credentials.email"
            :rules="[rules.required]"
            :validate-on-blur="false"
            :error="error"
            :error-messages="emailErrors"
            :label="$t('login.email')"
            name="email"
            outlined
            @keyup.enter="submit"
            @change="resetErrors"
            @input="$v.credentials.email.$touch()"
            @blur="$v.credentials.email.$touch()"
          ></v-text-field>

          <v-text-field
            v-model="credentials.password"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            :error="error"
            :error-messages="passwordErrors"
            :label="$t('login.password')"
            name="password"
            outlined
            @change="resetErrors"
            @keyup.enter="submit"
            @input="$v.credentials.password.$touch()"
            @blur="$v.credentials.password.$touch()"
            @click:append="showPassword = !showPassword"
          ></v-text-field>

          <v-btn
            :loading="isLoading"
            :disabled="isSignInDisabled"
            block
            x-large
            color="primary"
            @click="submit"
          >{{ $t('login.button') }}</v-btn>

          <div class="mt-5 d-none">
            <router-link to="/auth/forgot-password">
              {{ $t('login.forgot') }}
            </router-link>
          </div>
        </v-form>
      </v-card-text>

    </v-card>
    <div v-if="backendErrors">

    </div>
    <v-alert
      v-for="backendError in backendErrors"
      :key="backendError"
      border="left"
      color="error"
      dark
      class="mt-2"
      dismissible
      outlined
      type="error"
    >{{ backendError }}</v-alert>
  </div>
</template>

<script>
/*
|---------------------------------------------------------------------
| Sign In Page Component
|---------------------------------------------------------------------
|
| Sign in template for user authentication into the application
|
*/
import { email, minLength, required } from 'vuelidate/lib/validators'
import { mapActions, mapGetters } from 'vuex'

export default {
  validations: {
    credentials: {
      email: { required, email },
      password: { required, minLength: minLength(8) }
    }
  },
  data() {
    return {
      // sign in buttons
      isLoading: false,
      isSignInDisabled: false,

      // form
      isFormValid: true,
      email: '',
      password: '',
      credentials: {
        email: '',
        password: ''
      },

      // form error
      error: false,
      errorMessages: '',
      backendErrors: [],

      errorProvider: false,
      errorProviderMessages: '',

      // show password field
      showPassword: false,

      // input rules
      rules: {
        required: (value) => (value && Boolean(value)) || 'Required'
      }
    }
  },
  computed: {
    ...mapGetters({
      getUser: 'auth/getUser'
    }),
    passwordErrors () {
      const errors = []

      if (!this.$v.credentials.password.$dirty) return errors
      !this.$v.credentials.password.minLength && errors.push('Password must be at least 8 characters long')
      !this.$v.credentials.password.required && errors.push('Password is required.')

      return errors
    },
    emailErrors () {
      const errors = []

      if (!this.$v.credentials.email.$dirty) return errors
      !this.$v.credentials.email.email && errors.push('Must be valid e-mail')
      !this.$v.credentials.email.required && errors.push('E-mail is required')

      return errors
    }
  },
  methods: {
    ...mapActions({
      login: 'auth/signIn'
    }),
    submit() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.backendErrors = []
        this.isLoading = true
        this.isSignInDisabled = true
        this.signIn().then(() => {
          this.isLoading = false
          this.isSignInDisabled = false
        })
      }
    },
    async signIn() {
      await this.login(this.credentials).then(() => {
        this.isSignInDisabled = false
        // Redirect home.
        this.$router.push({ name: 'home' })
      }).catch ((err) => {
        const errorMessages = Object.values(err.response.data.errors)

        for (const key in errorMessages) {
          errorMessages[key].forEach((errorMessage) => {
            this.backendErrors.push(errorMessage)
          })
        }
      })
    },
    resetErrors() {
      this.error = false
      this.errorMessages = ''

      this.errorProvider = false
      this.errorProviderMessages = ''
    }
  }
}
</script>
