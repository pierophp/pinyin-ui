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

    <div class="character" :class="classBold" v-if="!block.small" @click.prevent="openBottomBar()">
      <ideograms-show :pinyin="pinyin" :character="character"/>
    </div>
  </div>
  </div>
</template>

<script>
  import separatePinyinInSyllables from 'src/helpers/separate-pinyin-in-syllables';
  import LocalStorage from 'src/helpers/local-storage';
  import IdeogramsShow from 'src/components/ideograms/Show';

  import {
    mapGetters,
  } from 'vuex';

  import {
  FILE_GETTER_MY_CJK,
  } from 'src/data/file/types';

  export default {
    name: 'file-block-print',
    components: {
      IdeogramsShow,
    },
    data() {
      return {
        classHighlight: '',
        classBold: '',
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
      isBold: {
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
        let options = LocalStorage.get('options');
        if (options === null) {
          options = {
            type: 1,
          };
        }
        this.classHighlight = `highlight-${this.highlight}`;
        this.classBold = '';
        if (this.isBold === 1) {
          this.classBold = 'bold';
        }
        const printData = [];
        const pinyin = separatePinyinInSyllables(this.pinyin).split(' ');
        const chars = this.character.toString();
        let withoutPinyn = true;
        for (let i = 0; i < chars.length; i += 1) {
          let newPinyin = '';
          let pinyinClass = '';

          if (options.type !== '3' && (this.myCjk[chars[i]] !== undefined || pinyin[i] === undefined || pinyin[i] === '')) {
            pinyinClass = 'hide-pinyin';
            newPinyin = '&nbsp;';
          } else if (pinyin[i]) {
            withoutPinyn = false;
            newPinyin = pinyin[i];
          } else {
            withoutPinyn = false;
            newPinyin = ' ';
          }

          printData.push({
            pinyinClass,
            character: chars[i],
            pinyin: newPinyin,
          });
        }

        if (withoutPinyn) {
          printData.forEach((item, i) => {
            printData[i].pinyinClass = '';
            printData[i].pinyin = '';
          });
        }

        if (chars.length === 0) {
          printData.push({
            pinyinClass: '',
            character: '',
            pinyin: `${this.pinyin}&nbsp;`,
          });
        }

        this.printData = printData;
      },
      openBottomBar() {
        this.$emit('open-bottom-bar', {
          pinyin: this.pinyin,
          character: this.character,
          lineIndex: this.lineIndex,
          blockIndex: this.blockIndex,
        });
      },
    },
  };
</script>

<style>

</style>
