<template>
  <span class="bible-chapter-container">
    <div class="verses-container" v-show="showVerses && !versesShowAsModal">
      <div class="bible-verse special-action" @click="selectAll()">
        <v-icon icon="mdi-check-all"></v-icon>
      </div>

      <div class="bible-verse special-action" @click="clear()">
        <v-icon icon="mdi-delete-sweep"></v-icon>
      </div>

      <div
        v-for="(verse, verseId) in verses"
        v-bind:key="verseId"
        :class="[
          'bible-verse',
          selecteds.indexOf(verse) != -1 ? 'selected' : '',
        ]"
        @click="selectVerseClick(verse)"
      >
        {{ verse }}
      </div>
    </div>

    <file-container
      ref="fileContainer"
      :lines="lines.concat(linesLanguage)"
      :fullLines="fullLines.concat(fullLinesLanguage)"
      filename
      :fileLoading="fileLoading"
      @open-bottom-bar="openBottomBar"
      :parent="parent"
      :showHighlight="false"
      :useFullLines="false"
    />

    <!-- <md-dialog
      ref="modal"
      class="dialog-bible-verses"
      :md-active.sync="versesModalOpenTemp"
      :md-fullscreen="false"
      :md-backdrop="true"
      v-if="versesShowAsModal && parent"
    >
      <md-dialog-content>
        <div class="verses-container" v-show="showVerses">
          <div class="bible-verse special-action" @click="selectAll()">
            <v-icon icon="mdi-check-all"></v-icon>
          </div>

          <div class="bible-verse special-action" @click="clear()">
            <v-icon icon="mdi-delete-sweep"></v-icon>
          </div>

          <div
            v-for="(verse, verseId) in verses"
            v-bind:key="verseId"
            :class="[
              'bible-verse',
              selecteds.indexOf(verse) != -1 ? 'selected' : '',
            ]"
            @click="selectVerseClick(verse)"
          >
            {{ verse }}
          </div>
        </div>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click.native="closeVersesDialog()">{{
          $t("close")
        }}</md-button>
      </md-dialog-actions>
    </md-dialog> -->

    <!-- <v-snackbar v-model="showSnackbarNoInternet" multi-line :timeout="3000">
      {{ $t("no_internet") }}

      <template v-slot:actions>
        <v-btn
          color="red"
          variant="text"
          @click="showSnackbarNoInternet = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar> -->
  </span>
</template>

<script lang="ts">
import chaptersData from "@/data/bible/chapters";
import axios from "axios";
import sortBy from "lodash/sortBy";
import OptionsManager from "@/domain/options-manager";
import LocalStorage from "@/helpers/local-storage";
import replaceall from "replaceall";

import { mapGetters, mapMutations } from "vuex";

import {
  BIBLE_GETTER_VERSES_SHOW_AS_MODAL,
  BIBLE_GETTER_VERSES_MODAL_VISIBLE,
  BIBLE_GETTER_OPEN_CHAPTER_ON_LOAD,
  BIBLE_MUTATION_SET_VERSES_MODAL_VISIBLE,
} from "@/data/bible/types";

import FileContainer from "@/components/files/FileContainer.vue";

let options = {};

const CACHE_VERSION = 14;

