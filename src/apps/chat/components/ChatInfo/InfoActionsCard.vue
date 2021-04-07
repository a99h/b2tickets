<template>
  <v-card class="mb-3 d-flex justify-space-around">
    <v-card-actions v-for="item in navMenu.items" :key="item.id">
      <span @click="onClickActionHook(item)">
        <router-link :to="item.to">
          <span :class="navMenu.spanColor">{{ item.title }}</span>
          <v-icon medium class="mx-1" :color="navMenu.iconColor">{{ item.icon }}</v-icon>
        </router-link>
      </span>
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
    },
    channelName: {
      type: String,
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
          to: { name: 'apps-chat-channel', params: { id: this.channelName } }
        },{
          title: 'Выйти',
          icon: 'mdi-exit-run',
          to: { name: 'apps-chat-list' }
        }],
        spanColor: 'accent--text',
        iconColor: 'accent'
      }
    }
  },
  mounted() {
    console.log(this.channelName)
  },
  methods: {
    onClickActionHook(item) {
      if (item.to.name === 'apps-chat-list') this.$emit('close-dialog')
    }
  }
}
</script>

<style scoped>

</style>