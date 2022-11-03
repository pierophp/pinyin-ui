<template>
  <div class="config-container">
    <h3>{{ $t('settings') }}</h3>
    <div class="size-container">
      <div class="field-container">
        <label for="pinyinSize">{{ $t('Pinyin') }} - {{ $t('size') }}</label>
        <select v-model="pinyinSize" name="pinyinSize" class="select-field">
          <option value="12px">12</option>
          <option value="13px">13</option>
          <option value="14px">14</option>
          <option value="15px">15</option>
          <option value="16px">16</option>
          <option value="17px">17</option>
          <option value="18px">18</option>
          <option value="19px">19</option>
          <option value="20px">20</option>
          <option value="21px">21</option>
          <option value="22px">22</option>
          <option value="23px">23</option>
          <option value="24px">24</option>
          <option value="25px">25</option>
          <option value="26px">26</option>
          <option value="27px">27</option>
        </select>
      </div>

      <div class="field-container">
        <label for="ideogramSize">{{ $t('ideogram') }} - {{ $t('size') }}</label>
        <select v-model="ideogramSize" name="ideogramSize" class="select-field">
          <option value="17px">17</option>
          <option value="18px">18</option>
          <option value="19px">19</option>
          <option value="20px">20</option>
          <option value="21px">21</option>
          <option value="22px">22</option>
          <option value="23px">23</option>
          <option value="24px">24</option>
          <option value="25px">25</option>
          <option value="26px">26</option>
          <option value="27px">27</option>
          <option value="27px">28</option>
          <option value="29px">29</option>
          <option value="30px">30</option>
          <option value="31px">31</option>
          <option value="32px">32</option>
          <option value="33px">33</option>
          <option value="34px">34</option>
          <option value="35px">35</option>
          <option value="36px">36</option>
          <option value="37px">37</option>
          <option value="38px">38</option>
          <option value="39px">39</option>
          <option value="40px">40</option>
        </select>
      </div>

      <div class="field-container">
        <label for="blockMarginBottom">{{ $t('margin_bottom') }}</label>
        <select v-model="blockMarginBottom" name="blockMarginBottom" class="select-field">
          <option value="0px">0</option>
          <option value="1px">1</option>
          <option value="2px">2</option>
          <option value="3px">3</option>
          <option value="4px">4</option>
          <option value="5px">5</option>
          <option value="6px">6</option>
          <option value="7px">7</option>
          <option value="8px">8</option>
          <option value="9px">9</option>
          <option value="10px">10</option>
          <option value="11px">11</option>
          <option value="12px">12</option>
          <option value="13px">13</option>
          <option value="14px">14</option>
          <option value="15px">15</option>
        </select>
      </div>
    </div>

    <div class="language-container">
      <div class="field-container">
        <label for="translationLanguage">{{ $t('translation_language') }}</label>
        <select v-model="translationLanguage" name="translationLanguage" class="select-field">
          <option value>{{ $t('no_translation') }}</option>
          <option
            v-for="(language, languageId) in languages"
            v-bind:key="languageId"
            :value="language.code"
          >{{ language.language }}</option>
        </select>
      </div>

      <div class="field-container">
        <label for="ideogramType">{{ $t('ideogram_type') }}</label>
        <select v-model="ideogramType" name="ideogramType" class="select-field">
          <option value="s">{{ $t('simplified') }}</option>
          <option value="t">{{ $t('traditional') }}</option>
        </select>
      </div>
    </div>

    <div class="pinyin-container">
      <div class="field-container">
        <label for="type">{{ $t('show_pinyin') }}</label>
        <select v-model="type" name="type" class="select-field">
          <option value="1">{{ $t('without_knew') }}</option>
          <option value="4" v-if="hidePinyinSource === 'editor'">{{ $t('with_unknew') }}</option>
          <option value="2">{{ $t('without_any') }}</option>
          <option value="3">{{ $t('all') }}</option>
        </select>
      </div>

      <div class="field-container">
        <label for="pinyinHide">{{ $t('hide_pinyin_by') }}</label>
        <select v-model="pinyinHide" name="pinyinHide" class="select-field">
          <option value="1">{{ $t('ideogram') }}</option>
          <option value="2">{{ $t('word') }}</option>
        </select>
      </div>

      <div class="field-container">
        <label for="hidePinyinSource">{{ $t('hide_pinyin_from') }}</label>
        <select v-model="hidePinyinSource" name="hidePinyinSource" class="select-field">
          <option value="editor">pinzi.org</option>
          <option value="2pinyin">2pinyin.net</option>
        </select>
      </div>
    </div>

    <div class="ideogram-container">
      <div class="field-container">
        <label for="ideogramColored">{{ $t('ideograms_colored') }}</label>
        <select v-model="ideogramColored" name="ideogramColored" class="select-field">
          <option value="1">{{ $t('yes') }}</option>
          <option value="0">{{ $t('no') }}</option>
        </select>
      </div>

      <div class="field-container">
        <label for="ideogramSpaced">{{ $t('ideograms_spaced') }}</label>
        <select v-model="ideogramSpaced" name="ideogramSpaced" class="select-field">
          <option value="1">{{ $t('yes') }}</option>
          <option value="0">{{ $t('no') }}</option>
        </select>
      </div>
    </div>

    <div class="color-container">
      <div class="field-container" v-show="ideogramColored == 1">
        <label for="color1">{{ $t('tone_1_color') }}</label>
        <input type="color" name="color1" v-model="color1">
      </div>

      <div class="field-container" v-show="ideogramColored == 1">
        <label for="color2">{{ $t('tone_2_color') }}</label>
        <input type="color" name="color2" v-model="color2">
      </div>

      <div class="field-container" v-show="ideogramColored == 1">
        <label for="color3">{{ $t('tone_3_color') }}</label>
        <input type="color" name="color3" v-model="color3">
      </div>

      <div class="field-container" v-show="ideogramColored == 1">
        <label for="color4">{{ $t('tone_4_color') }}</label>
        <input type="color" name="color4" v-model="color4">
      </div>

      <div class="field-container" v-show="ideogramColored == 1">
        <label for="color0">{{ $t('tone_0_color') }}</label>
        <input type="color" name="color0" v-model="color0">
      </div>
    </div>

    <md-button class="md-raised md-primary" @click.native="save()">{{ $t('save') }}</md-button>
    <md-button
      class="md-raised md-primary"
      @click.native="restoreDefault()"
    >{{ $t('restore_default') }}</md-button>

    <md-snackbar md-position="center" :md-duration="1300" :md-active.sync="saveNotify">
      <span>{{ $t('saved_successfully') }}</span>
    </md-snackbar>
  </div>
