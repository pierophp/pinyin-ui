<template>
  <div class="block">
    <a
      href="javascript:void(0)"
      class="remove"
      @click.prevent="removeBlock({ lineIndex, blockIndex })"
      >X</a
    >
    <div class="image-edit" v-if="block.small">
      <img :src="block.small" referrerpolicy="no-referrer" />
    </div>

    <div class="pinyin" v-if="!block.small">
      <medium-editor
        :content="pinyin | removeSpace"
        @content="updatePinyin"
      ></medium-editor>
    </div>

    <div class="character" v-if="!block.small">
      <medium-editor
        :content="character"
        @content="updateCharacter"
      ></medium-editor>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
// import autosizeInput from 'autosize-input';
import MediumEditor from "@/components/common/editor/MediumEditor.vue";
// @ts-ignore
import replaceall from "replaceall";
import { mapMutations } from "vuex";

import {
  FILE_MUTATION_UPDATE_PINYIN,
  FILE_MUTATION_UPDATE_CHARACTER,
  FILE_MUTATION_REMOVE_BLOCK,
} from "@/data/file/types";

export default {
  name: "file-block",
  components: {
    MediumEditor,
  },
  filters: {
    removeSpace: function removeSpace(value) {
      if (!value) return "";
      value = value.toString();
      return replaceall(String.fromCharCode(160), "", value);
    },
  },
  props: {
    pinyin: {
      // eslint-disable-next-line quote-props
      default: () => "",
    },
    character: {
      // eslint-disable-next-line quote-props
      default: () => "",
    },
    lineIndex: {
      default: 0,
    },
    blockIndex: {
      default: 0,
    },

    block: "",
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
.div-input {
  background: #fff;
}
</style>
