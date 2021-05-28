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
import channelService from '@/apps/chat/js/services/echoChannelService'
import { mapActions, mapGetters } from 'vuex'
import RecordedChat from '@/apps/chat/js/facade/RecordedChat'

export default {
  name: 'InfoActionsCard',
  props: {
    recordedChat: {
      type: RecordedChat,
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
          to: { name: 'apps-chat-chats' }
        }],
        spanColor: 'accent--text',
        iconColor: 'accent'
      }
    }
  },
  computed: {
    ...mapGetters({
      openedChats: 'chat/getOpenedChats',
      currentChat: 'chat/getCurrentChat'
    })
  },
  mounted() {
    console.log(this.channelName)
  },
  methods: {
    ...mapActions({
      storeOpenedChat: 'chat/addOpenedChat',
      setCurrentChat: 'chat/setCurrentChat'
    }),
    onClickActionHook(item) {
      if (item.to.name === 'apps-chat-channel') {
        this.openChat(this.recordedChat)
      }
      this.$emit('close-dialog')
    },
    openChat(recordedChat) {
      channelService.subscribeChannel(recordedChat)

      this.storeOpenedChat(recordedChat)

      this.setCurrentChat(this.openedChats.indexOf(recordedChat))
    }
  }
}
</script>

<style scoped>

</style>
