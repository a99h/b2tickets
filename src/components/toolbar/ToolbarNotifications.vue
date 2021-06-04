<template>
  <v-menu
    v-model="menu"
    min-width="500px"
    max-width="500px"
    :close-on-content-click="false"
    close-on-click
    offset-y
    left
    transition="slide-y-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-badge
        :value="items.length"
        bordered
        :content="items.length"
        offset-x="22"
        offset-y="22"
      >
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>{{ muted === true ? 'mdi-volume-mute' : 'mdi-bell-outline' }}</v-icon>
        </v-btn>
      </v-badge>
    </template>

    <!-- Notifications -->
    <v-card>
      <v-system-bar
        window
        class="surface"
        right
      >
        <v-tooltip>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="muted = !muted">
              <v-icon>{{ muted === true ? 'mdi-volume-mute' : 'mdi-volume-medium' }}</v-icon>
            </v-btn>
          </template>
          <span>{{ muted ? $t('b2tickets.notifications.chatRequest.unmuteTooltip') : $t('b2tickets.notifications.chatRequest.muteTooltip') }}</span>
        </v-tooltip>
        <v-subheader class="pa-2 font-weight-bold">{{ $tc('b2tickets.notifications.title', 0) }}</v-subheader>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="menu = false">{{ $t('$vuetify.close') }}
          <v-icon color="primary">mdi-close-outline</v-icon>
        </v-btn>
      </v-system-bar>
      <v-list
        three-line
        dense
        max-height="400"
        min-height="200"
        class="overflow-y-auto"
      >
        <v-progress-circular
          v-if="loading.notifications"
          class="loader"
          indeterminate
          color="primary"
          size="50"
        ></v-progress-circular>

        <div v-else>
          <div v-if="items.length">
            <div v-for="(item, index) in items" :key="index">
              <v-divider v-if="index > 0 && index < items.length" inset></v-divider>

              <div class="notification-wrapper">

                <v-progress-circular
                  v-if="item.disabled"
                  class="loader"
                  indeterminate
                  color="primary"
                  size="30"
                ></v-progress-circular>

                <v-list-item :disabled="item.disabled" :class="item.disabled ? 'notification disabled' : 'notification'">
                  <v-list-item-avatar size="32" :color="chatRequestNotificationsSettings.color">
                    <v-icon dark small>{{ chatRequestNotificationsSettings.icon }}</v-icon>
                  </v-list-item-avatar>

                  <v-checkbox
                    v-model="checkedItems"
                    color="error"
                    dense
                    :value="item"
                    hide-details
                  ></v-checkbox>

                  <v-list-item-content>
                    <v-list-item-title v-text="$t('b2tickets.notifications.chatRequest.title')"></v-list-item-title>
                    <v-list-item-subtitle class="caption">
                      {{ $tc('b2tickets.user.title', 1) + ' ' + item.chat_request.user.email + ' ' + $t('b2tickets.notifications.chatRequest.waitingOperator') }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action class="align-self-center">
                    <v-chip
                      small
                      color="error"
                      class="mb-2"
                      @click="softDeleteNotification(item)"
                    >{{ $t('b2tickets.notifications.chatRequest.markRead') }}</v-chip>
                    <v-list-item-action-text>{{ new Date(item.chat_request.created_at) | fromNow() }}</v-list-item-action-text>
                  </v-list-item-action>
                </v-list-item>
              </div>
            </div>
          </div>

          <div v-else class="text-center no-notifications">
            <v-icon color="green" size="50">mdi-emoticon-cool</v-icon>
            <div>{{ $t('b2tickets.notifications.chatRequest.noNotifications') }}</div>
          </div>

        </div>
      </v-list>
      <div v-if="items.length" class="surface d-flex justify-center tools">
        <v-btn
          class="ma-1"
          :color="selectedAll ? 'warning' : 'success'"
          small
          @click="softMarkAllNotifications()"
        >
          {{ $t('b2tickets.notifications.chatRequest.selectAll') }}
        </v-btn>

        <v-btn
          class="ma-1"
          color="error"
          :disabled="checkedItems.length === 0 "
          small
          @click="softDeleteSelectedNotifications()"
        >
          {{ $t('b2tickets.notifications.chatRequest.markSelected') }}
        </v-btn>
      </div>
    </v-card>

  </v-menu>
</template>

<script>
import Echo from '@/plugins/echo'
import axios from '@/plugins/axios'
import { mapGetters } from 'vuex'
// Don't remove!
import VueSocketIO from '@/plugins/vueSocketIO'

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
      chatRequestAlert: false,
      menu: false,
      audio: null,
      dialog2: false,
      interval: null,
      items: [],
      checkedItems: [],
      muted: false,
      chatRequestNotificationsSettings: {
        title: 'New chat request',
        color: 'primary',
        icon: 'mdi-forum-outline'
      },
      loading: {
        notifications: false
      }
    }
  },
  sockets: {
    connect() {
      console.log('socket connected')
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/getUser'
    }),
    currentLocale() {
      return this.$i18n.locales.find((i) => i.code === this.$i18n.locale)
    },
    availableLocales() {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale)
    },
    selectedAll() {
      return this.checkedItems.length === this.items.length
    }
  },
  created() {
    this.initialize()
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    initialize() {
      this.audio = new Audio('/audio/new-chat-request.ogg')
      this.startChannel('App.Modules.User.Models.User.' + this.user.id)
    },
    startChannel(channelId) {
      this.channel = channelId
      this.getNotifications()
      this.joinEcho()
    },
    emitNewChatRequest(chatRequest) {
      // $socket is socket.io-client instance
      this.$socket.emit('new-chat-request', chatRequest.id)
    },
    joinEcho() {
      Echo.private(this.channel)
        .notification((event) => {
          if (event.chat_request) {
            this.items.unshift(event)
            if (!this.muted) this.playSound()

            this.emitNewChatRequest(event.chat_request)
          }
        })
    },
    async getNotifications() {
      this.loading.notifications = true
      await axios.get(route('api.ticketsystem.chat.notifications.index'))
        .then((response) => this.items = response.data.data)
        .catch((e) => console.log(e))
      this.loading.notifications = false
    },

    softDeleteNotification(notification) {
      notification.disabled = true
      this.$forceUpdate()

      axios.post(route('api.ticketsystem.chat.notifications.softdelete', notification.id), { _method: 'delete' })
        .then(() => {
          this.items.splice(this.items.indexOf(notification), 1)

          const checkedItemIndex = this.checkedItems.indexOf(notification)

          if (checkedItemIndex !== 1) {
            this.checkedItems.splice(checkedItemIndex, 1)
          }
        })
    },

    softDeleteSelectedNotifications() {
      this.checkedItems.forEach((item) => this.softDeleteNotification(item))
    },

    softMarkAllNotifications() {
      if (this.items.length > this.checkedItems.length) {
        this.checkedItems = [...this.items]
      }

      else {
        this.checkedItems = []
      }
    },

    playSound () {
      this.audio.play()
    },

    setLocale(locale) {
      this.$i18n.locale = locale
      this.$vuetify.lang.current = locale

      this.$vuetify.rtl = locale === 'ar'
    }
  }
}
</script>

<style lang="scss" scoped>

.loader, .no-notifications {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  text-align: center;
}

.notification-wrapper {
  position: relative;
}

.notification.disabled {
  background: lightgray;
  opacity: 0.2;
}

</style>
