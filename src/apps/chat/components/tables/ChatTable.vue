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
              <v-data-table
                :headers="headers"
                :items="chats"
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

                    <ChatInfo ref="chatInfo" :activator-hidden="true" :chat="currentItem"></ChatInfo>

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
                    <span v-if="loading.chatBtn === item.id">
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
                      :disabled="$refs.chatInfo.dialogLoader"
                      @click="showItem(item)"
                    >
                      {{ $t('b2tickets.chat.form.show') }}
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
import ChatForm from '@/apps/chat/components/ChatForm'
import ChatInfo from '@/apps/chat/components/ChatInfo/ChatInfo'
import { showChat } from '@/apps/chat/js/http/chat'
import { showChatRequest } from '@/apps/chat/js/http/chatRequest'
import ChatRequest from '@/apps/chat/js/models/ChatRequest'

export default {
  name: 'Chats',
  components: { ChatInfo },
  data: () => ({
    loading: {
      dataTable: 'info',
      chatBtn: -1
    },
    backendErrors: null,
    search: '',
    chats: [],
    currentItem: {}
  }),
  computed: {
    ...mapGetters({
      getChats: 'chat/getChats'
    }),
    headers() { return [
      {
        text: 'ID',
        align: 'start',
        value: 'id'
      },
      {
        text: this.$t('b2tickets.chat.actions.enter'),
        value: 'chat_request_id'
      },
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
        this.chats = this.getChats
      })

      this.loading.dataTable = false
      this.backendErrors = null
    },
    onCloseDialog() {
      this.backendErrors = null
    },
    showItem(item) {
      const chat = this.chats[this.chats.indexOf(item)]

      showChatRequest(chat.chat_request_id).then((res) => {
        this.currentItem = { ...chat, chatRequest: res.data }

        this.$refs.chatInfo.dialogLoader = true
      })
    },
    async editItem(item) {
      this.backendErrors = null
      await showChat(item.id).then((response) => {
        Object.assign(this.chats[this.chats.indexOf(item)], response.data)
        this.$refs.dialog.edit(this.chats[this.chats.indexOf(item)])
      }).catch((err) => {
        this.$refs.dialog.dialogInitialize()
        this.backendErrors = err.response.data.message
      })
    },
    addChatByChatRequest(chatRequestId) {
      showChatRequest(chatRequestId).then((res) => {
        this.emitAddChatEvent(res.data)
      }).catch((err) => {
        this.backendErrors = err.response.data.message
      })
    },
    emitAddChatEvent(chatRequest) {
      this.loading.chatBtn = chatRequest.id

      const data = {
        chatRequest: chatRequest,
        channelName: chatRequest.channel_name
      }

      this.$emit('add-chat', data)
    },
    async setChatRequest() {
      await showChatRequest(this.chat.chat_request_id).then((res) => {
        this.chatRequest = res.data
      }).catch(() => {
      })
    }
  }
}
</script>
