<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      :app="$vuetify.breakpoint.mdAndDown"
      :permanent="$vuetify.breakpoint.lgAndUp"
      floating
      class="elevation-1 rounded flex-shrink-0 mr-3"
      width="240"
    >
      <div class="px-2 py-1">
        <div class="title font-weight-bold primary--text">{{ $t('b2tickets.chat.chatChannels') }}</div>
      </div>

      <v-list dense>
        <!-- channels list -->
        <v-list-item
          v-for="channelItem in channels"
          :key="channelItem.channel_name"
          exact
          :class="($route.path === `/apps/chat/channel/${channelItem.channel_name}`) ? 'surface' : ''"
          @click="changeChannel(channelItem)"
        >
          <v-list-item-avatar>
            <v-icon :color="channelItem.chat.active ? 'primary' : 'error'">mdi-radiobox-marked</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ channelItem.user.email }}</v-list-item-title>
            <v-list-item-action-text>{{ $tc('b2tickets.chat.request.title', 1) + ' #' + channelItem.id }}</v-list-item-action-text>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>

/*
|---------------------------------------------------------------------
| Chat Channel List Component
|---------------------------------------------------------------------
|
| List of channels, websockets logic
|
*/
import Echo from '@/plugins/echo'
import { mapActions } from 'vuex'

export default {
  props: {
    channels: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: Object | Array,
      default: () => ({})
    }
  },
  data() {
    return {
      // navigation drawer
      drawer: null,
      // users array for online users drawer
      onlineUsers: {},
      // Current logged user
      user: {
        type: Object,
        default: () => ({})
      }
    }
  },
  methods: {
    ...mapActions({
      storeChattingUsers: 'chat/storeChattingUsers',
      showClient: 'client/showClient'
    }),
    changeChannel(chatRequest) {
      this.$emit('changeChannel', chatRequest)
    },
    setChattingUsers(users) {
      this.storeChattingUsers(users).then(() => {
        this.$emit('updateUsersDrawer')
      })
    },
    joinChannel(chatRequest) {
      Echo.join('App.User.' + chatRequest.channel_name)
        .here((users) => {
          this.onlineUsers[chatRequest.channel_name] = users
          this.setChattingUsers(this.onlineUsers)

          this.onlineUsers[chatRequest.channel_name].forEach((user) => {
            this.showClient(user).then((response) => {
              if (response.data.email === user.email) this.updateChatActiveValue(chatRequest,1)

              return true
            })

            this.updateChatActiveValue(chatRequest,0)

            return false
          })
        })
        .joining((user) => {
          this.onlineUsers[chatRequest.channel_name].push(user)
          this.setChattingUsers(this.onlineUsers)

          this.showClient(user).then((response) => {
            if (response.data.email === user.email) this.updateChatActiveValue(chatRequest,1)
          }).catch((e) => {
            console.log(e)
          })
        })
        .leaving((user) => {
          this.onlineUsers[chatRequest.channel_name] = this.onlineUsers[chatRequest.channel_name].filter((u) => u.id !== user.id)
          this.setChattingUsers(this.onlineUsers)

          if (user.email !== this.user.email) this.updateChatActiveValue(chatRequest,0)
        })
    },
    updateChatActiveValue(chatRequest, chatActiveValue) {
      this.$emit('updateChatActiveValue', chatRequest, chatActiveValue)
    }
  }
}
</script>
