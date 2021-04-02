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
                {{ backendErrors }}
              </v-alert>
              <v-data-table
                v-model="users"
                :headers="headers"
                :items="users"
                :loading="loading.dataTable"
                :search="search"
                fixed
                sort-by="email"
                class="elevation-1"
                :class="$vuetify.theme.dark ? 'surface' : ''"
                style="min-width: 100%"
              >
                <template v-slot:top>
                  <v-toolbar flat class="primary--text">
                    <v-toolbar-title>{{ $tc('b2tickets.user.title', 0) }}</v-toolbar-title>
                    <v-divider
                      class="mx-4"
                      inset
                      vertical
                    ></v-divider>
                    <v-select
                      v-model="filterBy"
                      background-color="surface"
                      dense
                      flat
                      solo-inverted
                      hide-details
                      :items="userTypes"
                      value="email"
                      :label="$t('b2tickets.user.actions.selectType')"
                      @input="dataTableInitialize"
                    ></v-select>
                    <v-spacer></v-spacer>
                    <v-text-field
                      v-model="search"
                      append-icon="mdi-magnify"
                      :label="$t('common.search')"
                      single-line
                      hide-details
                    ></v-text-field>
                    <v-spacer></v-spacer>
                    <UserForm
                      ref="dialog"
                      :users="users"
                      @closeDialog="onCloseDialog"
                      @userFormBackendErrors="(err) => backendErrors = err"
                      @refreshState="dataTableInitialize"
                    ></UserForm>
                  </v-toolbar>
                </template>
                <template v-slot:item.created_at="{ item }">
                  {{ new Date(item.created_at).toLocaleString() }}
                </template>
                <template v-slot:item.updated_at="{ item }">
                  {{ new Date(item.updated_at).toLocaleString() }}
                </template>
                <template v-slot:item.userRoles="{ item }">
                  <v-chip
                    v-for="role in item.userRoles"
                    :key="role.id"
                    small
                    color="success"
                  >{{ role.name }}
                  </v-chip>
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
                    v-if="filterBy === 'operators'"
                    small
                    class="mr-2"
                    @click="editItem(item)"
                  >
                    mdi-pencil
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
import UserForm from './UserForm'

export default {
  name: 'UsersTable',
  components: { UserForm },
  data: () => ({
    loading: {
      dataTable: 'info'
    },
    backendErrors: null,
    search: '',
    users: [],
    userTypes: [
      'clients',
      'operators'
    ],
    filterBy: 'operators'
  }),
  computed: {
    ...mapGetters({
      getOperators: 'user/getOperators',
      getClients: 'client/getClients'
    }),
    headers() { return [
      {
        text: 'ID',
        align: 'start',
        value: 'id'
      },
      { text: this.$t('b2tickets.user.fields.name'), value: 'name' },
      { text: this.$t('b2tickets.user.fields.email'), value: 'email' },
      { text: this.$t('b2tickets.user.fields.userRoles'), value: 'userRoles' },
      { text: this.$t('b2tickets.common.created_at'), value: 'created_at' },
      { text: this.$t('b2tickets.common.updated_at'), value: 'updated_at' },
      { text: '', value: 'actions', sortable: false }
    ]}
  },
  watch: {
    filterBy(val) {
      this.loadUsers(val)
    }
  },
  mounted() {
    this.dataTableInitialize(this.filterBy)
  },
  methods: {
    ...mapActions({
      fetchOperators: 'user/fetchOperators',
      fetchClients: 'client/fetchClients',
      showClient: 'client/showClient',
      showUser: 'user/showUser'
    }),
    async dataTableInitialize(type) {
      this.loading.dataTable = 'info'

      await this.loadUsers(type).then(() => {
        this.loading.dataTable = false
        this.backendErrors = null
      })
    },
    async loadUsers(type) {
      switch (type) {
      case 'clients': await this.fetchClients().then(() => {
        this.users = this.getClients
      }); break
      case 'operators': await this.fetchOperators().then(() => {
        this.users = this.getOperators
      }); break
      }
    },
    onCloseDialog() {
      this.backendErrors = null
    },
    async showItem(item) {
      this.backendErrors = null
      switch (this.filterBy) {
      case 'clients':
        await this.showClient(item).then((response) => {
          this.$refs.dialog.show(response.data)
        }).catch((err) => {
          this.$refs.dialog.dialogInitialize()
          this.backendErrors = err.response.data.message
        }); break
      case 'operators':
        await this.showUser(item).then((response) => {
          this.$refs.dialog.show(response.data)
        }).catch((err) => {
          this.$refs.dialog.dialogInitialize()
          this.backendErrors = err.response.data.message
        }); break
      }
    },
    async editItem(item) {
      this.backendErrors = null
      switch (this.filterBy) {
      case 'clients':
        await this.showClient(item).then((response) => {
          Object.assign(this.users[this.users.indexOf(item)], response.data)
          this.$refs.dialog.edit(this.users[this.users.indexOf(item)])
        }).catch((err) => {
          this.$refs.dialog.dialogInitialize()
          this.backendErrors = err.response.data.message
        }); break
      case 'operators':
        await this.showUser(item).then((response) => {
          Object.assign(this.users[this.users.indexOf(item)], response.data)
          this.$refs.dialog.edit(this.users[this.users.indexOf(item)])
        }).catch((err) => {
          this.$refs.dialog.dialogInitialize()
          this.backendErrors = err.response.data.message
        }); break
      }
    }
  }
}
</script>
