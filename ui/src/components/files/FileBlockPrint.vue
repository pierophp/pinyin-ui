<template>
  <div class="block">
    <div class="pinyin">
        <span v-html="pinyinPrint"></span>
      </div>
      <div class="character">
        <span v-html="characterPrint"></span>
      </div>
    </div>
  </div>
</template>

<script>
  import separatePinyinInSyllables from 'src/helpers/separate-pinyin-in-syllables';
  import extractPinyinTone from 'src/helpers/extract-pinyin-tone';

  export default {
    name: 'file-block',
    data() {
      return {
        pinyinPrint: '',
        characterPrint: '',
      };
    },
    props: {
      pinyin: '',
      character: '',
    },
    watch: {
      pinyin() {
        this.updateRender();
      },

      character() {
        this.updateRender();
      },
    },
    methods: {
      updateRender() {
        const myCjk = ['上', '的', '我', '人', '不', '圣'];
        let newPinyin = '';

        const pinyin = separatePinyinInSyllables(this.pinyin).split(' ');
        const chars = this.character.toString();
        let charsColored = '';
        for (let i = 0; i < chars.length; i += 1) {
          const tone = extractPinyinTone(pinyin[i]);
          charsColored += `<span class="tone-${tone}">${chars[i]}</span>`;

          if (myCjk.indexOf(chars[i]) > -1) {
            newPinyin += '<span class="hide-pinyin"> </span>';
          } else if (pinyin[i]) {
            newPinyin += pinyin[i];
          } else {
            newPinyin += '&nbsp;';
          }
        }

        this.pinyinPrint = newPinyin;
        this.characterPrint = charsColored;
      },
    },
    created() {
      this.updateRender();
    },
  };
</script>

<style>

</style>
