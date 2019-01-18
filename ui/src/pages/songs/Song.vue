<template>
  <span class="song-container">
    <file-container
      :lines="lines"
      :fullLines="fullLines"
      filename
      :fileLoading="fileLoading"
      @open-bottom-bar="openBottomBar"
      :parent="true"
      :showHighlight="false"
      :useFullLines="false"
    />
    <md-snackbar md-position="center" :md-duration="3000" :md-active.sync="showSnackbarNoInternet">
      <span>{{ $t('no_internet') }}</span>
    </md-snackbar>
  </span>
</template>

<script>
import axios from 'axios';
import OptionsManager from 'src/domain/options-manager';
import LocalStorage from 'src/helpers/local-storage';

let options = {};

const CACHE_VERSION = 1;

export default {
  name: 'song',
  data() {
    return {
      lines: [],
      fullLines: [],
      fileLoading: false,
      showSnackbarNoInternet: false,
    };
  },

  methods: {
    clear() {
      this.setFileContent([]);
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

    openBottomBar(data) {
      this.$emit('open-bottom-bar', data);
    },

    loadFile(lines, lineIndex) {
      const line = lines[lineIndex];

      if (!line) {
        return;
      }

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

    async loadSong() {
      this.setFileContent([]);

      const language = `cmn-han${options.ideogramType}`;
      const song = this.$route.params.song;

      if (LocalStorage.get(`SONG_SAVE_${language}`)) {
        await window.frames['iframe-storage'].indexedDBOpen();
        const songCache = await window.frames['iframe-storage'].indexedDBGet(
          'song',
          `${language}_${song}`,
        );

        if (songCache) {
          this.fullLines = JSON.parse(chapterCache.text).lines;
          this.loadFile(this.fullLines, 0);
        }
      }

      axios
        .get(`static/songs/${language}/${song}.json?v=${CACHE_VERSION}`)
        .then(async content => {
          this.fullLines = content.data.lines;
          this.loadFile(this.fullLines, 0);

          if (LocalStorage.get(`SONG_SAVE_${language}`)) {
            await window.frames['iframe-storage'].indexedDBPut('song', {
              key: `${language}_${this.song}`,
              language,
              song,
              text: JSON.stringify(content.data),
            });
          }
        });
    },
  },
  created() {
    options = OptionsManager.getOptions();
  },
  async mounted() {
    const language = `cmn-han${options.ideogramType}`;

    if (navigator.onLine || LocalStorage.get(`SONG_SAVE_${language}`)) {
      await this.loadSong();
    } else {
      this.showSnackbarNoInternet = true;
      window.addEventListener('online', () => {
        this.loadSong();
      });
    }
  },
};
</script>

<style>
.song-container {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: flex-start;
  width: 100%;
  overflow: auto;
}
</style>
