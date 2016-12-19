/* eslint-disable no-undef */
class LocalStorage {
  static get(key) {
    const value = localStorage.getItem(key);

    if (!value) {
      return null;
    }

    if (/(\[|{)/.test(value.charAt(0))) {
      return JSON.parse(value);
    }

    return value;
  }

  static save(key, value) {
    if (value === null) {
      return;
    }

    if (typeof value === 'object') {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value);
    }
  }

  static remove(key) {
    localStorage.removeItem(key);
  }

  static has(key) {
    return !!LocalStorage.get(key);
  }
}

export default LocalStorage;
/* eslint-enable no-undef */
