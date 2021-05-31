<template>
  <v-card class="text-center w-full error-page pa-3">
    <v-img src="/images/illustrations/404-illustration.svg" max-height="400" contain />
    <div class="display-2 mt-10">{{ $t('error.notfound') }}</div>
    <div class="mt-3 mb-6">{{ $t('error.notFoundDesc') }}</div>
    <v-text-field solo :placeholder="$t('common.search')" large></v-text-field>
    <div class="d-flex justify-space-between ">
      <v-btn class='redirect-item' large color="primary" @click="redirectBack">{{ $t('common.takeMeBack') }}</v-btn>
      <v-btn class='redirect-item' large color="primary" @click="redirectHome">{{ $t('common.takeMeHome') }}</v-btn>
    </div>
  </v-card>
</template>

<script>
export default {
  methods: {
    redirectBack() {
      this.$router.go(-1)
    },
    redirectHome() {
      this.$router.push({ name: 'home' })
    }
  }
}
</script>

<style>
.error-page {
  max-width: 500px;
}

.redirect-item {
  width: 45%;
  margin: 0 2.5%;
}
</style>
