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
        <v-btn-toggle v-model="theme" color="primary" mandatory class="mb-2">
          <v-btn x-large>Light</v-btn>
          <v-btn x-large>Dark</v-btn>
        </v-btn-toggle>

        <div class="font-weight-bold my-1">Toolbar Theme</div>
        <v-btn-toggle v-model="toolbarTheme" color="primary" mandatory class="mb-2">
          <v-btn x-large>Global</v-btn>
          <v-btn x-large>Light</v-btn>
          <v-btn x-large>Dark</v-btn>
        </v-btn-toggle>

        <div class="font-weight-bold my-1">Toolbar Style</div>
        <v-btn-toggle v-model="toolbarStyle" color="primary" mandatory class="mb-2">
          <v-btn x-large>Full</v-btn>
          <v-btn x-large>Solo</v-btn>
        </v-btn-toggle>

        <div class="font-weight-bold my-1">Content Layout</div>
        <v-btn-toggle v-model="contentBoxed" color="primary" mandatory class="mb-2">
          <v-btn x-large>Fluid</v-btn>
          <v-btn x-large>Boxed</v-btn>
        </v-btn-toggle>

        <div class="font-weight-bold my-1">Menu Theme</div>
        <v-btn-toggle v-model="menuTheme" color="primary" mandatory class="mb-2">
          <v-btn x-large>Global</v-btn>
          <v-btn x-large>Light</v-btn>
          <v-btn x-large>Dark</v-btn>
        </v-btn-toggle>

        <div class="font-weight-bold my-1">Primary Color</div>

        <v-color-picker
          v-model="color"
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
import { mapMutations, mapState } from 'vuex'

export default {
  data() {
    return {
      right: false,
      theme: 0,
      toolbarTheme: 0,
      toolbarStyle: 0,
      contentBoxed: 0,
      menuTheme: 0,
      timeout: null,
      color: this.getPrimaryColor(),
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
    ...mapState('app', ['time', 'globalTheme'])
  },
  watch: {
    color(val) {
      this.globalTheme === 'dark' ? this.$vuetify.theme.themes.dark.primary = val : this.$vuetify.theme.themes.light.primary = val
    },
    theme(val) {
      this.setGlobalTheme((val === 0 ? 'light' : 'dark'))
      this.color = this.getPrimaryColor()
    },
    toolbarTheme(val) {
      const theme = val === 0 ? 'global' : (val === 1 ? 'light' : 'dark')

      this.setToolbarTheme(theme)
    },
    toolbarStyle(val) {
      this.setToolbarDetached(val === 1)
    },
    menuTheme(val) {
      const theme = val === 0 ? 'global' : (val === 1 ? 'light' : 'dark')

      this.setMenuTheme(theme)
    },
    contentBoxed(val) {
      this.setContentBoxed(val === 1)
    }
  },
  mounted() {
    this.globalTheme === 'dark' ? this.theme = 1 : this.theme = 0
    this.animate()
  },
  beforeDestroy() {
    if (this.timeout) clearTimeout(this.timeout)
  },
  methods: {
    ...mapMutations('app', ['setMenuTheme', 'setGlobalTheme', 'setToolbarTheme', 'setContentBoxed', 'setTimeZone', 'setTimeFormat', 'setRTL', 'setToolbarDetached']),
    setTheme() {
      this.$vuetify.theme.dark = (this.theme === 'dark')
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
