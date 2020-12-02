<template>
  <!-- online users drawer -->
  <v-navigation-drawer
    v-model="usersDrawer"
    width="240"
    right
    app
  >
    <v-list dense>
      <v-subheader class="mx-1 overline">
        {{ $t('b2tickets.chat.online', { count: users.length }) }}
      </v-subheader>
      <v-list-item v-for="item in users" :key="item.id" class="mb-1">
        <user-avatar :user="item" class="mx-1" />
        <v-list-item-content>
          <v-list-item-title :class="{ 'primary--text': item.id === user.id }">
            @{{ item.name }}
          </v-list-item-title>
          <v-list-item-action-text>
            <v-chip v-if="item.typing" class="primary" x-small>печатает...</v-chip>
          </v-list-item-action-text>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import UserAvatar from './UserAvatar'
import Echo from '@/plugins/echo'

/*
|---------------------------------------------------------------------
| User Avatar Component
|---------------------------------------------------------------------
|
| User avatar for chat messages, display avatar if available or name
| initials
|
*/
export default {
  components: {
    UserAvatar
  },
  props: {
    // Current logged user
    user: {
      type: Object,
      default: () => ({})
    },
    // channel information
    channel: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // users online drawer
      usersDrawer: false,
      // online users
      users: []
    }
  },
  mounted() {
    this.addOnlineUsers()
  },
  methods: {
    addOnlineUsers() {
      if (this.channel !== '') {
        Echo.join('App.User.' + this.channel)
          .here((users) => {
            this.users = users
          })
          .joining((user) => {
            this.users.push(user)
          })
          .leaving((user) => {
            this.users = this.users.filter((u) => u.id !== user.id)
          })

        Echo.private('App.User.' + this.channel)
          .listenForWhisper('typing', ({ id, name }) => {
            this.users.forEach((user, index) => {
              if (user.id === id) {
                user.typing = true
                this.$set(this.users, index, user)
              }
            })
          })
      }
    }
  }
}
</script>
