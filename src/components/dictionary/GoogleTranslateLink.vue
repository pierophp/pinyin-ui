<template>
  <span v-if="sourceLanguage !== targetLanguage">
    &nbsp;
    <a :href="url" target="_blank" class="translate">{{$t('translate')}}</a>
  </span>
</template>

<script>
export default {
  name: 'google-translate-link',
  props: {
    word: '',
    sourceLanguage: '',
    targetLanguage: '',
  },
  data() {
    return {
      url:
        'https://translate.google.com.br/#view=home&op=translate&sl=' +
        this.sourceLanguage +
        '&tl=' +
        this.targetLanguage +
        '&text=' +
        encodeURIComponent(this.word),
    };
  },
};
</script>

<style>
span a.translate {
  color: #757575 !important;
  font-size: 11px;
}
</style>
