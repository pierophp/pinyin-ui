<template>
  <div>
    <h3>Settings</h3>
    <md-tabs>
      <md-tab id="visualization" md-label="Visualization">
        <md-input-container>
          <label for="size">Size</label>
          <md-select name="size" id="size" v-model="size">
            <md-option value="normal">Normal</md-option>
            <md-option value="larger">Larger</md-option>
          </md-select>
        </md-input-container>

        <md-input-container>
          <label for="type">Type</label>
          <md-select name="type" id="type" v-model="type">
            <md-option value="1">Pinyin + Ideograms</md-option>
            <md-option value="2">Ideograms only</md-option>
          </md-select>
        </md-input-container>

        <md-input-container>
          <label for="ideogramColored">Ideogram colored</label>
          <md-select name="ideogramColored" id="ideogramColored" v-model="ideogramColored">
            <md-option value="1">Yes</md-option>
            <md-option value="0">No</md-option>
          </md-select>
        </md-input-container>
      </md-tab>
    </md-tabs>

    <md-button class="md-raised md-primary" @click="save()">Save</md-button>
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
