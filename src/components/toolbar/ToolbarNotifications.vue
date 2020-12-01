<template>
  <v-menu offset-y left transition="slide-y-transition">
    <template v-slot:activator="{ on }">
      <v-badge
        :value="items.length"
        bordered
        :content="items.length"
        offset-x="22"
        offset-y="22"
      >
        <v-btn icon v-on="on">
          <v-icon>{{ muted === true ? 'mdi-volume-mute' : 'mdi-bell-outline' }}</v-icon>
        </v-btn>
      </v-badge>
    </template>

    <!-- dropdown card -->
    <v-card>
      <v-tooltip>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" @click="muted = !muted">
            <v-icon>{{ muted === true ? 'mdi-volume-mute' : 'mdi-volume-medium' }}</v-icon>
          </v-btn>
        </template>
        <span>{{ muted ? 'Click to turn sound OFF' : 'Click to turn sound ON' }}</span>
      </v-tooltip>
      <v-list
        three-line
        dense
        max-width="400"
        max-height="400"
        class="overflow-y-auto"
      >
        <v-subheader class="pa-2 font-weight-bold">Notifications</v-subheader>
        <div v-for="(item, index) in items" :key="index">
          <v-divider v-if="index > 0 && index < items.length" inset></v-divider>

          <v-list-item @click="">
            <v-list-item-avatar size="32" :color="chatRequestNotificationsSettings.color">
              <v-icon dark small>{{ chatRequestNotificationsSettings.icon }}</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="chatRequestNotificationsSettings.title"></v-list-item-title>
              <v-list-item-subtitle class="caption">{{ 'User: ' + item.chat_request.user.email + ' is waiting for operator!' }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action class="align-self-center">
              <v-chip
                v-if="chipTempVar"
                small
                color="success"
                class="mb-2"
                @click="softDeleteNotification"
              >Mark Read</v-chip>
              <v-list-item-action-text>{{ new Date(item.chat_request.created_at) | fromNow() }}</v-list-item-action-text>
            </v-list-item-action>
          </v-list-item>
        </div>
      </v-list>

      <div class="text-center py-2">
        <v-btn small>See all</v-btn>
      </div>
    </v-card>
  </v-menu>
</template>

<script>
import Echo from '@/plugins/echo'
import axios from '@/plugins/axios'
import { mapGetters } from 'vuex'

/*
|---------------------------------------------------------------------
| Toolbar Notifications Component
|---------------------------------------------------------------------
|
| Quickmenu to check out notifications
|
*/
export default {
  data() {
    return {
      chipTempVar: false,
      audio: null,
      dialog2: false,
      interval: null,
      items: [],
      muted: true,
      chatRequestNotificationsSettings: {
        title: 'New chat request',
        color: 'primary',
        icon: 'mdi-forum-outline'
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/getUser'
    })
  },
  created() {
    this.initialize()
    this.interval = setInterval(() => this.$forceUpdate(), 1000 * 60)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    initialize() {
      this.audio = new Audio('/audio/new-chat-request.ogg')
      this.startChannel('App.Modules.User.Models.User.' + this.user.id)
    },
    getNotifications() {
      axios.get(route('api.ticketsystem.chat.notifications.index')).then((response) => {
        this.items = response.data.data
      }).catch((e) => {
        console.log(e)
      })
    },
    softDeleteNotification() {
      console.log('notifications marked as read')
    },
    startChannel(channelId) {
      this.channel = channelId
      this.getNotifications()
      this.joinEcho()
    },
    joinEcho() {
      Echo.private(this.channel)
        .notification((event) => {
          if (event.chat_request) {
            this.items.unshift(event)
            if (!this.muted) this.playSound()
          }
        })
    },
    playSound () {
      this.audio.play()
    }
  }
}
</script>