export default {
  name: "bible-chapter",
  props: {
    book: {
      type: String,
      default: "",
    },
    chapter: {
      type: Number,
      default: 0,
    },
    verse: {
      type: String,
      default: "",
    },
    parent: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    FileContainer,
  },
  data() {
    return {
      lines: [],
      linesLanguage: [],
      fullLines: [],
      fullLinesLanguage: [],
      showVerses: false,
      verses: [],
      selecteds: [],
      selectedsLanguage: [],
      versesMap: {},
      versesMapLanguage: {},
      fileLoading: false,
      fileLoadingLanguage: false,
      showSnackbarNoInternet: false,
      versesModalOpenTemp: false,
    };
  },
  computed: {
    ...mapGetters({
      versesShowAsModal: BIBLE_GETTER_VERSES_SHOW_AS_MODAL,
      versesModalOpen: BIBLE_GETTER_VERSES_MODAL_VISIBLE,
      openChapterOnLoad: BIBLE_GETTER_OPEN_CHAPTER_ON_LOAD,
    }),
  },
  watch: {
    book() {
      this.loadBook();
    },
    chapter() {
      this.loadBook();
    },
    verse() {
      this.loadBook();
    },
    versesModalOpenTemp() {
      this.setVersesModalVisible(this.versesModalOpenTemp);
    },
    versesModalOpen() {
      this.versesModalOpenTemp = this.versesModalOpen;
    },
  },
  methods: {
    ...mapMutations({
      setVersesModalVisible: BIBLE_MUTATION_SET_VERSES_MODAL_VISIBLE,
    }),
    clear() {
      this.selecteds = [];
      this.selectedsLanguage = [];
      this.setFileContent([]);
      this.setFileContentLanguage([]);
    },
    selectVerseClick(verse) {
      this.selectVerse(verse);
      this.selectVerseLanguage(verse);
    },
    setLine(line) {
      this.$set(this.lines, line.lineIndex, line.line);
    },
    setFileContent(lines) {
      this.lines = lines;
    },
    setFileLoading(loading) {
      this.fileLoading = loading;
    },
    setFileContentLanguage(lines) {
      this.linesLanguage = lines;
    },
    setFileLoadingLanguage(loading) {
      this.fileLoadingLanguage = loading;
    },
    openBottomBar(data) {
      this.$emit("open-bottom-bar", data);
    },
    selectAll() {
      this.setFileLoading(true);
      this.clear();
      this.loadFile(this.fullLines, 0);
    },
    selectVerse(verse) {
      if (this.selecteds.indexOf(verse) === -1) {
        this.selecteds.push(verse);
      } else {
        this.selecteds.remove(this.selecteds.indexOf(verse));
      }

      this.selecteds = sortBy(this.selecteds);

      const newLines = [];

      const lines = {};

      const lineKeys = {};

      this.selecteds.forEach((v) => {
        if (!this.versesMap) {
          return;
        }

        const verseMap = this.versesMap[v];

        for (const verseMapKey of Object.keys(verseMap)) {
          const verseMapLine = verseMap[verseMapKey];

          if (!lineKeys[verseMapLine.line]) {
            lineKeys[verseMapLine.line] = [];
          }

          lineKeys[verseMapLine.line].push(`${v}-${verseMapLine.line}`);

          if (!lines[verseMapLine.line]) {
            lines[verseMapLine.line] = {
              line: verseMapLine.line,
              blocks: [],
            };
          }

          for (
            let i = verseMapLine.blockStart;
            i <= verseMapLine.blockEnd;
            i += 1
          ) {
            lines[verseMapLine.line].blocks.push(
              this.fullLines[verseMapLine.line][i]
            );
          }
        }
      });

      // eslint-disable-next-line
      for (const lineIndex in lines) {
        const line = lines[lineIndex];
        // generate new key
        lines[lineIndex].blocks[0].key = lineKeys[lineIndex].join();
        newLines.push(line.blocks);
      }

      this.setFileContent(newLines);
    },
    selectVerseLanguage(verse) {
      if (this.selectedsLanguage.indexOf(verse) === -1) {
        this.selectedsLanguage.push(verse);
      } else {
        this.selectedsLanguage.remove(this.selectedsLanguage.indexOf(verse));
      }

      this.selectedsLanguage = sortBy(this.selectedsLanguage);

      const newLines = [];

      const lines = {};

      const lineKeys = {};

      this.selectedsLanguage.forEach((v) => {
        if (!this.versesMapLanguage) {
          return;
        }

        const verseMap = this.versesMapLanguage[v];
        if (!verseMap) {
          return;
        }

        for (const verseMapKey of Object.keys(verseMap)) {
          const verseMapLine = verseMap[verseMapKey];

          if (!lineKeys[verseMapLine.line]) {
            lineKeys[verseMapLine.line] = [];
          }

          lineKeys[verseMapLine.line].push(`${v}-${verseMapLine.line}`);

          if (!lines[verseMapLine.line]) {
            lines[verseMapLine.line] = {
              line: verseMapLine.line,
              blocks: [],
            };
          }

          for (
            let i = verseMapLine.blockStart;
            i <= verseMapLine.blockEnd;
            i += 1
          ) {
            this.fullLinesLanguage[verseMapLine.line][i].p = replaceall(
              String.fromCharCode(160),
              " ",
              this.fullLinesLanguage[verseMapLine.line][i].p
            ); // Convert NO-BREAK SPACE to SPACE

            this.fullLinesLanguage[verseMapLine.line][i].p = replaceall(
              String.fromCharCode(8201),
              " ",
              this.fullLinesLanguage[verseMapLine.line][i].p
            ); // Convert THIN SPACE to SPACE

            let words =
              this.fullLinesLanguage[verseMapLine.line][i].p.split(" ");
            if (options.translationLanguage === "ja") {
              words = this.fullLinesLanguage[verseMapLine.line][i].p.split("");
            }

            words.forEach((word) => {
              const block = {};
              block.c = " ";
              block.noIdeogram = true;
              block.p = word;
              lines[verseMapLine.line].blocks.push(block);
            });
          }
        }
      });

      // eslint-disable-next-line
      for (const lineIndex in lines) {
        const line = lines[lineIndex];
        // generate new key
        lines[lineIndex].blocks[0].key =
          "language-" + lineKeys[lineIndex].join();
        newLines.push(line.blocks);
      }

      this.setFileContentLanguage(newLines);
    },
    parseVerses(lines) {
      this.versesMap = [];
      lines.forEach((line, lineIndex) => {
        let verse = null;
        line.forEach((block, blockIndex) => {
          if (block.v) {
            if (blockIndex > 0) {
              this.versesMap[block.v - 1][lineIndex].blockEnd = blockIndex - 1;
            }

            if (!this.versesMap[block.v]) {
              this.versesMap[block.v] = {};
            }

            this.versesMap[block.v][lineIndex] = {
              line: lineIndex,
              blockStart: blockIndex,
              blockEnd: null,
            };

            verse = block.v;
          }
        });

        this.versesMap[verse][lineIndex].blockEnd = line.length - 1;
      });
    },

    parseVersesLanguage(lines) {
      this.versesMapLanguage = [];
      lines.forEach((line, lineIndex) => {
        let verse = null;
        line.forEach((block, blockIndex) => {
          if (block.v) {
            if (blockIndex > 0) {
              this.versesMapLanguage[block.v - 1][lineIndex].blockEnd =
                blockIndex - 1;
            }

            if (!this.versesMapLanguage[block.v]) {
              this.versesMapLanguage[block.v] = {};
            }

            this.versesMapLanguage[block.v][lineIndex] = {
              line: lineIndex,
              blockStart: blockIndex,
              blockEnd: null,
            };

            verse = block.v;
          }
        });

        if (!verse) {
          return;
        }
        this.versesMapLanguage[verse][lineIndex].blockEnd = line.length - 1;
      });
    },

    loadFile(lines, lineIndex) {
      if (lines.length === lineIndex) {
        this.setFileLoading(false);
        return;
      }

      const line = lines[lineIndex];

      this.setLine({
        line,
        lineIndex,
      });

      lineIndex += 1;
      this.$nextTick(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.loadFile(lines, lineIndex);
          });
        });
      });
    },

    async loadBook() {
      this.setFileContent([]);
      this.setFileContentLanguage([]);
      this.verses = [];

      const language = `cmn-han${options.ideogramType}`;

      if (LocalStorage.get(`BIBLE_SAVE_${language}`)) {
        await window.frames["iframe-storage"].indexedDBOpen();
        const chapterCache = await window.frames["iframe-storage"].indexedDBGet(
          "bible",
          `${language}_${this.book}_${this.chapter}`
        );

        if (chapterCache) {
          this.fullLines = JSON.parse(chapterCache.text).lines;
          this.parseVerses(this.fullLines);
          if (this.verse) {
            this.selecteds = [];
            const splitVerse = this.verse.split("-");
            const startVerse = splitVerse[0];
            let endVerse = splitVerse[0];
            if (splitVerse[1]) {
              endVerse = splitVerse[1];
            }

            for (
              let i = parseInt(startVerse, 10);
              i <= parseInt(endVerse, 10);
              i += 1
            ) {
              this.selectVerse(i);
            }
          } else if (this.openChapterOnLoad) {
            this.selectAll();
          }
        }
      }

      axios
        .get(
          `https://pinyin-bible.pinzi.org/${language}/${this.book}/${this.chapter}.json?v=${CACHE_VERSION}`
        )
        .then(async (content) => {
          this.fullLines = content.data.lines;
          this.parseVerses(content.data.lines);
          if (this.verse) {
            this.selecteds = [];
            const splitVerse = this.verse.split("-");
            const startVerse = splitVerse[0];
            let endVerse = splitVerse[0];
            if (splitVerse[1]) {
              endVerse = splitVerse[1];
            }

            for (
              let i = parseInt(startVerse, 10);
              i <= parseInt(endVerse, 10);
              i += 1
            ) {
              this.selectVerse(i);
            }
          } else if (this.openChapterOnLoad) {
            this.selectAll();
          }

          this.$refs.fileContainer.updateRender();

          if (LocalStorage.get(`BIBLE_SAVE_${language}`)) {
            await window.frames["iframe-storage"].indexedDBPut("bible", {
              key: `${language}_${this.book}_${this.chapter}`,
              language,
              book: this.book,
              chapter: this.chapter,
              text: JSON.stringify(content.data),
            });
          }
        });

      if (LocalStorage.get(`BIBLE_SAVE_${options.translationLanguage}`)) {
        await window.frames["iframe-storage"].indexedDBOpen();
        const chapterCache = await window.frames["iframe-storage"].indexedDBGet(
          "bible",
          `${options.translationLanguage}_${this.book}_${this.chapter}`
        );
        if (chapterCache) {
          this.fullLinesLanguage = JSON.parse(chapterCache.text).lines;
          this.parseVersesLanguage(this.fullLinesLanguage);
          if (this.verse) {
            this.selectedsLanguage = [];
            const splitVerse = this.verse.split("-");
            const startVerse = splitVerse[0];
            let endVerse = splitVerse[0];
            if (splitVerse[1]) {
              endVerse = splitVerse[1];
            }

            for (
              let i = parseInt(startVerse, 10);
              i <= parseInt(endVerse, 10);
              i += 1
            ) {
              this.selectVerseLanguage(i);
            }
          }
        }
      }

      axios
        .get(
          `https://pinyin-bible.pinzi.org/${options.translationLanguage}/${this.book}/${this.chapter}.json?v=${CACHE_VERSION}`
        )
        .then(async (content) => {
          this.fullLinesLanguage = content.data.lines;
          this.parseVersesLanguage(content.data.lines);
          if (this.verse) {
            this.selectedsLanguage = [];
            const splitVerse = this.verse.split("-");
            const startVerse = splitVerse[0];
            let endVerse = splitVerse[0];
            if (splitVerse[1]) {
              endVerse = splitVerse[1];
            }

            for (
              let i = parseInt(startVerse, 10);
              i <= parseInt(endVerse, 10);
              i += 1
            ) {
              this.selectVerseLanguage(i);
            }
          }

          this.$refs.fileContainer.updateRender();

          if (LocalStorage.get(`BIBLE_SAVE_${options.translationLanguage}`)) {
            await window.frames["iframe-storage"].indexedDBPut("bible", {
              key: `${options.translationLanguage}_${this.book}_${this.chapter}`,
              language,
              book: this.book,
              chapter: this.chapter,
              text: JSON.stringify(content.data),
            });
          }
        });

      if (this.verse) {
        this.showVerses = false;
      } else {
        this.showVerses = true;
      }

      const chapter = chaptersData[this.book][this.chapter - 1];
      let initial = 1;
      if (chapter.i) {
        initial = chapter.i;
      }

      this.verses = [];
      for (let i = initial; i <= chapter.t; i += 1) {
        this.verses.push(i);
      }
    },

    openVersesDialog() {
      this.setVersesModalVisible(true);
    },
    closeVersesDialog() {
      this.setVersesModalVisible(false);
    },
  },
  created() {
    const optionsManager = new OptionsManager(this.$i18n);
    options = optionsManager.getOptions();
  },
  async mounted() {
    const language = `cmn-han${options.ideogramType}`;

    this.versesModalOpenTemp = this.versesModalOpen;

    if (navigator.onLine || LocalStorage.get(`BIBLE_SAVE_${language}`)) {
      await this.loadBook();
    } else {
      this.showSnackbarNoInternet = true;
      window.addEventListener("online", () => {
        this.loadBook();
      });
    }
  },
};
</script>

