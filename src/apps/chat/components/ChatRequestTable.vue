<template>
  <div class="d-flex flex-grow-1">
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
      :headers="headers"
      :items="chatRequests"
      :loading="loading.dataTable"
      :search="search"
      fixed
      sort-by="name"
      class="elevation-1"
      :class="$vuetify.theme.dark ? 'surface' : ''"
      style="min-width: 100%"
    >
      <template v-slot:top>
        <v-toolbar flat class="primary--text">
          <v-toolbar-title>{{ $tc('b2tickets.chat.request.title', 0) }}</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            :label="$t('common.search')"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>
      <template v-slot:item.created_at="{ item }">
        {{ new Date(item.created_at).toLocaleString() }}
      </template>
      <template v-slot:item.updated_at="{ item }">
        {{ new Date(item.updated_at).toLocaleString() }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-chip
          class="ma-2"
          color="success"
          outlined
          @click="addChannel(item)"
        >
          <v-icon left>
            mdi-wechat
          </v-icon>
          {{ $tc('b2tickets.chat.title', 1) }}
        </v-chip>
      </template>
      <template v-slot:no-data>
        <v-btn color="warning" @click="dataTableInitialize">Обновить</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ChatRequestTable',
  data: () => ({
    loading: {
      dataTable: 'info'
    },
    backendErrors: null,
    search: '',
    chatRequests: []
  }),
  computed: {
    ...mapGetters({
      getChatRequests: 'chatRequest/getChatRequests'
    }),
    headers() { return [
      {
        text: 'ID',
        align: 'start',
        value: 'id'
      },
      { text: this.$t('b2tickets.chat.request.fields.client'), value: 'user.email' },
      { text: this.$t('b2tickets.chat.request.fields.message'), value: 'message' },
      { text: this.$t('b2tickets.chat.request.fields.operators_online'), value: 'operators_online' },
      { text: this.$t('b2tickets.common.created_at'), value: 'created_at' },
      { text: this.$t('b2tickets.common.updated_at'), value: 'updated_at' },
      { text: '', value: 'actions', sortable: false }
    ]}
  },
  mounted() {
    this.dataTableInitialize()
  },
  methods: {
    ...mapActions({
      fetchChatRequests: 'chatRequest/fetchChatRequests'
    }),
    async dataTableInitialize() {
      this.loading.dataTable = 'info'

      await this.fetchChatRequests().then(() => {
        this.chatRequests = this.getChatRequests
      })

      this.loading.dataTable = false
      this.backendErrors = null
    },
    addChannel(chatRequest) {
      this.$emit('addChat', chatRequest)
    }
  }
}
</script>
