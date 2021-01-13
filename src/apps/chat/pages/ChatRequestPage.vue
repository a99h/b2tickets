<template>
  <!-- chat request table -->
  <chat-request-table @addChannel="addChannel"/>
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
  methods: {
    addChannel(chatRequest) {
      this.$emit('addChannel', chatRequest)
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
