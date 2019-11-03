<template>
  <div class="bible-save-container">
    <table class="spaced-table">
      <thead>
        <tr>
          <th>{{ $t('language') }}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(language, index) in languages" :key="index">
          <td>{{ language.language }}</td>
          <td class="cell-button">
            <md-button
              class="md-icon-button md-raised"
              @click.native="openModalConfirm('download', language.code, index)"
              v-if="!language.downloaded"
            >
              <md-icon>cloud_download</md-icon>
            </md-button>

            <md-button
              class="md-icon-button md-raised downloaded"
              @click.native="openModalConfirm('delete', language.code, index)"
              v-if="language.downloaded"
            >
              <md-icon>cloud_download</md-icon>
            </md-button>
          </td>
        </tr>
      </tbody>
    </table>

    <md-dialog :md-active.sync="modalConfirmOpened" :md-fullscreen="false">
      <md-dialog-title>{{ $t('confirmation') }}</md-dialog-title>
      <md-dialog-content>
        <span v-if="modalType === 'download'">{{ $t('confirmation_download_bible') }}</span>
        <span v-if="modalType === 'delete'">{{ $t('confirmation_delete_bible') }}</span>
        <div style="text-align: center; width: 100%">
          <br>
          <md-progress-bar
            class="md-accent"
            md-mode="determinate"
            :md-value="percent"
            v-if="downloading"
          ></md-progress-bar>
        </div>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click.native="modalCancel">{{ $t('cancel') }}</md-button>
        <md-button class="md-primary" @click.native.prevent="modalConfirm">{{ $t('ok') }}</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import chaptersData from 'shared/data/bible/chapters';
import axios from 'axios';
import OptionsManager from 'src/domain/options-manager';
import LocalStorage from 'src/helpers/local-storage';

const CACHE_VERSION = 1;

export default {
  name: 'bible-save',
  data() {
    const optionsManager = new OptionsManager(this.$i18n);
    const languages = optionsManager.getLanguages(true);
    languages.forEach((language, languageIndex) => {
      languages[languageIndex].downloaded = LocalStorage.has(
        `BIBLE_SAVE_${language.code}`,
      );
    });

    return {
      downloading: false,
      percent: 0,
      total: 1189,
      languages,
      modalConfirmOpened: false,
      modalLanguage: '',
      modalLanguageIndex: 0,
      modalType: '',
    };
  },
  mounted() {},

  methods: {
    async modalConfirm() {
      if (this.downloading) {
        return;
      }

      if (this.modalType === 'download') {
        await this.save(this.modalLanguage, this.modalLanguageIndex);
      } else if (this.modalType === 'delete') {
        await this.delete(this.modalLanguage, this.modalLanguageIndex);
      }
      setTimeout(() => {
        this.modalConfirmOpened = false;
      }, 1000);
    },
    async modalCancel() {
      this.downloading = false;
      this.modalConfirmOpened = false;
    },
    openModalConfirm(type, language, languageIndex) {
      this.downloading = false;
      this.percent = 0;
      this.modalLanguage = language;
      this.modalType = type;
      this.modalLanguageIndex = languageIndex;
      this.modalConfirmOpened = true;
    },
    async save(language, languageIndex) {
      this.downloading = true;
      await window.frames['iframe-storage'].indexedDBOpen();
      let count = 0;

      for (const book of Object.keys(chaptersData)) {
        if (!this.downloading) {
          continue;
        }

        for (const chapterIndex of Object.keys(chaptersData[book])) {
          if (!this.downloading) {
            continue;
          }

          count += 1;

          this.percent = (count * 100) / this.total;

          const chapter = chaptersData[book][chapterIndex].c;

          const text = await axios.get(
            `https://pinyin-bible.pinzi.org/${language}/${book}/${chapter}.json?v=${CACHE_VERSION}`,
          );

          await window.frames['iframe-storage'].indexedDBPut('bible', {
            key: `${language}_${book}_${chapter}`,
            language,
            book,
            chapter,
            text: JSON.stringify(text.data),
          });

          if (this.percent === 100) {
            LocalStorage.save(`BIBLE_SAVE_${language}`, 1);
            this.languages[languageIndex].downloaded = true;
          }
        }
      }
    },

    async delete(language, languageIndex) {
      this.downloading = true;
      await window.frames['iframe-storage'].indexedDBOpen();
      let count = 0;

      for (const book of Object.keys(chaptersData)) {
        for (const chapterIndex of Object.keys(chaptersData[book])) {
          count += 1;
          this.percent = (count * 100) / this.total;

          const chapter = chaptersData[book][chapterIndex].c;

          await window.frames['iframe-storage'].indexedDBDelete(
            'bible',
            `${language}_${book}_${chapter}`,
          );

          if (this.percent === 100) {
            LocalStorage.remove(`BIBLE_SAVE_${language}`);
            this.languages[languageIndex].downloaded = false;
          }
        }
      }
    },
  },
};
</script>


<style>
.bible-save-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  width: 100%;
  margin: 15px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.bible-save-container .downloaded i {
  color: #448aff !important;
}
</style>
