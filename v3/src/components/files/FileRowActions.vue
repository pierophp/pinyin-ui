<template>
  <menu-content>
    <template slot="click">
      <md-button class="md-accent">
        {{ $t("options") }}
      </md-button>
    </template>

    <div class="list-container">
      <div class="list-item" @click="addEmptyBlock({ lineIndex })">
        <div class="icon">
          <md-icon>add</md-icon>
        </div>
        <div class="content">
          {{ $t("add_empty_block") }}
        </div>
      </div>
      <div class="list-item" @click="convertToPinyin({ lineIndex })">
        <div class="icon">
          <md-icon>font_download</md-icon>
        </div>
        <div class="content">
          {{ $t("convert_to_pinyin") }}
        </div>
      </div>
      <div class="list-item" @click="openModalClipBoard(lineIndex)">
        <div class="icon">
          <md-icon>content_paste</md-icon>
        </div>
        <div class="content">
          {{ $t("paste") }}
        </div>
      </div>
      <div class="list-item" @click="removeLine({ lineIndex })">
        <div class="icon">
          <md-icon>delete</md-icon>
        </div>
        <div class="content">
          {{ $t("remove_line") }}
        </div>
      </div>
    </div>
  </menu-content>
</template>

<script lang="ts">
import { mapActions, mapMutations } from "vuex";

import {
  FILE_ACTION_CONVERT_TO_PINYIN,
  FILE_MUTATION_ADD_EMPTY_BLOCK,
  FILE_MUTATION_PASTE_ACTION,
  FILE_MUTATION_REMOVE_LINE,
} from "@/data/file/types";

import MenuContent from "@/components/common/MenuContent";

export default {
  name: "file-row-actions",
  props: {
    lineIndex: {
      default: 0,
    },
  },
  components: {
    MenuContent,
  },
  methods: {
    ...mapMutations({
      addEmptyBlock: FILE_MUTATION_ADD_EMPTY_BLOCK,
      removeLine: FILE_MUTATION_REMOVE_LINE,
      pasteAction: FILE_MUTATION_PASTE_ACTION,
    }),
    ...mapActions({
      convertToPinyin: FILE_ACTION_CONVERT_TO_PINYIN,
    }),
    openModalClipBoard(lineIndex) {
      this.$emit("open-file-paste-modal");
      this.pasteAction({
        lineIndex,
      });
    },
  },
};
</script>
