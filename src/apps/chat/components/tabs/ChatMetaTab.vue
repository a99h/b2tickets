<template>
  <v-expansion-panel v-if="chatIsValid">
    <v-expansion-panel-header
      class="title"
    >{{ $t('b2tickets.tabs.chat.info.title') }}
    </v-expansion-panel-header>
    <v-expansion-panel-content class="body-2">
      <span class="font-weight-bold">{{ $t('b2tickets.chat.fields.active') }}</span>
      <span :class="{ 'green--text': chat.active, 'red--text': !chat.active }">
        {{ ' ' + (chat.active ? $t('b2tickets.common.yes') : $t('b2tickets.common.no')) }}
      </span>
      <br />
      <span class="font-weight-bold">{{ $t('b2tickets.chat.fields.id') }}</span>
      {{ chat.id }}
      <br />
      <span class="font-weight-bold">{{ $t('b2tickets.chat.request.fields.id') }}</span>
      {{ chat.chat_request_id }}
      <br />
      <span class="font-weight-bold">{{ $t('b2tickets.common.fields.created_at') }}</span>
      {{ chat.created_at | formatDate("lll") }}
      <br />
      <span class="font-weight-bold">{{ $t('b2tickets.common.fields.updated_at') }}</span>
      {{ chat.updated_at | formatDate("lll") }}
      <br />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import RecordedOpenedChat from '@/apps/chat/js/facade/RecordedOpenedChat'

export default {
  name: 'ChatMetaTab',
  props: {
    chat: {
      type: Object,
      required: true
    }
  },
  methods: {
    chatIsValid(chat) {
      return chat instanceof RecordedOpenedChat
    }
  }
}
</script>

<style scoped>

</style>