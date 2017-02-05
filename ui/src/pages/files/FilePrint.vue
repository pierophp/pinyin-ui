<template>
  <div class="print" :class="[sizeClass, typeClass, ideogramColoredClass, ideogramSpacedClass]">
    <h2>{{filename}}</h2>

    <div v-for="(line, lineIndex) in lines" class="line">
      <file-block-print v-for="(block,index) in line"@click="blockClick()"@open-modal="openModal"
        :pinyin="block.p"
        :character="block.c"
        :highlight="block.h"
        :line-index="lineIndex"
        :block-index="index" />
        <div class="clearfix"></div>
    </div>
    <div class="loading-container">
      <md-spinner md-indeterminate v-if="fileLoading"></md-spinner>
    </div>
    <add-remove-character-modal ref="addRemoveCharacterModal"/>
    <highlight-modal/>
  </div>
</template>
<script>
  import FileBlockPrint from 'src/components/files/FileBlockPrint';
  import AddRemoveCharacterModal from 'src/components/modals/AddRemoveCharacter';
  import HighlightModal from 'src/components/modals/Highlight';
  import LocalStorage from 'src/helpers/local-storage';

  import {
    mapActions,
    mapGetters,
  } from 'vuex';

  import {
    FILE_ACTION_FETCH,
    FILE_ACTION_FETCH_MY_CJK,
    FILE_ACTION_SAVE,
    FILE_GETTER,
    FILE_GETTER_LOADING,
  } from 'src/data/file/types';

  export default {
    name: 'file-print',

    components: {
      FileBlockPrint,
      AddRemoveCharacterModal,
      HighlightModal,
    },

    data() {
      return {
        filename: '',
        sizeClass: '',
        typeClass: '',
        ideogramColoredClass: '',
        ideogramSpacedClass: '',
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
        fileLoading: FILE_GETTER_LOADING,
      }),
    },
    created() {
      this.updateCss();
    },
    mounted() {
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
        let options = LocalStorage.get('options');
        if (options === null) {
          options = {
            size: 'normal',
          };
        }

        this.sizeClass = options.size;

        this.typeClass = '';
        if (options.type === '2') {
          this.typeClass = 'character-only';
        }

        this.ideogramColoredClass = 'ideogram-colored';
        if (options.ideogramColored === '0') {
          this.ideogramColoredClass = '';
        }

        this.ideogramSpacedClass = 'ideogram-spaced';
        if (options.ideogramSpaced === '0') {
          this.ideogramSpacedClass = '';
        }
      },

      openModal(add) {
        this.$refs.addRemoveCharacterModal.openDialog(add);
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
    padding-top: 25px;
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
    height: calc(var(--normal-pinyin-font-size) + 1);
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
    height: calc(var(--larger-pinyin-font-size) + 2);
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
    display: inline-block;
    font-weight: 300;
    width: 25px;
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
    color: #d16f00!important;
  }

  .ideogram-colored .tone-3 {
    color: #00a000!important;
  }

  .ideogram-colored .tone-4 {
    color: #ff0000!important;
  }

  .ideogram-spaced .block {
    margin-right: 6px;
  }

  .hide-pinyin {
    display: inline-block;
    width: 40px !important;
  }

  .highlight-1,
  .highlight-1:hover {
    background: #fffbce !important;
  }

  .highlight-2,
  .highlight-2:hover {
    background: #e4ffe2 !important;
  }

  .highlight-3,
  .highlight-3:hover {
    background: #e2faff !important;
  }

  .highlight-4,
  .highlight-4:hover {
    background: #fff2fe !important;
  }

  .clearfix {
    user-select: none;
  }

  .loading-container{
    text-align: center;
  }

</style>
