let verificationIos = null;

function isIos() {
  if (verificationIos === null) {
    verificationIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  return verificationIos;
}

/* eslint-disable no-undef */
class LocalStorage {
  static get(key) {
    if (isIos()) {
      const value = localStorage.getItem(key);

      if (!value) {
        return null;
      }

      if (/(\[|{)/.test(value.charAt(0))) {
        return JSON.parse(value);
      }

      return value;
    }

    if (!window.frames['iframe-storage'].get) {
      // eslint-disable-next-line
      console.log('Iframe not loaded yet - GET');
      return '';
    }

    return window.frames['iframe-storage'].get(key);
  }

  static save(key, value) {
    if (isIos()) {
      if (value === null) {
        return;
      }

      if (typeof value === 'object') {
        localStorage.setItem(key, JSON.stringify(value));
      } else {
        localStorage.setItem(key, value);
      }

      return;
    }

    window.frames['iframe-storage'].save(key, value);
  }

  static remove(key) {
    if (isIos()) {
      localStorage.removeItem(key);
      return;
    }
    window.frames['iframe-storage'].remove(key);
  }

  static has(key) {
    if (isIos()) {
      return !!LocalStorage.get(key);
    }

    if (!window.frames['iframe-storage'].has) {
      // eslint-disable-next-line
      console.log('Iframe not loaded yet - HAS');
      return false;
    }
    return window.frames['iframe-storage'].has(key);
  }
}

export default LocalStorage;
