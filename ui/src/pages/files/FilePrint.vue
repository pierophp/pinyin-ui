<template>
  <div class="print" :class="[sizeClass, typeClass, ideogramColoredClass, ideogramSpacedClass]">
    <h2>{{filename}}</h2>
    <file-row-print v-for="(line, lineIndex) in lines"
        :line="line"
        :lineIndex="lineIndex"
        @open-modal="openModal"/>

    <div class="loading-container">
      <md-spinner md-indeterminate v-if="fileLoading"></md-spinner>
    </div>

    <add-remove-character-modal ref="addRemoveCharacterModal"/>
    <highlight-modal/>
  </div>
</template>
<script>
  import FileRowPrint from 'src/components/files/FileRowPrint';
  import AddRemoveCharacterModal from 'src/components/modals/AddRemoveCharacter';
  import HighlightModal from 'src/components/modals/Highlight';
  import LocalStorage from 'src/helpers/local-storage';

  import {
    mapActions,
    mapGetters,
  } from 'vuex';

  import {
    FILE_ACTION_FETCH,
    FILE_ACTION_CLEAR,
    FILE_ACTION_FETCH_MY_CJK,
    FILE_ACTION_SAVE,
    FILE_GETTER,
    FILE_GETTER_LOADING,
  } from 'src/data/file/types';

  export default {
    name: 'file-print',

    components: {
      FileRowPrint,
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

    beforeDestroy() {
      clearInterval(this.timer);
      this.clear();
    },

    methods: {
      ...mapActions({
        fetch: FILE_ACTION_FETCH,
        clear: FILE_ACTION_CLEAR,
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
            type: 1,
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
    margin: 10px 2px;
    position: relative;
    will-change: transform;
  }

  @media print{
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

  .print .type-box-img,
  .print .type-img {
    margin-bottom: 0 !important;
    padding-bottom: 0 !important;
  }

  .print .character span {
    display: inline-block;
    font-weight: 300;
    width: 25px;
  }

  .print .type-h1 .character span {
    line-height: 40px;
    font-size: 40px;
    width: 40px;
    font-weight: 400;
  }

  .print .type-h1 {
    border-top:1px solid#ff6363;
    border-bottom:1px solid #ff6363;
  }

  .print .type-box-h2,
  .print .type-h2 {
    border-top:1px solid#fcd79c;
    border-bottom:1px solid #fcd79c;
  }

  .print .type-box-h2 .character span,
  .print .type-h2 .character span {
    line-height: 34px;
    font-size: 34px;
    width: 33px;
    font-weight: 400;
  }

  .print .type-foot .pinyin span,
  .print .type-box-imgcaption .pinyin span,
  .print .type-imgcaption .pinyin span {
    line-height: 15px;
    font-size: 15px;
  }

  .print .type-foot .character span,
  .print .type-box-imgcaption .character span,
  .print .type-imgcaption .character span {
    line-height: 20px;
    font-size: 20px;
    width: 20px;
  }

  .print .type-box-h2,
  .print .type-box,
  .print .type-box-img,
  .print .type-box-imgcaption {
    border-left:3px solid #93c5ff;
    border-right:3px solid #93c5ff;
    padding: 0 10px;
  }

  .print .type-qu {
    border-top:1px solid #ccc;
    border-bottom:1px solid #ccc;
  }

  .print .type-qu .pinyin span {
    line-height: 17px;
    font-size: 15px;
    height: 20px;
  }

  .print .type-qu .character span {
    line-height: 22px;
    font-size: 22px;
    width: 22px;
  }

  .print .character span.special-ideogram {
    width: 17px;
  }

  .larger.print .character span {
    width: 34px;
  }

  .larger.print .type-h1 .character span {
    line-height: 50px;
    font-size: 50px;
    width: 48px;
  }

  .larger.print .type-box-h2 .character span,
  .larger.print .type-h2 .character span {
    line-height: 36px;
    font-size: 36px;
    width: 35px;
  }

  .larger.print .character span.special-ideogram {
    width: 24px;
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
    margin-bottom: 10px;
    padding-bottom: 15px;
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
    margin-right: 4px;
  }

  .ideogram-spaced .type-h1 .block {
    margin-right: 15px;
  }

  .ideogram-spaced .type-box-h2 .block,
  .ideogram-spaced .type-h2 .block {
    margin-right: 10px;
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

  .image img {
    max-height:200px;
  }

  .bold span {
    font-weight: 500 !important;
  }

</style>