<style>
.bible-chapter-container {
  align-content: flex-start;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  width: 100%;
}

.bible-chapter-container .print .line {
  margin-bottom: 0 !important;
}

.verses-container {
  align-content: flex-start;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 5px 5px 0 5px;
  max-height: 90px;
  min-height: 35px;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  width: 100%;
}

.bible-verse {
  background-color: #bab6b6;
  color: #fff;
  cursor: pointer;
  font-size: 13px;
  height: 30px;
  justify-content: flex-start;
  line-height: 30px;
  margin: 2px;
  text-align: center;
  user-select: none;
  width: 30px;
}

.special-action {
  background: #4c4a4a;
}

.special-action i {
  color: #fff !important;
}

.selected {
  background: #275197;
}

.dialog-bible-verses {
  max-width: 90% !important;
  min-width: 90% !important;
  max-height: 90% !important;
}

.dialog-bible-verses .md-dialog-title {
  margin: 0;
  padding: 15px 15px 0;
}

.dialog-bible-verses .md-dialog-content {
  padding: 2px;
}

.dialog-bible-verses .md-dialog-actions {
  min-height: 42px;
  justify-content: space-between;
}

.dialog-bible-verses .bible-verse {
  line-height: 45px;
  height: 45px;
  width: 45px;
  font-size: 16px;
}

.dialog-bible-verses .verses-container {
  max-height: inherit;
}
</style>
