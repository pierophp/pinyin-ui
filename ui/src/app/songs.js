export default {
  showMenu: true,
  title: 'app.songs',
  menu: [
    {
      icon: 'music_note',
      title: 'menu.songs',
      action: 'goTo',
      link: '/songs',
    },
    {
      icon: 'translate',
      title: 'menu.my_ideograms',
      action: 'goTo',
      link: '/my-cjk',
    },
    {
      icon: 'settings',
      title: 'menu.settings',
      action: 'goTo',
      link: '/config',
    },
    {
      icon: 'help',
      title: 'menu.about',
      action: 'goTo',
      link: '/about',
    },
    {
      icon: 'power_settings_new',
      title: 'menu.logout',
      action: 'logout',
      link: '',
    },
  ],
};
