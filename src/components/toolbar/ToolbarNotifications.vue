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
          <v-icon>{{ sound === false ? 'mdi-volume-mute' : 'mdi-bell-outline' }}</v-icon>
        </v-btn>
      </v-badge>
    </template>

    <!-- dropdown card -->
    <v-card>
      <v-tooltip>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" @click="sound = !sound">
            <v-icon>{{ sound === true ? 'mdi-volume-mute' : 'mdi-volume-medium' }}</v-icon>
          </v-btn>
        </template>
        <span>{{ sound ? 'Click to turn sound OFF' : 'Click to turn sound ON' }}</span>
      </v-tooltip>
      <v-list
        three-line
        dense
        max-width="400"
        max-height="400"
        class="overflow-y-auto">
        <v-subheader class="pa-2 font-weight-bold">Notifications</v-subheader>
        <div v-for="(item, index) in items" :key="index">
          <v-divider v-if="index > 0 && index < items.length" inset></v-divider>

          <v-list-item @click="">
            <v-list-item-avatar size="32" :color="item.color">
              <v-icon dark small>{{ item.icon }}</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
              <v-list-item-subtitle class="caption" v-text="item.subtitle"></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action class="align-self-center">
              <v-list-item-action-text>{{ new Date(item.time) | fromNow() }}</v-list-item-action-text>
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
// import moment from '@/plugins/moment'

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
      interval: null,
      items: [],
      sound: false,
      defaultItem: {
        title: 'New chat request',
        color: 'primary',
        icon: 'mdi-forum-outline',
        subtitle: '',
        time: '3 min'
      }
    }
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
      this.startChannel('operators-main')
      this.joinEcho()
    },
    startChannel(channelId) {
      this.channel = channelId
      // this.fetchMessages()
    },
    joinEcho() {
      Echo.join(this.channel)
        .listen('ChatRequestCreated', (event) => {
          this.items.unshift({
            title: this.defaultItem.title,
            color: this.defaultItem.color,
            icon: this.defaultItem.icon,
            subtitle: 'User: ' + event.chat_request.user.email + ' is waiting for operator',
            time: event.chat_request.created_at
          })
          if (this.sound) this.playSound()
        })
    },
    playSound () {
      const audio = new Audio('/audio/new-chat-request.ogg')

      audio.play()
    }
  }
}
</script>
