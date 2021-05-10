<template>
  <div>
    <v-btn ref="button" class="drawer-button elevation-2" color="primary" @click="right = true">
      <v-icon class="fa-spin">mdi-cog-outline</v-icon>
    </v-btn>

    <v-navigation-drawer
      v-model="right"
      fixed
      right
      hide-overlay
      temporary
      width="310"
    >
      <div class="d-flex align-center pa-2">
        <div class="title">Settings</div>
        <v-spacer></v-spacer>
        <v-btn icon @click="right = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <v-divider></v-divider>

      <div class="pa-2">
        <div class="font-weight-bold my-1">Global Theme</div>
        <v-btn-toggle v-model="userSettings.global_theme" color="primary" mandatory class="mb-2">
          <v-btn x-large>Light</v-btn>
          <v-btn x-large>Dark</v-btn>
        </v-btn-toggle>

        <div class="font-weight-bold my-1">Toolbar Theme</div>
        <v-btn-toggle v-model="userSettings.toolbar_theme" color="primary" mandatory class="mb-2">
          <v-btn x-large>Global</v-btn>
          <v-btn x-large>Light</v-btn>
          <v-btn x-large>Dark</v-btn>
        </v-btn-toggle>

        <div class="font-weight-bold my-1">Toolbar Style</div>
        <v-btn-toggle v-model="userSettings.toolbar_style" color="primary" mandatory class="mb-2">
          <v-btn x-large>Full</v-btn>
          <v-btn x-large>Solo</v-btn>
        </v-btn-toggle>

        <div class="font-weight-bold my-1">Content Layout</div>
        <v-btn-toggle v-model="userSettings.content_layout" color="primary" mandatory class="mb-2">
          <v-btn x-large>Fluid</v-btn>
          <v-btn x-large>Boxed</v-btn>
        </v-btn-toggle>

        <div class="font-weight-bold my-1">Menu Theme</div>
        <v-btn-toggle v-model="userSettings.menu_theme" color="primary" mandatory class="mb-2">
          <v-btn x-large>Global</v-btn>
          <v-btn x-large>Light</v-btn>
          <v-btn x-large>Dark</v-btn>
        </v-btn-toggle>

        <div class="font-weight-bold my-1">Primary Color</div>

        <v-color-picker
          v-model="userSettings.primary_color"
          class="primary"
          hide-mode-switch
          hide-inputs
          mode="hexa"
          :swatches="swatches"
          show-swatches
        ></v-color-picker>
      </div>

      <v-divider></v-divider>

      <v-row class="pa-2">
        <v-col cols="7">
          <div class="font-weight-bold my-1">Time Format</div>
          <v-menu
            offset-y
            left
            transition="slide-y-transition"
          >
            <template v-slot:activator="{ on }">
              <v-btn block v-on="on">{{ (new Date()) | formatDate }}</v-btn>
            </template>
            <v-list dense nav>
              <v-list-item v-for="format in availableFormats" :key="format.format" @click="setTimeFormat(format.format)">
                <v-list-item-title>{{ format.label }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

export default {
  data() {
    return {
      defaultSettings: {
        global_theme: 0,
        toolbar_theme: 0,
        toolbar_style: 0,
        content_boxed: 0,
        menu_theme: 0,
        primary_color: this.getPrimaryColor()
      },
      userSettings: {},
      right: false,
      timeout: null,
      swatches: [[
        this.$vuetify.theme.themes.dark.primary,
        this.$vuetify.theme.themes.light.primary
      ],[
        this.$vuetify.theme.themes.dark.error,
        this.$vuetify.theme.themes.dark.warning
      ],[
        this.$vuetify.theme.themes.dark.info,
        this.$vuetify.theme.themes.dark.success
      ]],

      // timezones
      availableTimezones: ['America/Los_Angeles', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney'],

      // time formats
      availableFormats: [{
        label: '07/31/2020',
        format: 'L'
      }, {
        label: 'Jul 31, 2020',
        format: 'll'
      }, {
        label: '20200731',
        format: 'YYYYMMDD'
      }]
    }
  },
  computed: {
    ...mapState('app', ['time', 'globalTheme']),
    ...mapGetters({
      getUserSettings: 'auth/getUserSettings',
      whoAmI: 'auth/getUser'
    })
  },
  watch: {
    right(val) {
      val || this.close()
    },
    'userSettings.primary_color': function (val) {
      this.globalTheme === 'dark' ? this.$vuetify.theme.themes.dark.primary = val : this.$vuetify.theme.themes.light.primary = val
    },
    'userSettings.global_theme': function (val) {
      this.setGlobalTheme((val === 0 ? 'light' : 'dark'))
      this.userSettings.primary_color = this.getPrimaryColor()
    },
    'userSettings.toolbar_theme': function (val) {
      const theme = val === 0 ? 'global' : (val === 1 ? 'light' : 'dark')

      this.setToolbarTheme(theme)
    },
    'userSettings.toolbar_style': function (val) {
      this.setToolbarDetached(val === 1)
    },
    'userSettings.menu_theme': function (val) {
      const theme = val === 0 ? 'global' : (val === 1 ? 'light' : 'dark')

      this.setMenuTheme(theme)
    },
    'userSettings.content_boxed': function (val) {
      this.setContentBoxed(val === 1)
    }
  },
  mounted() {
    this.getUserSettings ? this.userSettings = this.getUserSettings : this.userSettings = this.defaultSettings
    this.setSettings(this.userSettings)

    this.animate()
  },
  beforeDestroy() {
    if (this.timeout) clearTimeout(this.timeout)
  },
  methods: {
    ...mapMutations('app', ['setMenuTheme', 'setGlobalTheme', 'setToolbarTheme', 'setContentBoxed', 'setTimeZone', 'setTimeFormat', 'setToolbarDetached']),
    ...mapActions({
      updateSettings: 'auth/updateSettings',
      updateWhoAmIState: 'auth/signInSpa'
    }),
    setSettings(userSettings) {
      this.setGlobalTheme((userSettings.global_theme === 0 ? 'light' : 'dark'))
      this.setToolbarTheme((userSettings.toolbar_theme === 0 ? 'global' : (userSettings.toolbar_theme === 1 ? 'light' : 'dark')))
      this.setToolbarDetached((userSettings.toolbar_style !== 0))
      this.setMenuTheme((userSettings.menu_theme === 0 ? 'global' : (userSettings.menu_theme === 1 ? 'light' : 'dark')))
      this.setContentBoxed((userSettings.content_layout !== 0))
    },
    close() {
      this.updateSettings(this.userSettings).then(() => {
        this.updateWhoAmIState()
      }).catch((e) => {
        console.log(e)
      })
    },
    setTheme() {
      this.$vuetify.theme.dark = (this.userSettings.theme === 1)
    },
    animate() {
      if (this.timeout) clearTimeout(this.timeout)

      const time = (Math.floor(Math.random() * 10 + 1) + 10) * 1000

      this.timeout = setTimeout(() => {
        this.$animate(this.$refs.button.$el, 'bounce')
        this.animate()
      }, time)
    },
    getPrimaryColor () {
      return (this.$vuetify.theme.dark ? this.$vuetify.theme.themes.dark.primary : this.$vuetify.theme.themes.light.primary)
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-button {
  position: fixed;
  top: 340px;
  right: -20px;
  z-index: 6;

  .v-icon {
    margin-left: -18px;
    font-size: 1.3rem;
  }
}
</style>
