<template>
  <div class="my-2">
    <div>
      <v-card
        v-if="!userEnabled"
        class="warning mb-4"
        light
      >
        <v-card-title>{{ $t('b2tickets.user.pages.editUser.userDisabled') }}</v-card-title>
        <v-card-subtitle>
          {{ $t('b2tickets.user.pages.editUser.thisUserDisable') }}
        </v-card-subtitle>
        <v-card-text>
          <v-btn dark @click="userEnabled = true">
            <v-icon left small>mdi-account-check</v-icon>{{ $t('b2tickets.user.pages.editUser.userEnable') }}
          </v-btn>
        </v-card-text>
      </v-card>
      <v-card>
        <v-card-title>{{ $t('b2tickets.user.pages.editUser.info') }}</v-card-title>
        <v-card-text>
          <div class="d-flex flex-column flex-sm-row">
            <div>
              <v-img
                :src="getUser.userSettings.avatar"
                aspect-ratio="1"
                class="blue-grey lighten-4 rounded elevation-3"
                max-width="100"
                max-height="100"
              ></v-img>
              <v-btn
                class="mt-1"
                small
                max-width="100"
                @click="Avatar = true"
              >{{ $t('b2tickets.user.pages.editUser.editAvatar') }}
              </v-btn>
            </div>
            <div class="flex-grow-1 pt-2 pa-sm-2">
              <v-text-field
                v-model="user.name"
                :label=" $t('b2tickets.user.fields.name') "
                placeholder="Name"
              ></v-text-field>
              <v-text-field
                v-model="user.email"
                :label=" $t('b2tickets.user.fields.email') "
                hide-details
              ></v-text-field>
              <div class="mt-2">
                <v-btn color="primary" @click>{{ $t('common.save') }}</v-btn>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <v-expansion-panels v-model="panel" multiple class="mt-3">
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
                  v-if="!userEnabled"
                  color="warning"
                  @click="userEnabled = true"
                >
                  <v-icon left small>mdi-account-check</v-icon> {{ $t('b2tickets.user.pages.editUser.userEnable') }}
                </v-btn>
                <v-btn v-else color="warning" @click="disableDialog = true">
                  <v-icon left small>mdi-cancel</v-icon>{{ $t('b2tickets.user.pages.editUser.userDisable') }}
                </v-btn>
              </div>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header
            class="title"
          >{{ $t('b2tickets.user.pages.editUser.metadata') }}
          </v-expansion-panel-header>
          <v-expansion-panel-content class="body-2">
            <span class="font-weight-bold">{{ $t('b2tickets.common.created_at') }}</span>
            {{ user.created_at | formatDate("lll") }}
            <br />
            <span class="font-weight-bold">{{ $t('b2tickets.common.updated_at') }}</span>
            {{ user.updated_at | formatDate("lll") }}
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>

    <!-- disable modal -->
    <v-dialog v-model="disableDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">{{ $t('b2tickets.user.pages.editUser.userDisable') }}</v-card-title>
        <v-card-text>{{ $t('b2tickets.user.pages.editUser.userDisableConfirm') }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="disableDialog = false ">{{ $t('common.cancel') }}</v-btn>
          <v-btn color="warning" @click="userEnabled = false; disableDialog = false;">{{ $t('common.disable') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- avatar modal -->
    <v-dialog v-model="Avatar" max-width="500">
      <v-card>
        <v-card-title class="headline">{{ $t('b2tickets.user.pages.editUser.avatar') }}</v-card-title>
        <v-item-group>
          <v-row no-gutters>
            <v-col v-for="(item, inx) in items" :key="inx" cols="3">
              <v-item v-slot="{ toggle }">
                <v-img
                  :src="item"
                  height="130"
                  class="text-right pa-4"
                  @click="toggle"
                >
                </v-img>
              </v-item>
            </v-col>
          </v-row>
        </v-item-group>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="Avatar = false">{{ $t('common.cancel') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- delete modal -->
    <v-dialog v-model="deleteDialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Delete User</v-card-title>
        <v-card-text>Are you sure you want to delete this user?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="deleteDialog = false">{{ $t('common.cancel') }}</v-btn>
          <v-btn color="error" @click="deleteDialog = false">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { parseZone } from 'moment'
import { computed } from 'vue'
import { avatars }  from './avatars'
export default {
  data() {
    return {
      user: '',
      userEnabled: true,
      panel: [2],
      avatarPicker: false,
      deleteDialog: false,
      disableDialog: false,
      Avatar: false,
      isLoading: false,
      items: false,

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
    ...mapGetters({ getUser: 'auth/getUser' }),
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
  mounted() {
    this.user = this.getUser
    this.items = avatars
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
