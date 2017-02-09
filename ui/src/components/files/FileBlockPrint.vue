<template>
  <div class="block" :data-line="lineIndex" :data-block="blockIndex" :class="classHighlight" @click="blockClick()" ref="block">

    <div class="image" v-if="block.small">
      <img :src="block.small" referrerpolicy="no-referrer"/>
    </div>
    <div class="pinyin" v-if="!block.small">
      <span>
        <span v-for="data in printData" :class="[data.pinyinClass]" v-html="data.pinyin"></span>
      </span>
    </div>

    <div class="character" v-if="!block.small">
      <span v-for="data in printData" :class="[data.toneClass, data.ideogramClass]" @click.prevent="openModal(data.character)">
        {{data.character}}
      </span>
    </div>
  </div>
  </div>
</template>

<script>
  import separatePinyinInSyllables from 'src/helpers/separate-pinyin-in-syllables';
  import extractPinyinTone from 'src/helpers/extract-pinyin-tone';
  import specialIdeograms from 'src/helpers/special-ideograms-chars';

  import {
    mapMutations,
    mapGetters,
  } from 'vuex';

  import {
  FILE_MUTATION_SET_MY_CJK_TEMP,
  FILE_GETTER_MY_CJK,
  } from 'src/data/file/types';

  export default {
    name: 'file-block-print',
    data() {
      return {
        classHighlight: '',
        printData: [],
      };
    },
    props: {
      pinyin: '',
      character: '',
      lineIndex: {
        default: 0,
      },
      blockIndex: {
        default: 0,
      },
      highlight: '',
      block: '',
    },
    watch: {
      pinyin() {
        this.updateRender();
      },

      character() {
        this.updateRender();
      },

      highlight() {
        this.updateRender();
      },

      myCjk() {
        this.updateRender();
      },
    },
    computed: {
      ...mapGetters({
        myCjk: FILE_GETTER_MY_CJK,
      }),
    },
    created() {
      this.updateRender();
    },
    methods: {
      ...mapMutations({
        setMyCjkTemp: FILE_MUTATION_SET_MY_CJK_TEMP,
      }),

      blockClick() {
        if (!this.highlight) {
          return;
        }

        const range = document.createRange();
        const sel = window.getSelection();
        range.setStart(this.$refs.block.childNodes[0], 0);
        range.setEnd(this.$refs.block.childNodes[1], 0);
        sel.removeAllRanges();
        sel.addRange(range);
      },

      updateRender() {
        this.classHighlight = `highlight-${this.highlight}`;
        const printData = [];
        const pinyin = separatePinyinInSyllables(this.pinyin).split(' ');
        const chars = this.character.toString();
        let withoutPinyn = true;
        const numberRegex = new RegExp('^[0-9]+$');
        for (let i = 0; i < chars.length; i += 1) {
          let newPinyin = '';
          let pinyinClass = '';
          let ideogramClass = '';

          const tone = extractPinyinTone(pinyin[i]);
          if (this.myCjk.indexOf(chars[i]) > -1 || pinyin[i] === undefined || pinyin[i] === '') {
            pinyinClass = 'hide-pinyin';
            newPinyin = '&nbsp;';
          } else if (pinyin[i]) {
            withoutPinyn = false;
            newPinyin = pinyin[i];
          } else {
            withoutPinyn = false;
            newPinyin = ' ';
          }

          if (specialIdeograms.indexOf(chars[i]) > -1 || numberRegex.test(chars[i])) {
            ideogramClass = 'special-ideogram';
          }

          printData.push({
            ideogramClass,
            pinyinClass,
            toneClass: `tone-${tone}`,
            character: chars[i],
            pinyin: newPinyin,
          });
        }

        if (withoutPinyn) {
          printData.forEach((item, i) => {
            printData[i].pinyinClass = '';
          });
        }

        if (chars.length === 0) {
          printData.push({
            pinyinClass: '',
            toneClass: '',
            character: '',
            pinyin: `${this.pinyin}&nbsp;`,
          });
        }

        this.printData = printData;
      },
      openModal(character) {
        let add = true;
        if (this.myCjk.indexOf(character) > -1) {
          add = false;
        }

        this.setMyCjkTemp(character);
        this.$emit('open-modal', add);
      },
    },
  };
</script
>
<style>

</style>
