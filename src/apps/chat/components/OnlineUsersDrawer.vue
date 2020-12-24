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
        {{ $t('b2tickets.chat.online', { count: onlineUsers.length }) }}
      </v-subheader>
      <v-list-item v-for="item in onlineUsers[chatRequest.channel_name]" :key="item.email" class="mb-1">
        <user-avatar :user="item" class="mx-1" />
        <v-list-item-content>
          <v-list-item-title :class="{ 'primary--text': item.email === user.email }">
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
    chatRequest: {
      type: Object,
      default: () => ({})
    },
    // Channel online users
    onlineUsers: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: Array | Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // users online drawer
      usersDrawer: false
    }
  }
}
</script>
