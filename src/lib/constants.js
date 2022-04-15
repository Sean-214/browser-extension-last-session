const THEME_LIGHT = {
  value: 'light',
  label: 'theme_light',
  icon: {
    16: 'assets/icons/light/icon-16.png',
    32: 'assets/icons/light/icon-32.png',
    48: 'assets/icons/light/icon-48.png',
    64: 'assets/icons/light/icon-64.png',
    128: 'assets/icons/light/icon-128.png',
  },
};
const THEME_DARK = {
  value: 'dark',
  label: 'theme_dark',
  icon: {
    16: 'assets/icons/dark/icon-16.png',
    32: 'assets/icons/dark/icon-32.png',
    48: 'assets/icons/dark/icon-48.png',
    64: 'assets/icons/dark/icon-64.png',
    128: 'assets/icons/dark/icon-128.png',
  },
};

module.exports = {
  POPUP_PATH: 'popup.html',
  RECENT_PATH: 'recent.html',
  OPTIONS_PATH: 'options.html',
  THEME_DEFAULT: THEME_LIGHT,
  THEME_LIST: [THEME_LIGHT, THEME_DARK],
};
