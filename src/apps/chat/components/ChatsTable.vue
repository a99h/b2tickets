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
                    <ChatForm
                      ref="dialog"
                      :tickets="chats"
                      :activator-hidden="true"
                      @closeDialog="onCloseDialog"
                      @ticketFormBackendErrors="(err) => backendErrors = err"
                      @refreshState="dataTableInitialize"
                    ></ChatForm>
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
                <template v-slot:item.created_at="{ item }">
                  {{ new Date(item.created_at).toLocaleString() }}
                </template>
                <template v-slot:item.updated_at="{ item }">
                  {{ new Date(item.updated_at).toLocaleString() }}
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-icon
                    small
                    class="mr-2"
                    @click="showItem(item.id)"
                  >
                    mdi-eye
                  </v-icon>
                  <v-icon
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
import ChatForm from '@/apps/chat/components/ChatForm'
import { showChat } from '@/apps/chat/http/chat'
import { showChatRequest } from '@/apps/chat/http/chatRequest'

export default {
  name: 'Chats',
  components: { ChatForm },
  data: () => ({
    loading: {
      dataTable: 'info',
      chatBtn: -1
    },
    backendErrors: null,
    search: '',
    chats: []
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
      { text: this.$t('b2tickets.chat.fields.client'), value: 'client.email' },
      { text: this.$t('b2tickets.chat.fields.active'), value: 'active' },
      { text: this.$t('b2tickets.common.updated_at'), value: 'updated_at' },
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
    async showItem(item) {
      this.backendErrors = null
      await showChat(item).then((response) => {
        this.$refs.dialog.show(response.data)
      }).catch((err) => {
        this.$refs.dialog.dialogInitialize()
        this.backendErrors = err.response.data
        console.log(this.backendErrors)
      })
    },
    async editItem(item) {
      this.backendErrors = null
      await showChat(item).then((response) => {
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
    }
  }
}
</script>
