<template>
  <div class="panel print" v-bind:class="sizeClass">
    <div v-for="(line, index) in lines" class="line">
    <file-block-print
    v-for="(block,index) in line"
    :pinyin="block.p"
    :character="block.c"
    ></file-block-print>
  </div>
</template>

<script>
  import FileBlockPrint from 'src/components/files/FileBlockPrint';

  import {
    mapActions,
    mapGetters,
  } from 'vuex';

  import {
  FILE_ACTION_FETCH,
  FILE_GETTER,
  } from 'src/data/file/types';

  export default {
    name: 'file-print',

    components: {
      FileBlockPrint,
    },

    data() {
      return {
        filename: '',
        sizeClass: '',
      };
    },

    watch: {
      $route() {
        if (this.$route.params.filename) {
          this.getFile(this.$route.params.filename);
        }
      },
    },

    computed: {
      ...mapGetters({
        lines: FILE_GETTER,
      }),
    },
    created() {
      this.sizeClass = this.$route.query.size;
      this.filename = this.$route.params.filename;
      this.getFile(this.filename);
    },

    methods: {
      ...mapActions({
        fetch: FILE_ACTION_FETCH,
      }),

      getFile(filename) {
        this.fetch(filename);
      },
    },

  };

</script>

<style>
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

  .tone-1 {
    color: #0000ff!important;
  }

  .tone-2 {
    color: #d89000!important;
  }

  .tone-3 {
    color: #00a000!important;
  }

  .tone-4 {
    color: #ff0000!important;
  }

  .hide-pinyin {
    display: inline-block;
    width: 30px !important;
    ;
  }

</style>
