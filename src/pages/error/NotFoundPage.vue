<template>
  <v-card class="text-center w-full error-page pa-3">
    <v-img src="/images/illustrations/404-illustration.svg" max-height="400" contain />
    <div class="display-2 mt-10">{{ $t('error.notfound') }}</div>
    <div class="mt-3 mb-6">{{ $t('error.notFoundDesc') }}</div>
    <v-text-field solo :placeholder="$t('common.search')" large></v-text-field>
    <v-btn to="/" block large color="primary">{{ $t('common.takeMeBack') }}</v-btn>
  </v-card>
</template>

<style>
.error-page {
  max-width: 500px;
}
</style>
