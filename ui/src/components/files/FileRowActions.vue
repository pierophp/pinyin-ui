<template>
  <div class="btn-group">
    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      Options <span class="caret"></span>
    </button>
    <ul class="dropdown-menu">
      <li>
        <a href @click.prevent="addEmptyBlock({lineIndex})">
          <i class="glyphicon glyphicon-plus"></i> Add Empty Block
        </a>
      </li>
      <li>
        <a href @click.prevent="convertToPinyin({lineIndex})">
          <i class="glyphicon glyphicon-font"></i> Convert to Pinyin
        </a>
      </li>
      <li role="separator" class="divider"></li>
      <li>
        <a href @click.prevent="openModalClipBoard01(lineIndex)">
          <i class="glyphicon glyphicon-paste"></i> Paste (pinyin + space + hanzi)
        </a>
      </li>
      <li>
        <a href @click.prevent="openModalClipBoard02(lineIndex)">
          <i class="glyphicon glyphicon-paste"></i> Paste (2 lines)
        </a>
      </li>
      <li role="separator" class="divider"></li>
      <li>
        <a href @click.prevent="removeLine({lineIndex})">
          <i class="glyphicon glyphicon-trash"></i> Remove line
        </a>
      </li>
    </ul>
  </div>
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
      openModalClipBoard01(lineIndex) {
        $('#filePasteModal').modal();
        this.pasteAction({
          action: 1,
          lineIndex,
        });
      },
      openModalClipBoard02(lineIndex) {
        $('#filePasteModal').modal();
        this.pasteAction({
          action: 2,
          lineIndex,
        });
      },
    },
  };
</script>
