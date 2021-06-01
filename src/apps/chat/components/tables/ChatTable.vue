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
                {{ backendErrors.message }}
              </v-alert>
              <AppLoading :loading="loading.dataTable"/>
              <v-data-table
                v-if="!loading.dataTable"
                :headers="headers"
                :items="getChats"
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
                    <v-toolbar-title>{{ $tc('b2tickets.chat.title', 0) }}</v-toolbar-title>
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

                    <ChatInfo ref="chatInfo" :activator-hidden="true" :chat="currentItem" />

                  </v-toolbar>
                </template>
                <template v-slot:item.chat_request_id="{ item }">
                  <v-chip
                    class="ma-2"
                    color="success"
                    outlined
                    @click="addChatByChatRequest(item.chat_request_id)"
                  >
                    <v-icon left>
                      mdi-wechat
                    </v-icon>
                    <span v-if="loading.chatBtn === item.chat_request_id">
                      <v-progress-circular indeterminate color="primary" size="20"></v-progress-circular>
                    </span>
                    <span v-else>{{ $tc('b2tickets.chat.title', 1) }}</span>
                  </v-chip>
                </template>
                <template v-slot:item.active="{ item }">
                  <v-icon :color="item.active ? 'primary' : 'error'">mdi-radiobox-marked</v-icon>
                </template>
                <template v-slot:item.updated_at="{ item }">
                  {{ new Date(item.updated_at).toLocaleString() }}
                </template>
                <template v-slot:item.actions="{ item }">
                  <div class="actions">
                    <v-btn
                      :dark="!$vuetify.theme.dark"
                      small
                      width="150"
                      @click="showItem(item)"
                    >
                      <div v-if="loading.chatInfo === item.id" class="mx-auto">
                        <v-progress-circular indeterminate color="primary" size="20" class="flex-grow-0 flex-shrink-0"></v-progress-circular>
                      </div>
                      <span v-if="loading.chatInfo !== item.id">{{ $t('b2tickets.chat.form.show') }}</span>
                    </v-btn>
                  </div>
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
import ChatInfo from '@/apps/chat/components/ChatInfo/ChatInfo'
import { showChatRequest } from '@/apps/chat/js/http/chatRequest'

export default {
  name: 'ChatsTable',
  components: { ChatInfo },
  data: () => ({
    loading: {
      dataTable: 'info',
      chatBtn: -1,
      chatInfo: -1
    },
    backendErrors: null,
    search: '',
    currentItem: {}
  }),
  computed: {
    ...mapGetters({
      getChats: 'chat/getChats'
    }),
    headers() { return [
      { text: 'ID', value: 'id', align: 'start' },
      { text: this.$t('b2tickets.chat.actions.enter'), value: 'chat_request_id', sortable: false },
      { text: this.$t('b2tickets.chat.fields.client'), value: 'chatClient.email' },
      { text: this.$t('b2tickets.chat.fields.active'), value: 'active' },
      { text: this.$t('b2tickets.common.fields.updated_at'), value: 'updated_at' },
      { text: '', value: 'actions', sortable: false }
    ]}
  },
  mounted() {
    this.dataTableInitialize()
  },
  methods: {
    ...mapActions({
      fetchChats: 'chat/fetchChats'
    }),
    async dataTableInitialize() {
      this.loading.dataTable = 'info'

      await this.fetchChats().then(() => {
        this.loading.dataTable = false
      })
    },
    onCloseDialog() {
      this.backendErrors = null
    },
    showItem(item) {
      this.loading.chatInfo = item.id
      showChatRequest(item.chat_request_id).then((res) => {
        this.currentItem = { ...item, chatRequest: res.data }

        this.loading.chatInfo = -1
        this.$refs.chatInfo.dialog = true
      }).catch(() => {
        this.loading.chatInfo = -1
      })
    },
    addChatByChatRequest(chatRequestId) {
      this.loading.chatBtn = chatRequestId
      showChatRequest(chatRequestId).then((res) => {
        this.$emit('add-chat', {
          chatRequest: res.data,
          channelName: res.data.channel_name
        })

        this.loading.chatBtn = -1
      }).catch((err) => {
        this.backendErrors = err.response.data.message
      })
    }
  }
}
</script>
