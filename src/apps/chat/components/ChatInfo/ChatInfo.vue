<template>
  <div class="text-center">
    <v-dialog
      v-if="dialog"
      v-model="dialog"
      width="800px"
      max-width="90%"
      persistent
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
            @click="closeDialog()"
          >
            <v-icon x-large>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ $t('b2tickets.chat.form.show') }}</v-toolbar-title>
        </v-toolbar>

        <v-row class="ma-0">

          <v-col cols="6" class="general-info-section">
            <v-card class="card scroll">
              <InfoActionsCard :recorded-chat="recordedChat" :channel-name="chat.chatRequest.channel_name" @close-dialog="dialog = false"/>

              <AccountCard :user="chat.chatClient"/>

              <v-expansion-panels v-model="panel" multiple class="my-1.5">

                <UserMetaTab :user="chat.chatClient"/>

                <ChatMetaTab :chat="chat"/>

              </v-expansion-panels>
            </v-card>
          </v-col>

          <v-col cols="6" class="chat-section section">
            <v-card class="card pa-1">
              <v-progress-circular
                v-if="loading.chat"
                class="loader"
                :size="70"
                :width="5"
                color="deep-purple accent-4"
                indeterminate
                value="Loading"
              ></v-progress-circular>
              <div v-else class="chat scroll">
                <div ref="messages" class="messages">
                  <transition-group
                    v-if="recordedChat.messages.all().length"
                    name="list"
                  >
                    <ChannelMessage
                      v-for="message in recordedChat.messages.all()"
                      :key="message.id"
                      :message="message"
                      :user="recordedChat.user"
                      class="my-1 d-flex"
                      :loading="loading.chat"
                    />
                  </transition-group>

                  <div
                    v-else
                    class="no-messages"
                  >
                    <v-icon color="green" size="50">mdi-emoticon-cool</v-icon>
                    <p>{{ $t('chat.noMessages') }}</p>
                  </div>
                </div>
              </div>
            </v-card>
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
import { mapGetters } from 'vuex'
import RecordedChat from '@/apps/chat/js/facade/RecordedChat'

export default {
  name: 'ChatInfo',
  components: {
    AccountCard,
    InfoActionsCard,
    ChannelMessage,
    ChatMetaTab,
    UserMetaTab
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
      loading: {
        tickets: true,
        chat: true
      },
      recordedChat: {},
      backendErrors: []
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/getUser'
    })
  },
  watch: {
    chat (val) {
      if (val) {
        this.initialize()
      }
    },
    'recordedChat.messages.$isLoaded': {
      handler(value) {
        if (value) this.loading.chat = false
      },
      deep: true
    }
  },
  methods: {
    initialize() {
      this.recordedChat = new RecordedChat({
        chatRequest: this.chat.chatRequest,
        channelName: this.chat.chatRequest.channel_name,
        user: this.user
      })
    },
    closeDialog() {
      this.dialog = false
      this.loading.chat = true
    }
  }
}
</script>

<style lang="scss" scoped>

.row {
  height: calc(100% - 64px)
}

.card {
  border: 1px solid green;
}

.general-info-section,
.chat-section,
.card,
.scroll,
.chat {
  min-height: 100%;
}

.loader, .no-messages {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  text-align: center;
}

.scroll {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.messages {
  word-break: break-all;
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
.theme--dark {
  .channel-page {
    background: none;
  }
}
</style>
