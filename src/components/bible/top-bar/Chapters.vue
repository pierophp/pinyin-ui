<template>
  <div>
    <span @click="goToBible" class="bible-title">
      <md-icon>arrow_back</md-icon>
      {{ booksName($route.params.book, exhibitionType) }}
    </span>
  </div>
</template>
<script>
import booksName from 'src/data/bible/names';
import OptionsManager from 'src/domain/options-manager';

export default {
  name: 'bible-chapters-top-bar',
  data() {
    return {
      options: {},
    };
  },
  computed: {
    exhibitionType() {
      return `cmn-han${this.options.ideogramType}`;
    },
  },
  created() {
    const optionsManager = new OptionsManager(this.$i18n);
    this.options = optionsManager.getOptions();
  },
  methods: {
    booksName,
    goToBible() {
      this.$router.push('/bible');
    },
  },
};
</script>

<style>
.bible-title {
  cursor: pointer;
  font-size: 18px;
  font-family: 'Noto Sans SC', 'Noto Sans TC', sans-serif;
  color: #fff;
}

.top-bar-container .bible-title i {
  color: #fff !important;
}
</style>
