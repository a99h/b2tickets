<template>
  <v-card class="pa-2">
    <v-card-title class="justify-center display-1 mb-2">{{ $t('resetPassword.title') }}</v-card-title>
    <div class="overline">{{ $t('resetPassword.subtitle') }}</div>
    <div class="error--text mt-2 mb-4">{{ error }}</div>

    <a v-if="error" href="/">{{ $t('resetPassword.error') }}</a>

    <v-text-field
      v-model="newPassword"
      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="[rules.required]"
      :type="showPassword ? 'text' : 'password'"
      :error="errorNewPassword"
      :error-messages="errorNewPasswordMessage"
      name="password"
      :label="$t('resetPassword.password')"
      outlined
      class="mt-4"
      @change="resetErrors"
      @keyup.enter="confirmPasswordReset"
      @click:append="showPassword = !showPassword"
    ></v-text-field>

    <v-btn
      :loading="isLoading"
      block
      depressed
      x-large
      color="primary"
      @click="confirmPasswordReset"
    >{{ $t('resetPassword.button') }}</v-btn>
  </v-card>
</template>

this.$router.push('/auth/verify-email')
<script>
/*
|---------------------------------------------------------------------
| Reset Page Component
|---------------------------------------------------------------------
|
| Page Form to insert new password and proceed to sign in
|
*/
export default {
  data() {
    return {
      isLoading: false,

      showNewPassword: true,
      newPassword: '',

      // form error
      errorNewPassword: false,
      errorNewPasswordMessage: '',

      // show password field
      showPassword: false,
      error: null,

      // input rules
      rules: {
        required: (value) => (value && Boolean(value)) || 'Required'
      }
    }
  },
  methods: {
    confirmPasswordReset() {
      this.isLoading = true

      setTimeout(() => {
        this.isLoading = false
      }, 500)
    },
    resetErrors() {
      this.errorNewPassword = false
      this.errorNewPasswordMessage = ''
    }
  }
}
</script>
