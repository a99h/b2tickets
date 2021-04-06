<template>
  <v-expansion-panel>
    <v-expansion-panel-header
      class="title"
    >{{ $t('b2tickets.tabs.user.meta.title') }}
    </v-expansion-panel-header>
    <v-expansion-panel-content class="body-2">
      <span class="font-weight-bold">{{ $t('b2tickets.common.fields.id') }}</span>
      {{ user.id }}
      <br />
      <span class="font-weight-bold">{{ $t('b2tickets.common.fields.created_at') }}</span>
      {{ user.created_at | formatDate("lll") }}
      <br />
      <span class="font-weight-bold">{{ $t('b2tickets.common.fields.updated_at') }}</span>
      {{ user.updated_at | formatDate("lll") }}
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  name: 'UserMetaTab',
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>