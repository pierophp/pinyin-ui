<template>
  <div class="print-container">
    <footnote-modal :line="footnoteLine" :lineIndex="footnoteLineIndex" ref="footnote" />
    <image-zoom :src="imageZoom" ref="imageZoom" />
    <portal-target name="portal-file-container-header" v-if="portal"></portal-target>
    <div class="print-scroll" ref="fileScroll">
      <div class="print" :class="[sizeClass, typeClass, ideogramSpacedClass]">
        <folder-structure :show-last="true" v-if="parent && showMenuNavigation" />
        <h2 v-if="filename && filename.split('|||').length != 3" class="file-title">{{filename}}</h2>

        <div
          v-if="fullLines && fullLines[0] && fullLines[0][0] && fullLines[0][0].line !== undefined && fullLines[0][0].line.audio !== undefined"
        >
          <audio :src="fullLines[0][0].line.audio" controls />
        </div>

        <template v-for="(line, lineIndex) in lines">
          <file-row-print
            :line="line"
            :lineIndex="line[0] && line[0].lineIndex ? line[0].lineIndex : lineIndex"
            @click.native="openBottomBarClick"
            @open-image="openImage"
            @open-footnote="openFootnote"
            @go-to-video-time="(time) => $emit('go-to-video-time', time)"
            ref="fileRowPrint"
            :key="'file-row-' + (line[0] && line[0].key ? `key-${line[0].key}` : `no-key-${line[0] && line[0].lineIndex ? line[0].lineIndex : 'loop-' + lineIndex}`)"
          />
        </template>

        <div class="loading-container">
          <md-progress-spinner md-mode="indeterminate" v-if="fileLoading"></md-progress-spinner>
        </div>

        <add-remove-character-modal
          @add-character="addCharacter"
          @remove-character="removeCharacter"
          ref="addRemoveCharacterModal"
        />

        <highlight-modal v-if="showHighlight" :worker="worker" />

        <bible-modal
          ref="bibleModal"
          v-if="parent"
          :bookIndex="bible.bookIndex"
          :chapter="bible.chapter"
          :verse="bible.verse"
          @open-bottom-bar="openBottomBar"
        />
      </div>
    </div>

    <div class="pages no-print" v-if="totalPages > 1 && pagination">
      <span v-for="n in totalPages" class="page" :key="n" @click="changeCurrentPage(n)">{{n}}</span>
    </div>

    <file-bottom-bar
      ref="fileBottomBar"
      @open-modal="openModal"
      @reopen="(lineIndex, blockIndex) => reopenBottomBarByLineAndBlock(lineIndex, blockIndex)"
    />
  </div>
</template>

<script>
import FileRowPrint from 'src/components/files/FileRowPrint';
import FileBottomBar from 'src/components/files/FileBottomBar';
import AddRemoveCharacterModal from 'src/components/modals/AddRemoveCharacter';
import FootnoteModal from 'src/components/modals/Footnote';
import HighlightModal from 'src/components/modals/Highlight';
import BibleModal from 'src/components/modals/Bible';
import OptionsManager from 'src/domain/options-manager';
import ImageZoom from 'src/components/common/ImageZoom';
import FolderStructure from 'src/components/files/FolderStructure';

import { mapActions, mapGetters, mapMutations } from 'vuex';

import {
  FILE_ACTION_FETCH_MY_CJK,
  FILE_ACTION_CHANGE_PAGE,
  FILE_GETTER_FOOTNOTES,
  FILE_GETTER_FULL_FILE_TOTAL_PAGES,
  FILE_GETTER_CURRENT_PAGE,
  FILE_MUTATION_SET_CURRENT_PAGE,
} from 'src/data/file/types';

// eslint-disable-next-line
const PinyinWorker = require('worker-loader!src/workers/pinyin.js');

