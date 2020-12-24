<template>
  <div>
    <!-- channel toolbar -->
    <v-app-bar flat height="64">
      <v-app-bar-nav-icon class="hidden-lg-and-up" @click="$emit('toggle-menu')"></v-app-bar-nav-icon>

      <v-spacer></v-spacer>

      <v-btn class="mx-1" icon @click.stop="toggleUsersDrawer">
        <v-icon>mdi-account-group-outline</v-icon>
      </v-btn>
    </v-app-bar>

    <v-divider></v-divider>

    <!-- chat request table -->
    <chat-request-table @addChannel="addChannel"/>

    <online-users-drawer
      ref="onlineUsersDrawer"
      :user="user"
      :online-users="onlineUsers"
      :chat-request="chatRequest"
    ></online-users-drawer>
  </div>
</template>

<script>
import ChatRequestTable from '../components/ChatRequestTable'
import OnlineUsersDrawer from '../components/OnlineUsersDrawer'

/*
|---------------------------------------------------------------------
| Chat Channel Page Component
|---------------------------------------------------------------------
|
| Layout to display the channel messages and users online
|
*/
export default {
  name: 'ChatRequestPage',
  components: {
    OnlineUsersDrawer,
    ChatRequestTable
  },
  props: {
    // Current logged user
    user: {
      type: Object,
      default: () => ({})
    },
    chatRequest: {
      type: Object,
      default: () => ({})
    },
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
  },
  methods: {
    addChannel(chatRequest) {
      this.$emit('addChannel', chatRequest)
    },
    toggleUsersDrawer() {
      this.$refs.onlineUsersDrawer.usersDrawer = !this.$refs.onlineUsersDrawer.usersDrawer
    }
  }
}
</script>
<style lang="scss" scoped>
// List Transition Animation
.list-enter-active {
  transition: all 0.3s;
}

.list-move {
  transition: transform 0.3s;
}

.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
// -- End List Transition Animation
</style>
