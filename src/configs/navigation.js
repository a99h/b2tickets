import menuApps from './menus/apps.menu'
import menuPages from './menus/pages.menu'

export default {
  // main navigation - side menu
  menu: [{
    text: '',
    key: '',
    items: [
      { icon: 'mdi-view-dashboard-outline', key: 'menu.dashboard', text: 'Dashboard', link: '/dashboard/analytics' }
    ]
  }, {
    text: 'Apps',
    items: menuApps
  }, {
    text: 'Pages',
    key: 'menu.pages',
    items: menuPages
  }],

  // footer links
  footer: [{
    text: 'Logout',
    key: 'usermenu.signout',
    to: 'logout'
  }]
}
