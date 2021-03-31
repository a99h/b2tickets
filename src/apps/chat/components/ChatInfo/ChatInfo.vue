<template>
  <!--  &lt;!&ndash; id, Avatar, Name, email, app id, created_at &ndash;&gt;-->
  <!--  <ClientInfo />-->

  <!--  &lt;!&ndash; Related tickets, enter chat button &ndash;&gt;-->
  <!--  <ChatInfoActions />-->

  <!--  <ChatLastMessage />-->

  <!--  &lt;!&ndash; id, Created, updated, active &ndash;&gt;-->
  <!--  <ChatMetaData />-->

  <!--  &lt;!&ndash; id, created, channel_name &ndash;&gt;-->
  <!--  <ChatRequestMetaData />-->
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      persistent
      :width="loading ? 300 : 'auto'"
      :fullscreen="!loading"
      transition="dialog-bottom-transition"
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
      <v-card v-if="!loading">
        <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Settings</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click="dialog = false"
            >
              Save
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list
          three-line
          subheader
        >
          <v-subheader>User Controls</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Content filtering</v-list-item-title>
              <v-list-item-subtitle>Set the content filtering level to restrict apps that can be downloaded</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Password</v-list-item-title>
              <v-list-item-subtitle>Require password for purchase or use password to restrict purchase</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
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
export default {
  name: 'ChatInfo',
  props: {
    activatorHidden: {
      type: Boolean,
      required: false
    }
  },
  data () {
    return {
      dialog: false,
      loading: false,
      notifications: false,
      sound: true,
      widgets: false
    }
  },
  watch: {
    dialog (val) {
      if (!val) return

      this.initialize()
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