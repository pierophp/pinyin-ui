<template>
  <div class="panel print" :class="[sizeClass, typeClass, ideogramColoredClass]">
    <div v-for="(line, index) in lines" class="line">
    <file-block-print
    v-for="(block,index) in line"
    :pinyin="block.p"
    :character="block.c"
    />
    <add-character-modal/>
    <div class="clearfix"></div>
  </div>
</template>

<script>
  import FileBlockPrint from 'src/components/files/FileBlockPrint';
  import AddCharacterModal from 'src/components/modals/AddCharacter';

  import {
    mapActions,
    mapGetters,
  } from 'vuex';

  import {
  FILE_ACTION_FETCH,
  FILE_ACTION_FETCH_MY_CJK,
  FILE_GETTER,
  } from 'src/data/file/types';

  export default {
    name: 'file-print',

    components: {
      FileBlockPrint,
      AddCharacterModal,
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
    },

    methods: {
      ...mapActions({
        fetch: FILE_ACTION_FETCH,
        fetchMyCjk: FILE_ACTION_FETCH_MY_CJK,
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
  .character-only .pinyin{
    display: none;
  }

  .character-only .block{
    padding: 5px 0;
  }

  .larger .pinyin span {
    font-size: 40px;
    height: 40px;
  }

  .larger .character span {
    font-size: 34px;
    height: 34px;
  }

  .print .character span {
    font-weight: normal;
  }

  .print .block {
    page-break-inside: avoid;
  }

  .print .block:hover {
    background: #fff;
  }

  .print a{
    color: #000;
    text-decoration: none;
  }

  .print a:hover{
    opacity: 0.5;
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

</style>
