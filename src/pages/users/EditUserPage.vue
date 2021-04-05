<template>
  <div class="flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">{{ $t('b2tickets.user.actions.editUser') }} {{ user.name && `- ${user.name}` }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
      <v-spacer></v-spacer>
      <v-btn icon @click>
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </div>

    <div
      v-for="(role, inx) in user.userRoles"
      :key="inx"
      class="d-flex align-center font-weight-bold primary--text my-2"
    >

      <v-icon color="primary">{{ getIconByRoleName(role.name) }}</v-icon>
      <span class="ma-1"> {{ $t('b2tickets.user.role.' + role.name) }} </span>
    </div>

    <div class="mb-4">
      <div class="d-flex">
        <span class="font-weight-bold">{{ $t('b2tickets.user.fields.email') }}</span>
        <span class="mx-1">
          <copy-label :text="user.email" />
        </span>
      </div>
      <div class="d-flex">
        <span class="font-weight-bold">ID</span>
        <span class="mx-1">
          <copy-label :text="user.id + ''" />
        </span>
      </div>
    </div>

    <v-tabs v-model="tab" :show-arrows="false" background-color="transparent">
      <v-tab to="#tabs-account">{{ $t('menu.account') }}</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item value="tabs-account">

        <v-container>

          <v-card
            v-if="!userEnabled"
            class="warning mb-4"
          >
            <v-card-title>{{ $t('b2tickets.user.pages.editUser.userDisabled') }}</v-card-title>
            <v-card-subtitle>
              {{ $t('b2tickets.user.pages.editUser.thisUserDisable') }}
            </v-card-subtitle>
            <v-card-actions>
              <v-btn @click="userEnabled = true" color="success">
                <v-icon left small>mdi-account-check</v-icon>{{ $t('b2tickets.user.pages.editUser.userEnable') }}
              </v-btn>
            </v-card-actions>
          </v-card>

          <accountCard :user="user" />

          <v-expansion-panels v-model="panel" multiple class="mt-3">

            <UserActionsTab :user="user" />
            <UserMetaTab :user="user"/>

          </v-expansion-panels>

        </v-container>

      </v-tab-item>

      <v-tab-item value="tabs-information">
        <information-tab :user="user"></information-tab>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import CopyLabel from '../../components/common/CopyLabel'
import AccountCard from '@/components/user/AccountCard'
import UserMetaTab from '@/components/tabs/UserMetaTab'
import UserActionsTab from '@/components/tabs/UserActionsTab'

export default {
  components: {
    CopyLabel,
    AccountCard,
    UserMetaTab,
    UserActionsTab
  },
  data() {
    return {
      panel: [0],
      user: {},
      userEnabled: false,
      userRoles: true,
      tab: null,
      getIconFromRoleName: true,
      breadcrumbs: [
        {
          text: 'Users',
          to: '/users/list',
          exact: true
        },
        {
          text: 'Edit User'
        }
      ]
    }
  },
  computed: {
    ...mapGetters ({
      getUser: 'auth/getUser'
    })
  },
  mounted() {
    this.user = this.getUser
  },
  methods: {
    getIconByRoleName (role) {
      switch (role) {
      case 'operator':
        return 'mdi-account'

      case 'ADMIN':
        return 'mdi-security'

      default:
        return ''
      }
    }
  }
}
</script>