</template>

<script>
import LocalStorage from 'src/helpers/local-storage';
import OptionsManager from 'src/domain/options-manager';

let optionsManager;

export default {
  data() {
    if (!optionsManager) {
      optionsManager = new OptionsManager(this.$i18n);
    }
    const dataDefault = optionsManager.getDefaultOptions();

    const data = {};
    for (const prop in dataDefault) {
      if (Object.prototype.hasOwnProperty.call(dataDefault, prop)) {
        data[prop] = dataDefault[prop];
      }
    }

    data.dataDefault = dataDefault;
    data.languages = optionsManager.getLanguages(false);
    data.saveNotify = false;

    return data;
  },
  created() {
    if (!optionsManager) {
      optionsManager = new OptionsManager(this.$i18n);
    }

    const options = LocalStorage.get('options');
    if (!options) {
      return;
    }

    for (const prop in options) {
      if (Object.prototype.hasOwnProperty.call(options, prop)) {
        this[prop] = options[prop];
      }
    }
  },
  methods: {
    save() {
      optionsManager.save(this);
      this.saveNotify = true;
    },
    restoreDefault() {
      for (const prop in this.dataDefault) {
        if (Object.prototype.hasOwnProperty.call(this.dataDefault, prop)) {
          this[prop] = this.dataDefault[prop];
        }
      }
    },
  },
};
</script>

<style>
.config-container {
  flex: 1;
  padding: 0 10px 20px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.config-container .size-container {
  display: flex;
  flex-wrap: wrap;
}

.config-container .language-container {
  display: flex;
  flex-wrap: wrap;
}

.config-container .pinyin-container {
  display: flex;
  flex-wrap: wrap;
}

.config-container .ideogram-container {
  display: flex;
  flex-wrap: wrap;
}

.config-container .color-container {
  display: flex;
  flex-wrap: wrap;
}

.config-container .color-container .field-container {
  width: 95px;
  margin-bottom: 10px;
  margin-right: 15px;
}

.config-container .color-container input {
  border: 0;
  padding: 0;
  background-color: transparent;
  width: 100%;
  height: 30px;
}
</style>
