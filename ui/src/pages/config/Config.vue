<template>
  <div>
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
            <md-option value="1">{{ $t('pinyin_ideograms') }}</md-option>
            <md-option value="2">{{ $t('ideograms_only') }}</md-option>
          </md-select>
        </md-input-container>

        <md-input-container>
          <label for="ideogramColored">{{ $t('ideograms_colored') }}</label>
          <md-select name="ideogramColored" id="ideogramColored" v-model="ideogramColored">
            <md-option value="1">{{ $t('yes') }}</md-option>
            <md-option value="0">{{ $t('no') }}</md-option>
          </md-select>
        </md-input-container>
      </md-tab>
    </md-tabs>

    <md-button class="md-raised md-primary" @click="save()">{{ $t('save') }}</md-button>
  </div>
</template>

<script>
import LocalStorage from 'src/helpers/local-storage';

export default{
  data() {
    return {
      size: 'normal',
      type: '1',
      ideogramColored: '1',
    };
  },
  created() {
    const options = LocalStorage.get('options');
    if (!options) {
      return;
    }
    this.size = options.size;
    this.type = options.type;
    this.ideogramColored = options.ideogramColored;
  },
  methods: {
    save() {
      LocalStorage.save('options', {
        size: this.size,
        type: this.type,
        ideogramColored: this.ideogramColored,
      });
    },
  },
};
</script>

<style>
</style>
