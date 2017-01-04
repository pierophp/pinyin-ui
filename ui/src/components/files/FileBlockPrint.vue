<template>
  <div class="block" :data-line="lineIndex" :data-block="blockIndex" :class="classHighlight" @click="blockClick()" ref="block">
    <div class="pinyin">
      <span>
        <span v-for="data in printData" :class="[data.pinyinClass]" v-html="data.pinyin"></span>
      </span>
    </div>
    <div class="character">
      <span v-for="data in printData" :class="[data.toneClass]" @click.prevent="openModal(data.character)">
        {{data.character}}
      </span>
    </div>
  </div>
  </div>
</template>

<script>
  import separatePinyinInSyllables from 'src/helpers/separate-pinyin-in-syllables';
  import extractPinyinTone from 'src/helpers/extract-pinyin-tone';

  import {
    mapMutations,
    mapGetters,
  } from 'vuex';

  import {
  FILE_MUTATION_SET_MY_CJK_TEMP,
  FILE_GETTER_MY_CJK,
  } from 'src/data/file/types';

  export default {
    name: 'file-block',
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
        type: Number,
        default: 0,
      },
      blockIndex: {
        type: Number,
        default: 0,
      },
      highlight: '',
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
        for (let i = 0; i < chars.length; i += 1) {
          let newPinyin = '';
          let pinyinClass = '';

          const tone = extractPinyinTone(pinyin[i]);
          if (this.myCjk.indexOf(chars[i]) > -1) {
            pinyinClass = 'hide-pinyin';
            newPinyin = '&nbsp;';
          } else if (pinyin[i]) {
            newPinyin = pinyin[i];
          } else {
            newPinyin = ' ';
          }

          printData.push({
            pinyinClass,
            toneClass: `tone-${tone}`,
            character: chars[i],
            pinyin: newPinyin,
          });
        }

        this.printData = printData;
      },
      openModal(character) {
        this.setMyCjkTemp(character);
        $('#addCharacterModal').modal();
      },
    },
  };
</script
>
<style>

</style>