export default {
  name: 'file-container',

  components: {
    FileRowPrint,
    AddRemoveCharacterModal,
    HighlightModal,
    FileBottomBar,
    FootnoteModal,
    BibleModal,
    ImageZoom,
    FolderStructure,
  },

  props: {
    lines: {
      type: Array,
      default: () => [],
    },
    fullLines: {
      type: Array,
      default: () => [],
    },
    filename: '',
    fileLoading: false,
    parent: false,
    portal: false,
    showMenuNavigation: true,
    pagination: false,
    useFullLines: true,
    showHighlight: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      imageZoom: '',
      sizeClass: '',
      typeClass: '',
      ideogramSpacedClass: '',
      footnoteLine: null,
      footnoteLineIndex: null,
      bible: {
        bookIndex: 0,
        chapter: '',
        verse: '',
      },
    };
  },

  watch: {
    $route() {
      this.updateCss();
    },
    fullLines() {
      if (this.$refs.fileScroll) {
        // error on loading
        // this.$refs.fileScroll.scrollTo(0, 0);
      }
    },
  },

  computed: {
    ...mapGetters({
      footnotes: FILE_GETTER_FOOTNOTES,
      totalPages: FILE_GETTER_FULL_FILE_TOTAL_PAGES,
      currentPage: FILE_GETTER_CURRENT_PAGE,
    }),
  },

  created() {
    const optionsManager = new OptionsManager(this.$i18n);
    this.options = optionsManager.getOptions();
    this.worker = new PinyinWorker();

    this.worker.addEventListener('message', async e => {
      if (e.data.type === 'changeCharacter') {
        this.updateByLineAndBlock(e.data.lineIndex, e.data.blockIndex);
      }
    });

    this.updateCss();

    let type = 'known';
    if (this.options.type === '4') {
      type = 'unknown';
    }

    const source = this.options.hidePinyinSource;

    this.fetchMyCjk({
      source,
      type,
    });
  },

  methods: {
    ...mapActions({
      fetchMyCjk: FILE_ACTION_FETCH_MY_CJK,
      changePage: FILE_ACTION_CHANGE_PAGE,
    }),

    ...mapMutations({
      setCurrentPage: FILE_MUTATION_SET_CURRENT_PAGE,
    }),

    async changeCurrentPage(page) {
      if (this.fileLoading) {
        setTimeout(async () => {
          await this.changeCurrentPage(page);
        }, 500);
        return;
      }

      if (this.currentPage === page) {
        return;
      }

      await this.setCurrentPage(page);

      await this.changePage();
    },
    openImage(image) {
      this.imageZoom = image;
      this.$refs.imageZoom.openDialog();
    },

    openFootnote(footnote) {
      const footnoteIndex = parseInt(footnote, 10) - 1;

      if (this.footnotes[footnoteIndex] === undefined) {
        return;
      }

      const lineIndex = this.footnotes[footnoteIndex];
      this.footnoteLine = this.fullLines[lineIndex];
      this.footnoteLineIndex = lineIndex;

      this.$refs.footnote.openDialog();
    },

    openBottomBarClick(e) {
      let element = e.target.parentNode;
      if (!element.classList.contains('character')) {
        element = e.target;
      }

      if (!element.classList.contains('character')) {
        return;
      }

      if (
        element.getAttribute('data-line') === null &&
        element.getAttribute('data-block') === null
      ) {
        return;
      }

      const lineIndex = element.getAttribute('data-line');
      const blockIndex = element.getAttribute('data-block');

      if (
        this.fullLines[lineIndex] &&
        this.fullLines[lineIndex][blockIndex] &&
        this.fullLines[lineIndex][blockIndex].b
      ) {
        const bible = this.fullLines[lineIndex][blockIndex].b.split(':');
        this.bible.bookIndex = bible[0];
        this.bible.chapter = bible[1];
        this.bible.verse = bible[2];
        this.$refs.bibleModal.openDialog();
        return;
      }

      if (!this.parent) {
        this.$emit('open-bottom-bar', {
          pinyin: this.lines[lineIndex][blockIndex].p,
          character: this.lines[lineIndex][blockIndex].c,
          lineIndex,
          blockIndex,
          openDictionary: e.ctrlKey || e.metaKey,
        });
        return;
      }

      this.openBottomBarByLineAndBlock(
        lineIndex,
        blockIndex,
        e.ctrlKey || e.metaKey,
      );
    },

    updateRender() {
      if (!this.$refs.fileRowPrint) {
        return;
      }

      for (const element of this.$refs.fileRowPrint) {
        element.updateRender();
      }
    },

    updateByLineAndBlock(lineIndex, blockIndex) {
      const filteredElements = this.$refs.fileRowPrint.filter(item => {
        return Number(item.lineIndex) === Number(lineIndex);
      });

      for (const filteredElement of filteredElements) {
        filteredElement.updateRender();
      }
    },

    reopenBottomBarByLineAndBlock(lineIndex, blockIndex) {
      this.openBottomBarByLineAndBlock(lineIndex, blockIndex);
      this.updateByLineAndBlock(lineIndex);
    },

    openBottomBarByLineAndBlock(lineIndex, blockIndex, openDictionary) {
      const lines = this.useFullLines ? this.fullLines : this.lines;
      this.openBottomBar({
        pinyin: lines[lineIndex][blockIndex].p,
        character: lines[lineIndex][blockIndex].c,
        lineIndex,
        blockIndex,
        openDictionary,
      });
    },

    updateCss() {
      document.body.style.setProperty(
        '--character-font-size',
        this.options.ideogramSize,
      );

      document.body.style.setProperty(
        '--pinyin-font-size',
        this.options.pinyinSize,
      );

      document.body.style.setProperty(
        '--block-margin-bottom',
        this.options.blockMarginBottom,
      );

      this.typeClass = '';
      if (this.options.type === '2') {
        this.typeClass = 'character-only';
      }

      this.ideogramSpacedClass = 'ideogram-spaced';
      if (this.options.ideogramSpaced === '0') {
        this.ideogramSpacedClass = '';
      }
    },

    openModal(add) {
      this.$refs.addRemoveCharacterModal.openDialog(add);
    },

    openBottomBar(block) {
      this.$refs.fileBottomBar.open(block);
    },

    addCharacter(character) {
      this.worker.postMessage({
        type: 'addCharacter',
        character,
        lines: this.lines,
        options: this.options,
      });
    },

    removeCharacter(character) {
      this.worker.postMessage({
        type: 'removeCharacter',
        character,
        lines: this.lines,
        options: this.options,
      });
    },
  },
};
</script>

