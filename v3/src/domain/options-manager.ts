import LocalStorage from "@/helpers/local-storage";
// import Vue from "vue";
import orderBy from "lodash/orderBy";

const languageCodes: { [lang: string]: string } = {
  pt: "portuguese",
  en: "english",
  es: "spanish",
  ko: "korean",
  ja: "japanese",
  it: "italian",
  fr: "french",
  de: "german",
};

class OptionsManager {
  protected options: any;

  protected i18n;

  constructor(i18n: any) {
    this.i18n = i18n;
  }

  getDefaultOptions() {
    let translationLanguage = "en";

    // const locale = Vue.prototype.$locale;
    const locale = "en";

    if (languageCodes[locale]) {
      translationLanguage = locale;
    }

    return {
      ideogramSize: "23px",
      pinyinSize: "15px",
      type: "1", // 1 = pinyin_ideograms_without_knew, 2 = ideograms_only, 4 = pinyin_ideograms
      ideogramColored: "1", // bool
      ideogramType: "s", // s = simplified, t = traditional
      ideogramSpaced: "1", // bool
      pinyinHide: "2", // 1 = ideograms, 2 = word
      color0: "#000000",
      color1: "#0000ff",
      color2: "#af31af",
      color3: "#00a000",
      color4: "#ff0000",
      translationLanguage,
      blockMarginBottom: "0px",
      hidePinyinSource: "editor",
    };
  }

  getLanguages(chinese: any) {
    const languages = [];

    for (const languageCode of Object.keys(languageCodes)) {
      languages.push({
        code: languageCode,
        language: this.i18n.t(languageCodes[languageCode]),
      });
    }

    if (chinese) {
      languages.push({
        code: "cmn-hans",
        language: this.i18n.t("chinese.simplified"),
      });
      languages.push({
        code: "cmn-hant",
        language: this.i18n.t("chinese.traditional"),
      });
    }

    return orderBy(languages, ["language"]);
  }

  getOptions() {
    if (this.options) {
      return this.options;
    }

    const options = LocalStorage.get("options");
    if (!options) {
      this.options = this.getDefaultOptions();
      return this.options;
    }

    const returnOptions = this.getDefaultOptions();

    for (const prop in options) {
      if (Object.prototype.hasOwnProperty.call(options, prop)) {
        // @ts-ignore
        returnOptions[prop] = options[prop];
      }
    }

    this.options = returnOptions;
    return this.options;
  }

  save(newOptions: any) {
    if (!this.options) {
      this.getOptions();
    }

    for (const prop in this.getDefaultOptions()) {
      if (Object.prototype.hasOwnProperty.call(newOptions, prop)) {
        this.options[prop] = newOptions[prop];
      }
    }

    LocalStorage.save("options", this.options);
  }
}

export default OptionsManager;
