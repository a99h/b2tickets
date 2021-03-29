<template>
  <!-- chat request table -->
  <chat-request-table @add-chat="addChat"/>
</template>

<script>
import ChatRequestTable from '../components/ChatRequestTable'

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
    ChatRequestTable
  },
  props: {
    // Current logged user
    user: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    addChat(eventData) {
      this.$emit('add-chat', eventData)
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
