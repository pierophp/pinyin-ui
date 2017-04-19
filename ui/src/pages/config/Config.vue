<template>
  <div class="config-container">
    <h3>{{ $t('settings') }}</h3>
    <md-tabs>
      <md-tab id="visualization" :md-label="$t('visualization_mode')">
        <md-input-container>
          <label for="size">{{ $t('size') }}</label>
          <md-select name="size" id="size" v-model="size">
            <md-option value="normal">{{ $t('normal') }}</md-option>
            <md-option value="larger">{{ $t('larger') }}</md-option>
          </md-select>
        </md-input-container>

        <md-input-container>
          <label for="type">{{ $t('type') }}</label>
          <md-select name="type" id="type" v-model="type">
            <md-option value="1">{{ $t('pinyin_ideograms_without_knew') }}</md-option>
            <md-option value="2">{{ $t('ideograms_only') }}</md-option>
            <md-option value="3">{{ $t('pinyin_ideograms') }}</md-option>
          </md-select>
        </md-input-container>

        <md-input-container>
          <label for="ideogramColored">{{ $t('ideograms_colored') }}</label>
          <md-select name="ideogramColored" id="ideogramColored" v-model="ideogramColored">
            <md-option value="1">{{ $t('yes') }}</md-option>
            <md-option value="0">{{ $t('no') }}</md-option>
          </md-select>
        </md-input-container>

        <md-input-container>
          <label for="ideogramSpaced">{{ $t('ideograms_spaced') }}</label>
          <md-select name="ideogramSpaced" id="ideogramSpaced" v-model="ideogramSpaced">
            <md-option value="1">{{ $t('yes') }}</md-option>
            <md-option value="0">{{ $t('no') }}</md-option>
          </md-select>
        </md-input-container>

        <md-input-container>
          <label for="color1">{{ $t('tone_1_color') }}</label>
          <md-input name="color1" type="color" v-model="color1">
        </md-input-container>

        <md-input-container>
          <label for="color2">{{ $t('tone_2_color') }}</label>
          <md-input name="color2" type="color" v-model="color2">
        </md-input-container>

        <md-input-container>
          <label for="color3">{{ $t('tone_3_color') }}</label>
          <md-input name="color3" type="color" v-model="color3">
        </md-input-container>

        <md-input-container>
          <label for="color4">{{ $t('tone_4_color') }}</label>
          <md-input name="color4" type="color" v-model="color4">
        </md-input-container>

        <md-input-container>
          <label for="color0">{{ $t('tone_0_color') }}</label>
          <md-input name="color0" type="color" v-model="color0">
        </md-input-container>
      </md-tab>
    </md-tabs>

    <md-button class="md-raised md-primary" @click.native="save()">{{ $t('save') }}</md-button>
    <md-button class="md-raised md-primary" @click.native="restoreDefault()">{{ $t('restore_default') }}</md-button>
  </div>
</template>

<script>
import LocalStorage from 'src/helpers/local-storage';

export default{
  data() {
    return {
      dataDefault: {
        size: 'normal',
        type: '1',
        ideogramColored: '1',
        ideogramSpaced: '1',
        color0: '#000',
        color1: '#0000ff',
        color2: '#d16f00',
        color3: '#00a000',
        color4: '#ff0000',
      },
    };
  },
  created() {
    const options = LocalStorage.get('options');
    this.restoreDefault();
    if (!options) {
      return;
    }
    this.size = options.size;
    this.type = options.type;
    this.ideogramColored = options.ideogramColored;
    this.ideogramSpaced = options.ideogramSpaced;
    this.color1 = options.color1;
    this.color2 = options.color2;
    this.color3 = options.color3;
    this.color4 = options.color4;
    this.color0 = options.color0;
  },
  methods: {
    save() {
      LocalStorage.save('options', {
        size: this.size,
        type: this.type,
        ideogramColored: this.ideogramColored,
        ideogramSpaced: this.ideogramSpaced,
        color1: this.color1,
        color2: this.color2,
        color3: this.color3,
        color4: this.color4,
        color0: this.color0,
      });
    },
    restoreDefault() {
      this.size = this.dataDefault.size;
      this.type = this.dataDefault.type;
      this.ideogramColored = this.dataDefault.ideogramColored;
      this.ideogramSpaced = this.dataDefault.ideogramSpaced;
      this.color1 = this.dataDefault.color1;
      this.color2 = this.dataDefault.color2;
      this.color3 = this.dataDefault.color3;
      this.color4 = this.dataDefault.color4;
      this.color0 = this.dataDefault.color0;
    },
  },
};
</script>

<style>
.config-container{
  flex: 1;
  padding: 0 10px;
  overflow: auto;
}
</style>
