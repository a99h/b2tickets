<template>
  <div class="text-center">
    <v-dialog
      v-model="dialogLoader"
      persistent
      :width="300"
      transition="scale-transition"
    >
      <v-card
        v-if="loadingDialog"
        color="surface"
      >
        <v-card-text>
          {{ $t('b2tickets.common.loading') }}
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text> 
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialog"
      persistent
      fullscreen
      transition="scale-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="dialog = false"
          >
            <v-icon x-large>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ $t('b2tickets.chat.form.show') }}</v-toolbar-title>
        </v-toolbar>

        <v-row class="surface ma-0">

          <v-col cols="6">
            <v-sheet class="pa-3 primary">

              <InfoActionsCard :chat-id="chat.id" :channel-name="chat.chatRequest.channel_name" @close-dialog="dialog = false"/>

              <AccountCard :user="chat.chatClient"/>

              <v-expansion-panels v-model="panel" multiple class="mt-3">

                <UserMetaTab :user="chat.chatClient"/>

                <ChatMetaTab :chat="chat"/>

              </v-expansion-panels>
            </v-sheet>
          </v-col>

          <v-col cols="6">
            <v-sheet class="pa-3 primary">
              <v-card style="height: 100%">
                <v-progress-linear
                  v-if="loadingMessages"
                  color="deep-purple accent-4"
                  indeterminate
                  rounded
                  height="6"
                ></v-progress-linear>
                <div v-if="!loadingMessages" class="channel-page">
                  <div id="messages" ref="messages" class="messages px-2">
                    <transition-group name="list">

                      <ChannelMessage
                        v-for="message in chatInstance.messages"
                        :key="message.id"
                        v-model="chatInstance.messages"
                        :message="message"
                        :user="chatInstance.user"
                        class="my-3 d-flex"
                        :loading="loadingMessages"
                      />

                    </transition-group>
                  </div>
                  <div class="input-box pa-2">
                    <InputBox />
                  </div>
                </div>
              </v-card>
            </v-sheet>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import AccountCard from '@/components/user/AccountCard'
import InfoActionsCard from '@/apps/chat/components/ChatInfo/InfoActionsCard'
import UserMetaTab from '@/components/user/tabs/UserMetaTab'
import ChatMetaTab from '@/apps/chat/components/tabs/ChatMetaTab'
import ChannelMessage from '@/apps/chat/components/ChannelMessage'
import { mapActions, mapGetters } from 'vuex'
import ClientsChat from '@/apps/chat/classes/ClientsChat'
import { showChatRequest } from '@/apps/chat/http/chatRequest'
import InputBox from '@/apps/chat/components/InputBox'

export default {
  name: 'ChatInfo',
  components: {
    AccountCard,
    InfoActionsCard,
    ChannelMessage,
    ChatMetaTab,
    UserMetaTab,
    InputBox
  },
  props: {
    activatorHidden: {
      type: Boolean,
      required: false
    },
    chat: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      panel: [0,1],
      dialog: false,
      dialogLoader: false,
      loadingDialog: false,
      loadingMessages: false,
      loadingTickets: true,
      notifications: false,
      sound: true,
      widgets: false,
      chatInstance: {},
      backendErrors: [],
      chatRequest: {}
    }
  },
  computed: {
    ...mapGetters({
      whoAmI: 'auth/getUser'
    })
  },
  watch: {
    dialogLoader (val) {
      if (!val) return

      this.initialize()
      this.dialog = true
    },
    dialog (val) {
      if (val) return

      this.dialogLoader = val
    },
    loadingDialog (val) {
      if (val) return

      console.log(this.chat)

      this.dialog = true
    }
  },
  mounted() {
    // this.initialize()
    console.log(this.chat)
  },
  methods: {
    ...mapActions({
      getMessages: 'message/fetchMessages'
    }),
    initialize() {
      this.loadingDialog = true

      this.fetchChatRequest(this.chat.chat_request_id).then(() => {
        this.createChat({
          chatRequest: this.chatRequest,
          channelName: this.chatRequest.channelName,
          user: this.whoAmI
        })
        this.loadingDialog = false
      }).catch(() => {
        this.loadingDialog = false
      })
    },
    createChat(options) {
      this.chatInstance = new ClientsChat(options)
    },
    async fetchChatRequest(chat_request_id) {
      await showChatRequest(chat_request_id).then((res) => {
        this.chatRequest = res.data
      }).catch((e) => {
        this.backendErrors.push(e)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.row {
  height: calc(100vh - 64px);
}

.primary {
  height: 100%;
}

// List Transition Animation
.list-enter-active {
  transition: all 0.3s;
}

.list-move {
  transition: transform 0.3s;
}

.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
// -- End List Transition Animation

.channel-page {
  height: 100%;
  display: grid;
  grid-template: "messages" "input-box";
  grid-template-rows: 1fr auto;

  .messages {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}

.theme--dark {
  .channel-page {
    background: none;
  }
}
</style>
