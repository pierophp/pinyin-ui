<template>
  <div class="translation" v-if="translation">
    <a href="javascript:void(0)" @click="openTranslation">{{$t('translation')}}</a>
    <div class="text" v-html="translation" v-show="show"></div>
  </div>
</template>

<script>
export default {
  name: 'file-row-translation',
  data() {
    return {
      translation: '',
    };
  },
  props: {
    line: {
      type: Array,
      default: () => [],
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    openTranslation() {
      this.$emit('toogle-translation');
    },
  },
  mounted() {
    if (this.line[0] === undefined) {
      return;
    }

    if (this.line[0].trans === undefined) {
      return;
    }

    this.translation = this.line[0].trans;
  },
};
</script>

<style>
.translation a {
  color: #a8a4a4 !important;
  font-size: 9px;
}
</style>