<style>
audio {
  height: 50px !important;
}

::selection {
  background: #a8d1ff !important;
  color: #000 !important;
}

.file-title {
  /* min-height: 80px; */
}

.print-container {
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
}

.print-scroll {
  flex: 1;
  will-change: transform;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0 10px;
}

.print {
  margin: 10px 2px;
  position: relative;
}

@media print {
  padding-top: 0;
}

.character-only .pinyin {
  display: none;
}

.character-only .block {
  padding: 5px 0;
}

.print .pinyin,
.print .pinyin span {
  user-select: none;
  background: none !important;
  font-size: var(--pinyin-font-size);
  height: calc(var(--pinyin-font-size) + 2px);
  min-width: 0;
  min-height: 5px;
  display: block;
}

.print .character,
.print .character span {
  min-width: 0;
  font-family: 'Noto Sans SC', 'Noto Sans TC', sans-serif;
  font-weight: lighter;
  font-weight: 300;
}

.print .character span {
  width: calc(var(--character-font-size) - 1px);
}

.print .verse .ideogram-show span {
  font-size: calc(var(--character-font-size) - 7px) !important;
  width: auto !important;
  font-weight: bold;
}

.print .chapter .ideogram-show span {
  font-size: calc(var(--character-font-size) + 7px) !important;
  width: auto !important;
  font-weight: bold;
}

.print .type-box-img,
.print .type-img {
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}

.print .type-h1 .character,
.print .type-h1 .character span {
  line-height: calc(var(--character-font-size) + 17px);
  font-size: calc(var(--character-font-size) + 17px);
  font-weight: 400;
}

.print .type-h1 .character span {
  width: calc(var(--character-font-size) + 17px);
}

.print .type-h1 {
  border-top: 1px solid#ff6363;
  border-bottom: 1px solid #ff6363;
}

.print .type-box-h2,
.print .type-h2 {
  border-top: 1px solid#fcd79c;
  border-bottom: 1px solid #fcd79c;
}

.print .type-box-h2 .character .print .type-box-h2 .character span,
.print .type-h2 .character,
.print .type-h2 .character span {
  line-height: calc(var(--character-font-size) + 11px);
  font-size: calc(var(--character-font-size) + 11px);
  font-weight: 400;
}

.print .type-box-h2 .character span,
.print .type-h2 .character span {
  width: calc(var(--character-font-size) + 10px);
}

.print .type-foot .character,
.print .type-box-imgcaption .character,
.print .type-imgcaption .character {
  line-height: calc(var(--character-font-size) - 3px);
  font-size: calc(var(--character-font-size) - 3px);
}

.print .type-foot .character span,
.print .type-box-imgcaption .character span,
.print .type-imgcaption .character span {
  width: calc(var(--character-font-size) - 3px);
}

.print .type-box-h2,
.print .type-box,
.print .type-box-img,
.print .type-box-imgcaption {
  border-left: 3px solid #93c5ff;
  border-right: 3px solid #93c5ff;
  padding: 0 10px;
}

.print .type-qu {
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}

.print .type-qu .character,
.print .type-qu .character span {
  line-height: calc(var(--character-font-size) - 4px);
  font-size: calc(var(--character-font-size) - 4px);
}

.print .character span.special-ideogram {
  width: 17px;
}

.print .block {
  page-break-inside: avoid;
  padding: 1px 0;
  min-width: 0;
}

.print .block {
  margin-bottom: var(--block-margin-bottom);
}

.print .block:hover {
  background: #fff;
}

.print a {
  color: #000;
  text-decoration: none;
}

.print .character:hover {
  cursor: pointer;
  opacity: 0.5;
}

.print .line {
  margin-bottom: 10px;
  padding-bottom: 5px;
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

.loading-container {
  text-align: center;
}

.image img {
  max-height: 200px;
}

.bold,
.bold span {
  font-weight: 500 !important;
}

.italic,
.italic span {
  font-style: italic !important;
}

audio {
  margin-top: 10px;
  margin-bottom: 5px;
  width: 100%;
  height: 55px;
}

.print .block .footnote {
  font-size: 40px;
  color: #4286f4;
}

.pages {
  display: flex;
}

.pages .page {
  background: #4286f4;
  border: 1px solid #052b68;
  color: #fff;
  cursor: pointer;
  flex: 1;
  font-size: 16px;
  margin: 0 2px 2px;
  padding: 2px 0;
  text-align: center;
}

.pages .page:hover {
  opacity: 0.8;
}
.noIdeogram {
  text-align: left;
}
</style>
