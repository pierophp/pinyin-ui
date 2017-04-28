import LocalStorage from 'src/helpers/local-storage';

class OptionsManager {
  static options;

  static getDefaultOptions() {
    return {
      size: 'normal', // normal, larger
      type: '1', // 1 = pinyin_ideograms_without_knew, 2 = ideograms_only, 4 = pinyin_ideograms
      ideogramColored: '1', // bool
      ideogramSpaced: '1',  // bool
      pinyinHide: '1',  // 1 = ideograms, 2 = wprd
      color0: '#000000',
      color1: '#0000ff',
      color2: '#d16f00',
      color3: '#00a000',
      color4: '#ff0000',
    };
  }

  static getOptions() {
    if (this.options) {
      return this.options;
    }

    const options = LocalStorage.get('options');
    if (!options) {
      this.options = this.getDefaultOptions();
      return this.options;
    }

    const returnOptions = this.getDefaultOptions();

    for (const prop in options) {
      if (Object.prototype.hasOwnProperty.call(options, prop)) {
        returnOptions[prop] = options[prop];
      }
    }

    this.options = returnOptions;
    return this.options;
  }
}

export default OptionsManager;
