<template>
  <div class="block">
    <a href class="remove" @click.prevent="removeBlock({lineIndex, blockIndex})">X</a>
    <div class="pinyin">
      <medium-editor :content="pinyin" @content="updatePinyin"></medium-editor>
    </div>
    <div class="character">
      <medium-editor :content="character" @content="updateCharacter"></medium-editor>
    </div>
  </div>
</template>

<script>
  // import autosizeInput from 'autosize-input';
  import MediumEditor from 'src/components/common/editor/MediumEditor';
  import {
    mapMutations,
  } from 'vuex';

  import {
  FILE_MUTATION_UPDATE_PINYIN,
  FILE_MUTATION_UPDATE_CHARACTER,
  FILE_MUTATION_REMOVE_BLOCK,
  } from 'src/data/file/types';

  export default {
    name: 'file-block',
    components: {
      MediumEditor,
    },
    props: {
      pinyin: {
        // eslint-disable-next-line quote-props
        'default': () => (''),
      },
      character: {
        // eslint-disable-next-line quote-props
        'default': () => (''),
      },
      lineIndex: {
        type: Number,
        default: 0,
      },
      blockIndex: {
        type: Number,
        default: 0,
      },
    },
    mounted() {
      // this.autosizeInputPinyin = autosizeInput(this.$refs.pinyinInput);
      // this.autosizeInputCharacter = autosizeInput(this.$refs.characterInput);
    },
    methods: {
      ...mapMutations({
        updatePinyinMutation: FILE_MUTATION_UPDATE_PINYIN,
        updateCharacterMutation: FILE_MUTATION_UPDATE_CHARACTER,
        removeBlock: FILE_MUTATION_REMOVE_BLOCK,
      }),

      updatePinyin(pinyin) {
        const { lineIndex, blockIndex } = this;
        this.updatePinyinMutation({
          pinyin,
          lineIndex,
          blockIndex,
        });
      },

      updateCharacter(character) {
        const { lineIndex, blockIndex } = this;
        this.updateCharacterMutation({
          character,
          lineIndex,
          blockIndex,
        });
      },
    },
  };
</script>

<style>
  .div-input{
    background:#fff;
  }
</style>
