<template>
  <div class="d-flex flex-grow-1 flex-row mt-2">
    <v-navigation-drawer
      v-model="drawer"
      :app="$vuetify.breakpoint.mdAndDown"
      :permanent="$vuetify.breakpoint.lgAndUp"
      floating
      :right="$vuetify.rtl"
      class="elevation-1 rounded flex-shrink-0"
      :class="[$vuetify.rtl ? 'ml-3' : 'mr-3']"
      width="240"
    >
      <div class="px-2 py-1">
        <div class="title font-weight-bold primary--text">Chat</div>
        <div class="overline">2.0.0</div>
      </div>

      <!-- channels list -->
      <v-list three-line>
        <v-subheader class="ml-1 overline">{{ $tc('chat.channel', 2) }}</v-subheader>
        <div class="mx-2 mb-2">
          <v-btn outlined block @click="showCreateDialog = true">
            <v-icon small left>mdi-plus</v-icon>
            {{ $t('chat.addChannel') }}
          </v-btn>
        </div>

        <template v-for="chat in openedChats">

          <v-list-item
            :key="chat.channelName"
            @click="changeChannel(chat)"
          >
            <v-list-item-avatar>
              <v-icon :color="chat.chat.active ? 'primary' : 'error'">mdi-radiobox-marked</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>
                {{ chat | channelTitle }}
                <v-avatar
                  v-if="chat.unreadMessagesCount > 0"
                  color="success"
                  size="18"
                >
                  <span class="white--text caption">{{ chat.unreadMessagesCount }}</span>
                </v-avatar>
              </v-list-item-title>
              <v-list-item-subtitle>{{ chat | lastMessage }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <!-- channel view -->
    <v-card class="flex-grow-1">
      <router-view
        :key="$route.fullPath"
        :user="user"
        :chat="currentChat"
        @toggle-menu="drawer = !drawer"
        @add-chat="addChatAndEnter"
        @leave-channel="leaveChat"
      ></router-view>
    </v-card>

    <!-- create a new channel dialog -->
    <v-dialog v-model="showCreateDialog" max-width="400">
      <v-card>
        <v-card-title class="title">{{ $t('chat.addChannel') }}</v-card-title>
        <div class="pa-3">
          <v-text-field
            ref="channel"
            v-model="newChannel"
            :label="$tc('chat.channel', 1)"
            maxlength="20"
            counter="20"
            autofocus
            @keyup.enter="newChat()"
          ></v-text-field>
        </div>
        <v-card-actions class="pa-2">
          <v-spacer></v-spacer>
          <v-btn @click="showCreateDialog = false">{{ $t('common.cancel') }}</v-btn>
          <v-btn :loading="loading.addOpenedChat" color="success" @click="newChat()">{{ $t('common.add') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
/*
|---------------------------------------------------------------------
| Chat App Main Layout Component
|---------------------------------------------------------------------
|
| Navigation drawer with channels for the chat application
|
*/
import ClientsChat from '@/apps/chat/classes/ClientsChat'
import OperatorsChat from '@/apps/chat/classes/OperatorsChat'
import channelService from '@/apps/chat/services/channelService'
import channelTitle from '@/apps/chat/filters/channelTitle'

import { mapActions, mapGetters } from 'vuex'
import lastMessage from '@/apps/chat/filters/lastMessage'

export default {
  filters: {
    channelTitle: channelTitle,
    lastMessage: lastMessage
  },
  data() {
    return {
      // loading
      loading: {
        addOpenedChat: false
      },

      // navigation drawer
      drawer: null,

      // initial channels
      defaultChannels: ['general', 'restroom'],

      // create channel variables
      showCreateDialog: false,
      newChannel: '',

      chatRequest: null
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/getUser',
      openedChats: 'chat/getOpenedChats',
      currentChat: 'chat/getCurrentChat'
    })
  },
  created() {
    this.addDefaultChannels(this.defaultChannels)
  },
  mounted() {
    // this.changeChannel(this.currentChat)
  },
  methods: {
    ...mapActions({
      storeOpenedChat: 'chat/addOpenedChat',
      deleteOpenedChat: 'chat/removeOpenedChat',
      setCurrentChat: 'chat/setCurrentChat'
    }),
    addDefaultChannels(defaultChannels) {
      defaultChannels.forEach((channelName) => {
        this.addOpenedChat({ channelName: channelName, user: this.user })
      })
    },
    newChat() {
      this.addChatAndEnter({ channelName: this.newChannel, user: this.user })

      this.newChannel = ''
    },
    addChatAndEnter(options) {
      console.log(options)
      this.addOpenedChat(options)
      this.changeChannel(this.openedChats[this.openedChats.length - 1])
    },
    changeChannel(chat) {
      this.setCurrentChat(this.openedChats.indexOf(chat))
      if (this.$route.params.id !== chat.channelName) this.$router.push(`/apps/chat/channel/${chat.channelName}`)
    },
    // Add and join the channel on creation
    addOpenedChat(options) {
      options.user = this.user

      const { channelName, user } = options

      if (!channelName || !user) {
        this.$refs.channel.focus()

        return
      }

      if (!this.openedChatExists(channelName)) {
        this.loading.addOpenedChat = true

        const chat = this.createChat(options)

        channelService.subscribeChannel(chat)

        this.storeOpenedChat(chat)

        this.loading.addOpenedChat = false
        this.showCreateDialog = false

        if (this.currentChat === undefined) this.setCurrentChat(this.openedChats.indexOf(chat))
      }

      this.showCreateDialog = false
    },
    leaveChat(chat) {
      if (!this.defaultChannels.some((channelName) => chat.channelName === channelName)) {
        channelService.unsubscribeChannel(chat)

        this.deleteOpenedChat(chat)

        this.changeChannel(this.openedChats[0])
      } else alert('You cannot leave default channels')
    },
    createChat(options) {
      const { chatRequest } = options

      if (!chatRequest) return new OperatorsChat(options)
      else return new ClientsChat(options)
    },
    openedChatExists(channelName) {
      return this.openedChats.some((chat) => chat.channelName === channelName)
    }
  }
}
</script>
