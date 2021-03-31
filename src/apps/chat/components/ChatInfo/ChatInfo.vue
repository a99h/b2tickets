<template>
  <!--  &lt;!&ndash; Related tickets, enter chat button &ndash;&gt;-->
  <!--  <ChatInfoActions />-->

  <!--  <ChatLastMessage />-->

  <!--  &lt;!&ndash; id, Created, updated, active &ndash;&gt;-->
  <!--  <ChatMetaData />-->

  <!--  &lt;!&ndash; id, created, channel_name &ndash;&gt;-->
  <!--  <ChatRequestMetaData />-->
  <div class="text-center">
    <v-dialog
      v-model="loadingDialog"
      persistent
      :width="300"
      transition="scale-transition"
    >
      <v-card
        v-if="loading"
        color="surface"
      >
        <v-card-text>
          {{ $t('b2tickets.common.loading') }}
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog"
      persistent
      fullscreen
      transition="scale-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="dialog = false"
          >
            <v-icon x-large>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ $t('b2tickets.chat.form.show') }}</v-toolbar-title>
        </v-toolbar>

        <!-- id, Avatar, Name, email, app id, created_at -->
        <ClientInfo :client="chat.client"/>

        <v-divider></v-divider>

        <v-list
          three-line
          subheader
        >
          <v-subheader>General</v-subheader>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox v-model="notifications"></v-checkbox>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Notifications</v-list-item-title>
              <v-list-item-subtitle>Notify me about updates to apps or games that I downloaded</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox v-model="sound"></v-checkbox>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Sound</v-list-item-title>
              <v-list-item-subtitle>Auto-update apps at any time. Data charges may apply</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox v-model="widgets"></v-checkbox>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Auto-add widgets</v-list-item-title>
              <v-list-item-subtitle>Automatically add home screen widgets</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import ClientInfo from '@/components/client/ClientInfo'

export default {
  name: 'ChatInfo',
  components: {
    ClientInfo
  },
  props: {
    activatorHidden: {
      type: Boolean,
      required: false
    },
    chat: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      dialog: false,
      loadingDialog: false,
      loading: false,
      notifications: false,
      sound: true,
      widgets: false
    }
  },
  watch: {
    loadingDialog (val) {
      if (!val) return

      this.initialize()
    },
    dialog (val) {
      if (val) return

      if (!val) this.loadingDialog = val
    },
    loading (val) {
      if (val) return

      this.dialog = true
    }
  },
  methods: {
    initialize() {
      this.loading = true

      setTimeout(() => {
        this.loading = false
      }, 4000)
    }
  }
}
</script>

<style scoped>

</style>