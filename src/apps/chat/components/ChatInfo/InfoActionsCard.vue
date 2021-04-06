<template>
  <v-card class="mb-3 d-flex justify-space-around">
    <v-card-actions v-for="item in navMenu.items" :key="item.id">
      <span :class="navMenu.spanColor">{{ item.title }}</span>
      <v-icon medium class="mx-1" :color="navMenu.iconColor">{{ item.icon }}</v-icon>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'InfoActionsCard',
  data () {
    return {
      navMenu: {
        items: [{
          title: 'Тикеты',
          icon: 'mdi-card-bulleted-settings'
        },{
          title: 'Чат',
          icon: 'mdi-wechat'
        },{
          title: 'Выйти',
          icon: 'mdi-exit-run'
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