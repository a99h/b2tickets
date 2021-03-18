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

      <v-list dense>
        <v-subheader class="ml-1 overline">{{ $tc('chat.channel', 2) }}</v-subheader>
        <div class="mx-2 mb-2">
          <v-btn outlined block @click="showCreateDialog = true">
            <v-icon small left>mdi-plus</v-icon>
            {{ $t('chat.addChannel') }}
          </v-btn>
        </div>

        <!-- channels list -->
        <v-list-item
          v-for="chat of chats"
          :key="chat.channelName"
          @click="changeChannel(chat)"
        >
          <v-list-item-avatar>
            <v-icon :color="chat.chat.active ? 'primary' : 'error'">mdi-radiobox-marked</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ chat | channelTitle }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- channel view -->
    <v-card class="flex-grow-1">
      <router-view
        :key="$route.fullPath"
        :user="user"
        :chat="currentChat"
        @toggle-menu="drawer = !drawer"
        @addChat="addChatAndEnter"
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
          <v-btn :loading="loading.addChat" color="success" @click="newChat()">{{ $t('common.add') }}</v-btn>
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

export default {
  filters: {
    channelTitle: channelTitle
  },
  data() {
    return {
      // loading
      loading: {
        addChat: false
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
      chats: 'chat/getChats',
      currentChat: 'chat/getCurrentChat'
    })
  },
  created() {
    this.addDefaultChannels(this.defaultChannels)
  },
  mounted() {
    this.changeChannel(this.currentChat)
  },
  methods: {
    ...mapActions({
      storeChat: 'chat/addChat',
      deleteChat: 'chat/removeChat',
      setCurrentChat: 'chat/setCurrentChat'
    }),
    addDefaultChannels(defaultChannels) {
      defaultChannels.forEach((channelName) => {
        this.addChat({ channelName: channelName, user: this.user })
      })
    },
    newChat() {
      this.addChatAndEnter({ channelName: this.newChannel, user: this.user })

      this.newChannel = ''
    },
    addChatAndEnter(options) {
      this.addChat(options)
      this.changeChannel(this.chats[this.chats.length - 1])
    },
    changeChannel(chat) {
      this.setCurrentChat(this.chats.indexOf(chat))
      if (this.$route.params.id !== chat.channelName) this.$router.push(`/apps/chat/channel/${chat.channelName}`)
    },
    // Add and join the channel on creation
    addChat(options) {
      const { channelName, user } = options

      if (!channelName || !user) {
        this.$refs.channel.focus()

        return
      }

      if (!this.chatExists(channelName)) {
        this.loading.addChat = true

        const chat = this.createChat(options)

        channelService.subscribeChannel(chat)

        this.storeChat(chat)

        this.loading.addChat = false
        this.showCreateDialog = false

        if (this.currentChat === undefined) this.setCurrentChat(this.chats.indexOf(chat))
      }

      this.showCreateDialog = false
    },
    leaveChat(chat) {
      if (!this.defaultChannels.some((channelName) => chat.channelName === channelName)) {
        channelService.unsubscribeChannel(chat)

        this.deleteChat(chat)

        this.changeChannel(this.chats[0])
      } else alert('You cannot leave default channels')
    },
    createChat(options) {
      const { chatRequest } = options

      if (!chatRequest) return new OperatorsChat(options)
      else return new ClientsChat(options)
    },
    chatExists(channelName) {
      return this.chats.some((chat) => chat.channelName === channelName)
    }
  }
}
</script>
