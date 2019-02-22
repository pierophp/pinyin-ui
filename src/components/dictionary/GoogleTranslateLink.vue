<template>
  <a :href="url" target="_blank" class="translate">{{$t('translate')}}</a>
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
        this.word,
    };
  },
};
</script>

<style>
a.translate {
  color: #a7a6a6 !important;
  font-size: 13px;
}
</style>
