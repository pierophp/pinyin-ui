<template>
  <div class="print" :class="[sizeClass, typeClass, ideogramColoredClass]">
    <h2>{{filename}}</h2>

    <div v-for="(line, lineIndex) in lines" class="line">
      <file-block-print v-for="(block,index) in line"@click="blockClick()"
        :pinyin="block.p"
        :character="block.c"
        :highlight="block.h"
        :line-index="lineIndex"
        :block-index="index" />
    </div>

    <add-character-modal/>
    <div class="clearfix"></div>
    <highlight-modal/>
  </div>
</template>
<script>
  import FileBlockPrint from 'src/components/files/FileBlockPrint';
  import AddCharacterModal from 'src/components/modals/AddCharacter';
  import HighlightModal from 'src/components/modals/Highlight';

  import {
    mapActions,
    mapGetters,
  } from 'vuex';

  import {
    FILE_ACTION_FETCH,
    FILE_ACTION_FETCH_MY_CJK,
    FILE_ACTION_SAVE,
    FILE_GETTER,
  } from 'src/data/file/types';

  export default {
    name: 'file-print',

    components: {
      FileBlockPrint,
      AddCharacterModal,
      HighlightModal,
    },

    data() {
      return {
        filename: '',
        sizeClass: '',
        typeClass: '',
        ideogramColoredClass: '',
      };
    },

    watch: {
      $route() {
        if (this.$route.params.filename) {
          this.getFile(this.$route.params.filename);
        }

        this.updateCss();
      },
    },

    computed: {
      ...mapGetters({
        lines: FILE_GETTER,
      }),
    },
    created() {
      this.updateCss();
      this.fetchMyCjk();
      this.filename = this.$route.params.filename;
      this.getFile(this.filename);
      this.timer = setInterval(() => {
        this.save({
          filename: this.filename,
          content: this.lines,
        });
      }, 3000);
    },

    destroyed() {
      clearInterval(this.timer);
    },

    methods: {
      ...mapActions({
        fetch: FILE_ACTION_FETCH,
        fetchMyCjk: FILE_ACTION_FETCH_MY_CJK,
        save: FILE_ACTION_SAVE,
      }),

      getFile(filename) {
        this.fetch(filename);
      },
      updateCss() {
        this.sizeClass = this.$route.query.size;

        this.typeClass = '';
        if (this.$route.query.type === '2') {
          this.typeClass = 'character-only';
        }

        this.ideogramColoredClass = '';
        if (this.$route.query.ideogramColored === '1') {
          this.ideogramColoredClass = 'ideogram-colored';
        }
      },
    },

  };

</script>
<style>
  @import url(https://fonts.googleapis.com/earlyaccess/notosanssc.css);
  :root {
    --larger-pinyin-font-size: 23px;
    --larger-character-font-size: 34px;
    --normal-pinyin-font-size: 18px;
    --normal-character-font-size: 24px;
  }

  ::selection {
    background: #a8d1ff !important;
    color: #000 !important;
  }

  .print{
    padding-top: 15px;
    position: relative;
  }

  @media print
  {
    padding-top:0;
  }

  .character-only .pinyin {
    display: none;
  }

  .character-only .block {
    padding: 5px 0;
  }

  .print .pinyin,
  .print .pinyin span {
    background: none !important;
    font-size: var(--normal-pinyin-font-size);
    height: var(--normal-pinyin-font-size);
    min-width: 0;
  }

  .print .character,
  .print .character span {
    min-width: 0;
    font-family: 'Noto Sans SC', sans-serif;
    font-weight: lighter;
  }

  .larger.print .pinyin,
  .larger.print .pinyin span {
    font-size: var(--larger-pinyin-font-size);
    height: var(--larger-pinyin-font-size);
  }

  .larger .pinyin span {
    font-size: var(--larger-pinyin-font-size);
    height: var(--larger-pinyin-font-size);
    line-height: var(--larger-pinyin-font-size);
  }

  .larger .character span {
    font-size: var(--larger-character-font-size);
    height: var(--larger-character-font-size);
  }

  .print {
    margin: 10px 2px;
  }

  .print .character span {
    font-weight: 300;
  }

  .print .block {
    page-break-inside: avoid;
    padding: 1px 0;
    min-width: 0;
  }

  .print .block:hover {
    background: #fff;
  }

  .print a {
    color: #000;
    text-decoration: none;
  }

  .print .character span:hover {
    cursor: pointer;
    opacity: 0.5;
  }

  .print .line {
    margin-bottom: 25px;
  }

  .ideogram-colored .tone-1 {
    color: #0000ff!important;
  }

  .ideogram-colored .tone-2 {
    color: #d89000!important;
  }

  .ideogram-colored .tone-3 {
    color: #00a000!important;
  }

  .ideogram-colored .tone-4 {
    color: #ff0000!important;
  }

  .hide-pinyin {
    display: inline-block;
    width: 30px !important;
  }

  .highlight-1,
  .highlight-1:hover {
    background: #fffabf !important;
  }

  .highlight-2,
  .highlight-2:hover {
    background: #d4ffd1 !important;
  }

  .highlight-3,
  .highlight-3:hover {
    background: #ddf9ff !important;
  }

  .highlight-4,
  .highlight-4:hover {
    background: #ffe0fe !important;
  }

  .clearfix {
    user-select: none;
  }

</style>
