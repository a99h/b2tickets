<template>
  <v-expansion-panel>
    <v-expansion-panel-header
      class="title"
    >{{ $tc('b2tickets.common.action', 0) }}
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <div class="mb-2">
        <div class="title"> {{ $t('b2tickets.user.pages.editUser.changePassword') }} </div>
        <div class="flex-grow-1 pt-2 pa-sm-2">
          <v-text-field
            v-model="user.password"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            :label="$t('check.oldPassword')"
            hide-details
            @click:append="showPassword = !showPassword"
          ></v-text-field>
          <v-text-field
            v-model="newPassword"
            :rules="[rules.required]"
            :error="errorNewPassword"
            :error-messages="errorNewPasswordMessage"
            name="newPassword"
            :label="$t('check.newpassword')"
            hide-details
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            @change="resetErrors"
            @click:append="showPassword = !showPassword"
          ></v-text-field>
          <v-text-field
            v-model="confPassword"
            :rules="[rules.required]"
            :error="errorNewPassword"
            :error-messages="errorNewPasswordMessage"
            name="newPassword"
            :label="$t('check.confpassword')"
            hide-details
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            @change="resetErrors"
            @keyup.enter="confirmPasswordReset"
            @click:append="showPassword = !showPassword"
          ></v-text-field>
        </div>
        <div class="subtitle mb-2"></div>
        <div>
          <v-btn color="primary" class="mb-2" @click>
            {{ $t('b2tickets.user.pages.editUser.changePassword') }}
          </v-btn>
        </div>
      </div>

      <v-divider></v-divider>
      <v-divider></v-divider>

      <div class="my-2">
        <div id="wrapper">
          <div v-if="false" class="error--text title">Danger Zone</div>
          <div class="subtitle mb-2">
            {{ $t('b2tickets.user.pages.editUser.setUserText') }}
          </div>
        </div>

        <div class="my-2">
          <v-btn
            v-if="user.role === 'ADMIN'"
            color="primary"
            @click="user.role = 'USER'"
          >
            <v-icon left small>mdi-security</v-icon>{{ $t('b2tickets.user.pages.editUser.setUser') }}
          </v-btn>
          <v-btn v-else color="primary" @click="user.role = 'ADMIN'">
            <v-icon left small>mdi-security</v-icon>{{ $t('b2tickets.user.pages.editUser.setUserAdmin') }}
          </v-btn>
        </div>

        <v-divider></v-divider>

        <div class="subtitle mt-3 mb-2">
          {{ $t('b2tickets.user.pages.editUser.disableUserText') }}
        </div>
        <div class="my-2">
          <v-btn
            color="warning"
            @click=""
          >
            <v-icon left small>mdi-account-check</v-icon> {{ $t('b2tickets.user.pages.editUser.userEnable') }}
          </v-btn>
          <v-btn color="warning" @click="disableDialog = true">
            <v-icon left small>mdi-cancel</v-icon>{{ $t('b2tickets.user.pages.editUser.userDisable') }}
          </v-btn>
        </div>
      </div>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  name: 'UserActionsTab',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      panel: [1],
      showNewPassword: false,
      newPassword: '',
      confPassword: '',
      // form error
      errorNewPassword: false,
      errorNewPasswordMessage: '',

      // show password field
      showPassword: false,
      error: null,

      // input rules
      rules: {
        required: (value) => (value && Boolean(value)) || 'Required'
      },
      password: {
        old_password: '',
        new_password: '',
        repeat_password: ''
      }
    }
  },
  computed: {
    currentLocale() {
      return this.$i18n.locales.find((i) => i.code === this.$i18n.locale)
    },
    availableLocales () {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale)
    }
  },
  watch: {
    repeatedPassword: 'checkPasswordsEquality',
    createPassword: 'checkPasswordsEquality'
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
    },
    setLocale(locale) {
      this.$i18n.locale = locale
      this.$vuetify.lang.current = locale

      // example on how certain languages can be RTL
      if (locale === 'ar') {
        this.$vuetify.rtl = true
      } else {
        this.$vuetify.rtl = false
      }
    }
  }
}
</script>

<style scoped>

</style>