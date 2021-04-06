<template>
  <!--  &lt;!&ndash; Related tickets, enter chat button &ndash;&gt;-->
  <!--  <ChatInfoActions />-->

  <!--  &lt;!&ndash; id, Created, updated, active &ndash;&gt;-->
  <!--  <ChatMetaData />-->

  <!--  &lt;!&ndash; id, created, channel_name &ndash;&gt;-->
  <!--  <ChatRequestMetaData />-->
  <div class="text-center" style="max-height: 80vh">
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

        <v-row class="surface">
          <v-col cols="8">
            <v-container>
              <!-- id, Avatar, Name, email, app id, created_at -->
              <v-sheet class="px-3 py-3 primary">

                <AccountCard :user="chat.chatClient"/>

                <v-expansion-panels v-model="panel" multiple class="mt-3">

                  <UserMetaTab :user="chat.chatClient"/>

                  <ChatMetaTab :chat="chat"/>

                </v-expansion-panels>
              </v-sheet>
            </v-container>
          </v-col>
          <v-col cols="4" class="no-gutters flex-column">
            <div class="d-flex flex-grow-1 flex-row mt-2">
              <v-card class="flex-grow-1">
                <v-progress-linear
                  v-if="loadingMessages"
                  color="deep-purple accent-4"
                  indeterminate
                  rounded
                  height="6"
                ></v-progress-linear>
                <div v-if="!loadingMessages" class="channel-page">
                  <div id="messages" ref="messages" class="messages mx-2">
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
                </div>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import AccountCard from '@/components/user/AccountCard'
import UserMetaTab from '@/components/user/tabs/UserMetaTab'
import ChatMetaTab from '@/apps/chat/components/tabs/ChatMetaTab'
import ChannelMessage from '@/apps/chat/components/ChannelMessage'
import { mapActions, mapGetters } from 'vuex'
import ClientsChat from '@/apps/chat/classes/ClientsChat'
import { showChatRequest } from '@/apps/chat/http/chatRequest'

export default {
  name: 'ChatInfo',
  components: {
    UserMetaTab,
    AccountCard,
    ChannelMessage,
    ChatMetaTab
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
      chaRequest: {}
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
      console.log(this.chatInstance)
    },
    loadingDialog (val) {
      if (val) return

      this.dialog = true
    }
  },
  mounted() {
  },
  methods: {
    ...mapActions({
      getMessages: 'message/fetchMessages'
    }),
    initialize() {
      this.loadingDialog = true

      console.log(this.chat)
      this.fetchChatRequest(this.chat.chat_request_id).then(() => {
        this.createChat({
          chatRequest: this.chatRequest,
          channelName: this.chatRequest.channelName,
          user: this.whoAmI
        })
        console.log(this.chatInstance)
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
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  max-height: 80%;
  display: flex;
  flex-direction: column;

  .messages {
    flex-grow: 1;
    margin-bottom: 68px;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    min-height: 0;
  }

  .input-box {
    position: fixed;
    bottom: 12px;
    width: 100%;
  }

  .messages {
    padding-bottom: 0px;
  }

  .input-box {
    position: absolute;
    bottom: 12px;
  }
}

.theme--dark {
  .channel-page {
    background: none;
  }
}
</style>
