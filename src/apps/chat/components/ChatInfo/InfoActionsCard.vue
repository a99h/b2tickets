<template>
  <v-card class="mb-3 d-flex justify-space-around">
    <v-card-actions v-for="item in navMenu.items" :key="item.id">
      <router-link :to="item.to">
        <span :class="navMenu.spanColor">{{ item.title }}</span>
        <v-icon medium class="mx-1" :color="navMenu.iconColor">{{ item.icon }}</v-icon>
      </router-link>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'InfoActionsCard',
  props: {
    chatId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      navMenu: {
        items: [{
          title: 'Тикеты',
          icon: 'mdi-card-bulleted-settings',
          to: { name: 'ticket-list', params: { chatId: this.chatId } }
        },{
          title: 'Чат',
          icon: 'mdi-wechat',
          to: { name: 'ticket-list', params: { chatId: this.chatId } }
        },{
          title: 'Выйти',
          icon: 'mdi-exit-run',
          to: { name: 'ticket-list', params: { chatId: this.chatId } }
        }],
        spanColor: 'accent--text',
        iconColor: 'accent'
      }
    }
  }
}
</script>

<style scoped>

</style>