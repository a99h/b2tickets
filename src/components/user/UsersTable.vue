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
              <AppLoading :loading="loading.dataTable" />
              <v-data-table
                v-if="!loading.dataTable"
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
                      v-if="users"
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
    clients: [],
    operators: [],
    userTypes: [
      'clients',
      'operators'
    ],
    filterBy: 'clients'
  }),
  computed: {
    ...mapGetters({
      getOperators: 'operator/getOperators',
      getClients: 'client/getClients'
    }),
    headers() {
      return [
        {
          text: 'ID',
          align: 'start',
          value: 'id'
        },
        { text: this.$t('b2tickets.user.fields.name'), value: 'name' },
        { text: this.$t('b2tickets.user.fields.email'), value: 'email' },
        { text: this.$t('b2tickets.user.fields.userRoles'), value: 'userRoles' },
        { text: this.$t('b2tickets.common.fields.created_at'), value: 'created_at' },
        { text: this.$t('b2tickets.common.fields.updated_at'), value: 'updated_at' },
        { text: '', value: 'actions', sortable: false }
      ]
    },
    users() {
      if (this.filterBy === 'clients') return this.getClients
      if (this.filterBy === 'operators') return this.getOperators

      return this.getOperators
    }
  },
  mounted() {
    this.dataTableInitialize()
  },
  methods: {
    ...mapActions({
      fetchOperators: 'operator/fetchOperators',
      fetchClients: 'client/fetchClients',
      showClient: 'client/showClient',
      showOperator: 'operator/showOperator'
    }),
    async dataTableInitialize() {
      this.loading.dataTable = 'info'

      await this.loadUsers().then(() => {
        this.loading.dataTable = false
      })
    },
    async loadUsers() {
      return Promise.all([this.fetchClients(), this.fetchOperators()])
    },
    onCloseDialog() {
      this.backendErrors = null
    },
    showUser(item) {
      switch (this.filterBy) {

      case 'clients': return this.showClient(item)
      case 'operators': return this.showOperator(item)
      default: return this.showClient(item)

      }
    },
    async showItem(item) {
      this.backendErrors = null

      await this.showUser(item).then((response) => {
        this.$refs.dialog.show(response.data)
      }).catch((err) => {
        this.$refs.dialog.dialogInitialize()
        this.backendErrors = err.response.data.message
      })
    },
    async editItem(item) {
      this.backendErrors = null

      await this.showUser(item).then((response) => {
        this.$refs.dialog.edit(response.data)
      }).catch((err) => {
        this.$refs.dialog.dialogInitialize()
        this.backendErrors = err.response.data.message
      })
    }
  }
}
</script>
