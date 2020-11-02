<template>
  <div class="d-flex flex-grow-1 flex-row mt-2">
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
          :key="channelItem.name"
          exact
          @click="changeChannel(channelItem)"
        >
          <v-list-item-content>
            <v-list-item-title># {{ channelItem.user }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- channel view -->
    <v-card class="flex-grow-1">
      <router-view
        :key="$route.fullPath"
        :user="user"
        :channelobj="currentChannel"
        @toggle-menu="drawer = !drawer"
        @addChannel="addChannel"
      ></router-view>
    </v-card>
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
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      // navigation drawer
      drawer: null,

      // logged user
      user: null,

      // initial channels
      channels: [],

      // create channel variables
      showCreateDialog: false,
      newChannel: {
        name: '',
        user: '',
        chatRequest: -1
      },
      currentChannel: {}
    }
  },
  computed: {
    ...mapGetters({
      getUser: 'auth/getUser'
    })
  },
  created() {
    this.initialize()
  },
  methods: {
    initialize() {
      this.user = this.getUser
    },
    // Add and join the channel on creation
    addChannel(channel) {
      this.newChannel = channel
      this.currentChannel = channel
      console.log(this.newChannel)

      if (!this.newChannel) {
        this.$refs.channel.focus()

        return
      }

      this.channels.push(this.newChannel)
      console.log(this.channels)
      this.$router.push(`/apps/chat/channel/${this.newChannel.name}`)
      this.newChannel = ''
    },
    changeChannel(channel) {
      this.currentChannel = channel
      this.$router.push(`/apps/chat/channel/${channel.name}`)
    }
  }
}
</script>
