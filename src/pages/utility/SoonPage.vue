<template>
  <div class="pa-2">
    <h1 class="display-2 font-weight-bold">{{ $t('utility.comingSoon') }}</h1>
    <h2 class="title mt-4">{{ $t('utility.comingSoonDesc') }}</h2>
    <div class="mt-8">
      <v-text-field solo placeholder="Email"></v-text-field>
      <v-btn color="primary" large block>{{ $t('email.subscribe') }}</v-btn>
    </div>
  </div>
</template>
