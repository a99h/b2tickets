import colors from 'vuetify/lib/util/colors'

export default {
  // global theme for the app
  globalTheme: 'dark', // light | dark

  // side menu theme, use global theme or custom
  menuTheme: 'global', // global | light | dark

  // toolbar theme, use global theme or custom
  toolbarTheme: 'light', // global | light | dark

  // show toolbar detached from top
  isToolbarDetached: true,

  // wrap pages content with a max-width
  isContentBoxed: false,

  // dark theme colors
  dark: {
    background: '#05090c',
    surface: '#111b27',
    primary: colors.cyan.lighten2,
    secondary: colors.yellow.lighten4,
    accent: colors.cyan.lighten4,
    error: colors.orange.darken4,
    warning: colors.amber.darken1,
    info: colors.lightBlue.darken1,
    success: colors.teal.darken2
  },

  // light theme colors
  light: {
    background: '#ffffff',
    surface: colors.cyan.lighten4,
    primary: colors.purple.darken4,
    secondary: colors.lightBlue.lighten2,
    accent: colors.cyan.darken4,
    error: colors.orange.darken4,
    info: colors.indigo,
    success: colors.green,
    warning: colors.amber
  }
}
