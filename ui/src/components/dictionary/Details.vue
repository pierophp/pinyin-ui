<template>
  <div>
    <div v-if="dictionary.measure_words && dictionary.measure_words.length">
      <br>
      <b>{{$t('measure_words')}}:</b>
      {{ dictionary.measure_words.join(', ')}}
    </div>

    <div class="labels">
      <span v-if="dictionary.is_separable">{{ $t('separable_verb') }}</span>
      <span v-if="dictionary.hsk && dictionary.hsk < 999">HSK{{dictionary.hsk}}</span>
    </div>

    <dictionary-render
      v-for="type in types"
      v-bind:key="type"
      :pinyin="pinyin"
      :dictionary="dictionary"
      :type="type"
    />
  </div>
</template>

<script>
import DictionaryRender from 'src/components/dictionary/DictionaryRender';
import OptionsManager from 'src/domain/options-manager';

export default {
  name: 'dictionary-details',
  components: {
    DictionaryRender,
  },
  data() {
    const options = OptionsManager.getOptions();
    const translationLanguage = options.translationLanguage;

    const languagesPt = ['pt', 'chinese_tools_pt', 'glosbe_pt'];
    const languagesEs = ['chinese_tools_es', 'glosbe_es'];
    const languagesEn = ['unihan', 'cedict', 'chinese_tools_en', 'glosbe_en'];

    let types = [];
    if (translationLanguage === 'pt') {
      types = types
        .concat(languagesPt)
        .concat(languagesEs)
        .concat(languagesEn);
    } else if (translationLanguage === 'es') {
      types = types
        .concat(languagesEs)
        .concat(languagesPt)
        .concat(languagesEn);
    } else {
      types = types
        .concat(languagesEn)
        .concat(languagesEs)
        .concat(languagesPt);
    }

    return {
      types: types,
    };
  },
  methods: {},
  props: {
    pinyin: {},
    dictionary: {},
  },
};
</script>

<style>
.labels span {
  background: rgb(21, 88, 4);
  border-radius: 3px;
  color: #fff;
  font-size: 11px;
  margin: 0 2px 2px 0;
  padding: 2px 5px;
}
</style>
