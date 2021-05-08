<template>
  <v-dialog
    v-model="loading"
    persistent
    :width="300"
    transition="scale-transition"
  >
    <v-card
      v-if="loading"
      color="surface"
    >
      <v-card-text>
        {{ text || $t('b2tickets.common.loading') }}
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'AppLoading',
  props: {
    loading: {
      type: [Boolean , String],
      required: true
    },
    // eslint-disable-next-line vue/require-default-prop
    text: {
      type: String,
      required: false
    }
  }
}
</script>

<style scoped>

</style>