<template>
    <div class="ideogram-show">
      <span v-for="data in printData" :class="[data.ideogramClass]" :style="{ color: data.toneColor }">
        {{data.character}}
      </span>
    </div>
</template>

<script>
  import separatePinyinInSyllables from 'src/helpers/separate-pinyin-in-syllables';
  import extractPinyinTone from 'src/helpers/extract-pinyin-tone';
  import specialIdeograms from 'src/helpers/special-ideograms-chars';
  import LocalStorage from 'src/helpers/local-storage';

  export default {
    name: 'ideograms-show',
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
    },
    created() {
      this.updateRender();
    },
    methods: {
      updateRender() {
        if (!this.pinyin && !this.character) {
          this.printData = [];
          return;
        }
        const printData = [];
        const colors = {
          0: '#000',
          1: '#0000ff',
          2: '#d16f00',
          3: '#00a000',
          4: '#ff0000',
        };

        let options = LocalStorage.get('options');
        if (options === null) {
          options = {};
        }

        if (options.color1) {
          colors[1] = options.color1;
        }

        if (options.color2) {
          colors[2] = options.color2;
        }

        if (options.color3) {
          colors[3] = options.color3;
        }

        if (options.color4) {
          colors[4] = options.color4;
        }

        if (options.color0) {
          colors[0] = options.color0;
        }

        let pinyin = '';
        if (this.pinyin) {
          pinyin = separatePinyinInSyllables(this.pinyin).split(' ');
        }

        const chars = this.character.toString();
        const numberRegex = new RegExp('^[0-9]+$');
        for (let i = 0; i < chars.length; i += 1) {
          let ideogramClass = '';

          const tone = extractPinyinTone(pinyin[i]);

          if (specialIdeograms.indexOf(chars[i]) > -1 || numberRegex.test(chars[i])) {
            ideogramClass = 'special-ideogram';
          }

          printData.push({
            ideogramClass,
            toneColor: colors[tone],
            character: chars[i],
          });
        }

        if (chars.length === 0) {
          printData.push({
            character: '',
          });
        }

        this.printData = printData;
      },
    },
  };
</script>
<style>
.ideogram-show {
  display:inline-block;
}
</style>
