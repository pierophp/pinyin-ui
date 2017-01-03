<template>
  <md-menu md-align-trigger  md-size="4">
    <md-button class="md-accent" md-menu-trigger>Options</md-button>

    <md-menu-content>
      <md-menu-item @click="addEmptyBlock({lineIndex})">
        <md-icon>add</md-icon>
        <span>Add Empty Block</span>
      </md-menu-item>
      <md-menu-item @click="convertToPinyin({lineIndex})">
        <md-icon>font_download</md-icon>
        <span>Convert to Pinyin</span>
      </md-menu-item>
      <md-menu-item @click="openModalClipBoard(lineIndex)">
        <md-icon>content_paste</md-icon>
        <span>Paste</span>
      </md-menu-item>
      <md-menu-item @click="removeLine({lineIndex})">
        <md-icon>delete</md-icon>
        <span>Remove line</span>
      </md-menu-item>
    </md-menu-content>
  </md-menu>
</template>
<script>
  import {
    mapActions,
    mapMutations,
  } from 'vuex';

  import {
    FILE_ACTION_CONVERT_TO_PINYIN,
    FILE_MUTATION_ADD_EMPTY_BLOCK,
    FILE_MUTATION_PASTE_ACTION,
    FILE_MUTATION_REMOVE_LINE,
  } from 'src/data/file/types';

  export default {
    name: 'file-row-actions',
    props: {
      lineIndex: {
        type: Number,
        default: 0,
      },
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
        $('#filePasteModal').modal();
        this.pasteAction({
          lineIndex,
        });
      },
    },
  };
</script>
