<template>
  <div class="flex-grow-1">
    <chats-table @add-chat="addChat"></chats-table>
  </div>
</template>

<script>
import ChatsTable from '../components/ChatsTable'
export default {
  components: { ChatsTable },
  methods: {
    addChat(eventData) {
      console.log(eventData)
      this.$emit('add-chat', eventData)
    }
  }
}
</script>
