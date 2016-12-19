<template>
  <div class="block">
    <a href class="remove" @click.prevent="removeBlock({lineIndex, blockIndex})">X</a>
    <div class="pinyin">
      <input :value="pinyin" ref="pinyinInput" @input="updatePinyin" />
    </div>
    <div class="character">
      <input :value="character" ref="characterInput" @input="updateCharacter"  />
    </div>
  </div>
</template>

<script>
  import autosizeInput from 'autosize-input';

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
      this.autosizeInputPinyin = autosizeInput(this.$refs.pinyinInput);
      this.autosizeInputCharacter = autosizeInput(this.$refs.characterInput);
    },
    watch: {
      pinyin() {
        this.$nextTick(this.autosizeInputPinyin);
      },
      character() {
        this.$nextTick(this.autosizeInputCharacter);
      },
    },
    methods: {
      ...mapMutations({
        updatePinyinMutation: FILE_MUTATION_UPDATE_PINYIN,
        updateCharacterMutation: FILE_MUTATION_UPDATE_CHARACTER,
        removeBlock: FILE_MUTATION_REMOVE_BLOCK,
      }),

      updatePinyin(e) {
        const { lineIndex, blockIndex } = this;
        this.updatePinyinMutation({
          pinyin: e.target.value,
          lineIndex,
          blockIndex,
        });
      },

      updateCharacter(e) {
        const { lineIndex, blockIndex } = this;
        this.updateCharacterMutation({
          character: e.target.value,
          lineIndex,
          blockIndex,
        });
      },
    },
  };
</script>

<style>

</style>
