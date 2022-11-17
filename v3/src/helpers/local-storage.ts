let verificationIos: null | boolean = null;

function isIos(): boolean {
  if (verificationIos === null) {
    verificationIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  return verificationIos;
}

/* eslint-disable no-undef */
class LocalStorage {
  static get(key: string) {
    if (isIos()) {
      let value = localStorage.getItem(key);

      if (!value) {
        // @ts-ignore
        if (!window.frames["iframe-storage"].get) {
          // eslint-disable-next-line
          console.log("Iframe not loaded yet - GET");
          return "";
        }

        // @ts-ignore
        value = window.frames["iframe-storage"].get(key);
        if (value) {
          LocalStorage.save(key, value);
        }

        return value;
      }

      if (/(\[|{)/.test(value.charAt(0))) {
        return JSON.parse(value);
      }

      return value;
    }

    // @ts-ignore
    if (!window.frames["iframe-storage"].get) {
      // eslint-disable-next-line
      console.log("Iframe not loaded yet - GET");
      return "";
    }

    // @ts-ignore
    return window.frames["iframe-storage"].get(key);
  }

  static save(key: string, value: any) {
    if (isIos()) {
      if (value === null) {
        return;
      }

      if (typeof value === "object") {
        localStorage.setItem(key, JSON.stringify(value));
      } else {
        localStorage.setItem(key, value);
      }
    }

    // @ts-ignore
    window.frames["iframe-storage"].save(key, value);
  }

  static remove(key: string) {
    if (isIos()) {
      localStorage.removeItem(key);
    }

    // @ts-ignore
    window.frames["iframe-storage"].remove(key);
  }

  static has(key: string) {
    if (isIos()) {
      if (LocalStorage.get(key)) {
        return true;
      }
    }
    // @ts-ignore
    if (!window.frames["iframe-storage"].has) {
      // eslint-disable-next-line
      console.log("Iframe not loaded yet - HAS");
      return false;
    }

    // @ts-ignore
    return window.frames["iframe-storage"].has(key);
  }
}

export default LocalStorage;
