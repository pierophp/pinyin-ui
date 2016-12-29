<template>
  <div class="block">
    <div class="pinyin">
      <span>
        <span v-for="data in printData" :class="[data.pinyinClass]">{{data.pinyin}}</span>
      </span>
    </div>
    <div class="character">
      <span v-for="data in printData" :class="[data.toneClass]" @click.prevent="openModal(data.character)">{{data.character}}</span>
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
        printData: [],
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

      myCjk() {
        this.updateRender();
      },
    },
    computed: {
      ...mapGetters({
        myCjk: FILE_GETTER_MY_CJK,
      }),
    },
    methods: {
      ...mapMutations({
        setMyCjkTemp: FILE_MUTATION_SET_MY_CJK_TEMP,
      }),

      updateRender() {
        const printData = [];
        const pinyin = separatePinyinInSyllables(this.pinyin).split(' ');
        const chars = this.character.toString();

        for (let i = 0; i < chars.length; i += 1) {
          let newPinyin = '';
          let pinyinClass = '';

          const tone = extractPinyinTone(pinyin[i]);
          if (this.myCjk.indexOf(chars[i]) > -1) {
            pinyinClass = 'hide-pinyin';
            newPinyin = ' ';
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
