<template>
  <div class="flex-grow-1">
    <chats-table @add-chat="addChat"></chats-table>
  </div>
</template>

<script>
import ChatsTable from '@/apps/chat/components/ChatTable'
export default {
  components: { ChatsTable },
  methods: {
    addChat(eventData) {
      this.$emit('add-chat', eventData)
    }
  }
}
</script>
