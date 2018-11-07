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
          <option value="">{{ $t('no_translation') }}</option>
          <option v-for="(language, languageId) in languages" v-bind:key="languageId"  :value="language.code">{{ language.language }}</option>
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
      <md-field v-show="ideogramColored == 1">
        <label for="color1">{{ $t('tone_1_color') }}</label>
        <md-input name="color1" type="color" v-model="color1"/>
      </md-field>

      <md-field v-show="ideogramColored == 1">
        <label for="color2">{{ $t('tone_2_color') }}</label>
        <md-input name="color2" type="color" v-model="color2"/>
      </md-field>

      <md-field v-show="ideogramColored == 1">
        <label for="color3">{{ $t('tone_3_color') }}</label>
        <md-input name="color3" type="color" v-model="color3" />
      </md-field>

      <md-field v-show="ideogramColored == 1">
        <label for="color4">{{ $t('tone_4_color') }}</label>
        <md-input name="color4" type="color" v-model="color4" />
      </md-field>

      <md-field v-show="ideogramColored == 1">
        <label for="color0">{{ $t('tone_0_color') }}</label>
        <md-input name="color0" type="color" v-model="color0"/>
      </md-field>
    </div>

    <md-button class="md-raised md-primary" @click.native="save()">{{ $t('save') }}</md-button>
    <md-button class="md-raised md-primary" @click.native="restoreDefault()">{{ $t('restore_default') }}</md-button>

    <md-snackbar md-position="center" :md-duration="1300" :md-active.sync="saveNotify">
      <span>{{ $t('saved_successfully') }}</span>
    </md-snackbar>
  </div>
</template>

<script>
import LocalStorage from 'src/helpers/local-storage';
import OptionsManager from 'src/domain/options-manager';

export default {
  data() {
    const dataDefault = OptionsManager.getDefaultOptions();

    const data = {};
    for (const prop in dataDefault) {
      if (Object.prototype.hasOwnProperty.call(dataDefault, prop)) {
        data[prop] = dataDefault[prop];
      }
    }

    data.dataDefault = dataDefault;
    data.languages = OptionsManager.getLanguages(false);
    data.saveNotify = false;

    return data;
  },
  created() {
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
      OptionsManager.save(this);
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
}

.config-container .size-container {
  display: flex;
  flex-wrap: wrap;
}

.config-container .size-container .md-field {
  margin-right: 15px;
  width: 150px;
}

.config-container .language-container {
  display: flex;
  flex-wrap: wrap;
}

.config-container .language-container .md-field {
  margin-right: 15px;
  flex: 1;
  max-width: 200px;
}

.config-container .pinyin-container {
  display: flex;
  flex-wrap: wrap;
}

.config-container .pinyin-container .md-field {
  margin-right: 15px;
  width: 140px;
}

.config-container .ideogram-container .md-field {
  margin-right: 15px;
  flex: 1;
  max-width: 200px;
}

.config-container .ideogram-container {
  display: flex;
  flex-wrap: wrap;
}

.config-container .color-container {
  display: flex;
  flex-wrap: wrap;
}

.config-container .color-container .md-field {
  width: 95px;
  margin-bottom: 10px;
  margin-right: 15px;
}
</style>
