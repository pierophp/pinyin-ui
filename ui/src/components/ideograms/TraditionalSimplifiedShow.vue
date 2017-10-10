<template>
    <div class="ideogram-show">
      <ideograms-show :pinyin="pinyin" :character="first"/>
      [<ideograms-show :pinyin="pinyin" :character="second"/>]
    </div>
</template>

<script>
  import IdeogramsShow from 'src/components/ideograms/Show';
  import OptionsManager from 'src/domain/options-manager';

  const options = OptionsManager.getOptions();

  export default {
    name: 'traditional-simplified-show',
    components: {
      IdeogramsShow,
    },
    props: {
      pinyin: '',
      simplified: '',
      traditional: '',
    },
    computed: {
      first: function first() {
        if (options.ideogramType === 't') {
          return this.traditional;
        }
        return this.simplified;
      },

      second: function second() {
        if (options.ideogramType === 't') {
          return this.simplified;
        }
        return this.traditional;
      },
    },
  };
</script>
