<template>
  <div class="print-container">
    <div class="print-scroll" ref="fileScroll">
      <div class="print" :class="[sizeClass, typeClass]">
        <folder-structure :show-last="true" v-if="parent" />
        <h2 v-if="filename && filename.split('|||').length != 3">
          {{ filename }}
        </h2>

        <div
          v-if="
            lines &&
            lines[0] &&
            lines[0][0] &&
            lines[0][0].line !== undefined &&
            lines[0][0].line.audio !== undefined
          "
        >
          <audio :src="lines[0][0].line.audio" controls />
        </div>

        <template v-for="(line, lineIndex) in lines">
          <file-row-quiz
            :line="line"
            :lineIndex="lineIndex"
            @click.native="openBottomBarClick"
            ref="fileRowPrint"
            :key="
              'file-row-' +
              (line[0] && line[0].key
                ? `key-${line[0].key}`
                : `no-key-${lineIndex}`)
            "
            v-if="line && !line.small"
          />
        </template>

        <div class="loading-container">
          <md-progress-spinner
            md-mode="indeterminate"
            v-if="fileLoading"
          ></md-progress-spinner>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import FileRowQuiz from "@/components/files/FileRowQuiz";
import AddRemoveCharacterModal from "@/components/modals/AddRemoveCharacter";
import OptionsManager from "@/domain/options-manager";
import FolderStructure from "@/components/files/FolderStructure";

import { mapActions, mapGetters } from "vuex";

import {
  FILE_ACTION_FETCH_MY_CJK,
  FILE_GETTER_FOOTNOTES,
} from "@/data/file/types";

// eslint-disable-next-line
const PinyinWorker = require("worker-loader!@/workers/pinyin.js");

export default {
  name: "file-container-quiz",

  components: {
    FileRowQuiz,
    AddRemoveCharacterModal,
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
    filename: "",
    fileLoading: false,
    parent: false,
  },

  data() {
    return {
      imageZoom: "",
      sizeClass: "",
      typeClass: "",
      ideogramSpacedClass: "",
      footnoteLine: null,
      footnoteLineIndex: null,
      bible: {
        bookIndex: 0,
        chapter: "",
        verse: "",
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
    }),
  },

  created() {
    const optionsManager = new OptionsManager(this.$i18n);
    this.options = optionsManager.getOptions();
    this.worker = new PinyinWorker();

    this.worker.addEventListener("message", async (e) => {
      if (e.data.type === "changeCharacter") {
        const filteredElements = this.$refs.fileRowPrint.filter((item) => {
          return item.lineIndex === e.data.lineIndex;
        });

        for (const filteredElement of filteredElements) {
          filteredElement.updateBlockRender(e.data.blockIndex);
        }
      }
    });

    this.updateCss();

    let type = "known";
    if (this.options.type === "4") {
      type = "unknown";
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
    }),

    openImage(image) {
      this.imageZoom = image.src;
      this.$refs.imageZoom.openDialog();
    },

    openFootnote(footnote) {
      const footnoteIndex = parseInt(footnote.footnote, 10) - 1;
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
      if (!element.classList.contains("character")) {
        element = e.target;
      }

      if (!element.classList.contains("character")) {
        return;
      }

      if (
        element.getAttribute("data-line") === null &&
        element.getAttribute("data-block") === null
      ) {
        return;
      }

      const lineIndex = element.getAttribute("data-line");
      const blockIndex = element.getAttribute("data-block");

      if (
        this.lines[lineIndex] &&
        this.lines[lineIndex][blockIndex] &&
        this.lines[lineIndex][blockIndex].b
      ) {
        const bible = this.lines[lineIndex][blockIndex].b.split(":");
        this.bible.bookIndex = bible[0];
        this.bible.chapter = bible[1];
        this.bible.verse = bible[2];
        this.$refs.bibleModal.openDialog();
        return;
      }

      if (!this.parent) {
        this.$emit("open-bottom-bar", {
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
        e.ctrlKey || e.metaKey
      );
    },

    reopenBottomBarByLineAndBlock(lineIndex, blockIndex) {
      this.openBottomBarByLineAndBlock(lineIndex, blockIndex);
      this.$nextTick(() => {
        this.$refs.fileRowPrint[lineIndex].updateRender().then();
      });
    },

    openBottomBarByLineAndBlock(lineIndex, blockIndex, openDictionary) {
      this.openBottomBar({
        pinyin: this.lines[lineIndex][blockIndex].p,
        character: this.lines[lineIndex][blockIndex].c,
        lineIndex,
        blockIndex,
        openDictionary,
      });
    },

    updateCss() {
      document.body.style.setProperty(
        "--character-font-size",
        this.options.ideogramSize
      );

      document.body.style.setProperty(
        "--pinyin-font-size",
        this.options.pinyinSize
      );

      document.body.style.setProperty(
        "--block-margin-bottom",
        this.options.blockMarginBottom
      );

      this.typeClass = "";
      if (this.options.type === "2") {
        this.typeClass = "character-only";
      }

      this.ideogramSpacedClass = "ideogram-spaced";
      if (this.options.ideogramSpaced === "0") {
        this.ideogramSpacedClass = "";
      }
    },

    openModal(add) {
      this.$refs.addRemoveCharacterModal.openDialog(add);
    },

    addCharacter(character) {
      this.worker.postMessage({
        type: "addCharacter",
        character,
        lines: this.lines,
        options: this.options,
      });
    },

    removeCharacter(character) {
      this.worker.postMessage({
        type: "removeCharacter",
        character,
        lines: this.lines,
        options: this.options,
      });
    },
  },
};
</script>

<style>
::selection {
  background: #a8d1ff !important;
  color: #000 !important;
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
  font-family: "Noto Sans SC", "Noto Sans TC", sans-serif;
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

.clearfix {
  user-select: none;
}

.loading-container {
  text-align: center;
}

.image img {
  max-height: 200px;
}

.bold span {
  font-weight: 500 !important;
}

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
</style>
