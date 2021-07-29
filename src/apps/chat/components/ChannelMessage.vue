<template>
  <div ref="typing" class="d-flex flex-grow-1" :class="{ 'flex-row-reverse': isOwnMessage}">
    <user-avatar :user="message.user" />

    <div class="mx-2" >
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-card
            class="pa-1 pb-3"
            :class="{ 'primary darken-1': isOwnMessage, 'orange darken-1': isTypingMessage}"
            :dark="isOwnMessage || isTypingMessage"
            v-bind="attrs"
            v-on="on"
          >
            <div class="font-weight-bold">
              <v-badge
                class="badge_message"
                bottom
                offset-x="40"
                offset-y="-5"
                color="transparent"
              >
                <template v-slot:badge="" >
                  <span class="caption">{{ message.timestamp | getTime }}</span>
                  <v-icon
                    v-if="isOwnMessage"
                    medium
                  >
                    {{ message.read_at >= message.timestamp ? 'mdi-check-all' : 'mdi-check' }}
                  </v-icon>
                </template>
                {{ message.text }}
              </v-badge>
            </div>
          </v-card>
        </template>
        <span>{{ message.timestamp | formatDate('lll') }}</span>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
/*
|---------------------------------------------------------------------
| Channel Message Component
|---------------------------------------------------------------------
|
| Display messages in channel with user information and timestamp
|
*/
import UserAvatar from './UserAvatar'
import moment from 'moment'

export default {
  components: {
    UserAvatar
  },
  filters: {
    getTime: function (value) {
      if (!value) return ''

      return moment(value).format('hh:mm')
    }
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    // Current logged user
    user: {
      type: Object,
      default: () => {}
    },
    // Message to display
    message: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    // Check if it's a message from the logged user
    isOwnMessage() {
      return this.user.id === this.message.user.id
    },
    isTypingMessage() {
      return typeof this.message.id === 'symbol'
    }
  },
  mounted() {
    this.typingVisible()
  },
  methods: {
    typingVisible() {
      if (this.isTypingMessage && this.message.text.length <= 1 ) {
        this.$refs.typing.style.cssText = 'display: none !important'
      } else {
        this.$refs.typing.style.cssText = ''
      }
    }
  }
}
</script>

<style scoped>

.badge_message {
  overflow-wrap: anywhere;
}
</style>
