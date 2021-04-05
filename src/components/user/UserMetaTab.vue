<template>
  <v-expansion-panel>
    <v-expansion-panel-header
      class="title"
    >{{ $t('b2tickets.user.pages.editUser.metadata') }}
    </v-expansion-panel-header>
    <v-expansion-panel-content class="body-2">
      <span class="font-weight-bold">{{ $t('b2tickets.common.created_at') }}</span>
      {{ user.created_at | formatDate("lll") }}
      <br />
      <span class="font-weight-bold">{{ $t('b2tickets.common.updated_at') }}</span>
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
  },
  mounted() {
    console.log(this.user)
  }
}
</script>

<style scoped>

</style>