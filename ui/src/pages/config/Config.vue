<template>
  <div>
    <h3>Settings</h3>
    <md-input-container>
      <label for="size">Size</label>
      <md-select name="size" id="size" v-model="size">
        <md-option value="1">Normal</md-option>
        <md-option value="2">Larger</md-option>
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

    <md-button class="md-raised md-primary">Save</md-button>
  </div>
</template>

<script>
export default{
  data() {
    return {
      size: '1',
      type: '1',
      ideogramColored: '1',
    };
  },
};
</script>

<style>
</style>
