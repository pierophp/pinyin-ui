<template>
  <div>
    <md-dialog
      ref="dialogDictionary"
      :md-active="modalDictionaryOpen"
      :md-fullscreen="false"
      id="dialog-dictionary"
    >
      <md-dialog-title>
        <traditional-simplified-show
          :pinyin="block.pinyin"
          :ideograms="block.character"
          :variants="fullDictionary.variants"
          :highlights="selectedIndexes"
        />
        - {{ block.pinyin }}
        <md-button
          class="md-icon-button md-primary clipboard-btn"
          @click="clipboard(block.character)"
        >
          <md-icon>content_copy</md-icon>
        </md-button>

        <md-button class="md-icon-button md-accent sound-btn" @click.native="openSound">
          <md-icon>volume_up</md-icon>
        </md-button>
      </md-dialog-title>

      <md-dialog-content>
        <tabs>
          <tab id="dict" :label="$t('definition')">
            <div class="loadable-loader" v-show="dictionaryLoading">
              <md-progress-spinner
                class="md-accent"
                md-mode="indeterminate"
                :visible="dictionaryLoading"
              ></md-progress-spinner>
            </div>

            <dictionary-details
              :dictionary="dictionary"
              :pinyin="block.pinyin"
              @change-show="changeShow"
              ref="dictionaryDetails"
              v-show="!dictionaryLoading"
            />

            <dictionary-list :list="dictionaryList" v-show="!dictionaryLoading"/>
          </tab>

          <tab id="stroke" :label="$t('stroke')">
            <dictionary-stroke-order :ideograms="block.character"/>
          </tab>

          <tab id="links" label="Links">
            <Links list="1" :character="block.character"/>
          </tab>
        </tabs>
      </md-dialog-content>

      <md-dialog-actions>
        <div class="navigation-container">
          <md-button
            class="md-icon-button md-primary clipboard-btn"
            @click="goLeft(block.character)"
          >
            <md-icon>first_page</md-icon>
          </md-button>

          <md-button
            class="md-icon-button md-primary clipboard-btn"
            @click="goRight(block.character)"
          >
            <md-icon>last_page</md-icon>
          </md-button>

          <md-button
            class="md-icon-button md-primary clipboard-btn"
            @click="selectLeft(block.character)"
          >
            <md-icon>chevron_left</md-icon>
          </md-button>

          <md-button
            class="md-icon-button md-primary clipboard-btn"
            @click="selectRight(block.character)"
          >
            <md-icon>chevron_right</md-icon>
          </md-button>
        </div>

        <md-button class="md-primary" @click.native="modalDictionaryOpen = false">OK</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-snackbar md-position="center" :md-duration="1300" :md-active.sync="clipboardOpen">
      <span>{{ $t('copied_to_clipboard') }}</span>
    </md-snackbar>

    <forvo-modal ref="dialogForvo" :character="block.character"/>
  </div>
</template>

<script>
import http from 'src/helpers/http';
import Tabs from 'src/components/common/Tabs';
import Tab from 'src/components/common/Tab';
import TraditionalSimplifiedShow from 'src/components/ideograms/TraditionalSimplifiedShow';
import ForvoModal from 'src/components/modals/Forvo';
import Links from 'src/components/ideograms/Links';
import DictionaryStrokeOrder from 'src/components/dictionary/StrokeOrder';
import DictionaryList from 'src/components/dictionary/List';
import DictionaryDetails from 'src/components/dictionary/Details';

let memoryDictionary = {};
const loadingDictionary = {};

export default {
  name: 'modal-dictionary',
  components: {
    DictionaryStrokeOrder,
    DictionaryDetails,
    DictionaryList,
    Links,
    ForvoModal,
    TraditionalSimplifiedShow,
    Tabs,
    Tab,
  },
  data() {
    const baseDictionary = {
      pt: null,
      variants: null,
      unihan: null,
      cedict: null,
      chinese_tools_pt: null,
      chinese_tools_es: null,
      chinese_tools_en: null,
    };

    return {
      block: {},
      modalDictionaryOpen: false,
      dictionaryLoading: false,
      clipboardOpen: false,
      selectedIndexes: {},
      baseDictionary,
      dictionary: baseDictionary,
      fullDictionary: baseDictionary,
      dictionaryList: [],
    };
  },

  methods: {
    changeShow(e) {
      this.$emit('change-show', e);
      memoryDictionary = {};
    },

    clipboard(ideogram) {
      this.$clipboard(ideogram);
      this.clipboardOpen = true;
    },

    async open(block) {
      this.block = block;
      this.loadDictionary();
      this.modalDictionaryOpen = true;
      this.clear();
    },

    openSound() {
      this.openDialog('dialogForvo');
    },

    openDialog(ref) {
      this.$refs[ref].open();
    },

    clear() {
      this.selectedIndexes = {};
      this.dictionaryList = [];
      this.dictionary = this.baseDictionary;
      this.fullDictionary = this.baseDictionary;
    },

    goLeft() {
      if (Object.keys(this.selectedIndexes).length === 0) {
        this.$set(this.selectedIndexes, 0, true);
      } else {
        const lastIndex = Object.keys(this.selectedIndexes)
          .map(item => parseInt(item, 10))
          .sort()
          .slice(-1)[0];

        this.$delete(this.selectedIndexes, lastIndex);
      }

      this.loadDictionary();
    },

    goRight() {
      if (Object.keys(this.selectedIndexes).length === 0) {
        this.$set(this.selectedIndexes, 0, true);
      } else {
        const lastIndex = Object.keys(this.selectedIndexes)
          .map(item => parseInt(item, 10))
          .sort()
          .slice(-1)[0];

        if (lastIndex + 1 < this.block.character.length) {
          const nextValue = lastIndex + 1;
          this.$set(this.selectedIndexes, nextValue, true);
        }
      }

      this.loadDictionary();
    },

    selectLeft() {
      if (Object.keys(this.selectedIndexes).length === 0) {
        this.$set(this.selectedIndexes, 0, true);
      } else {
        const firstIndex = Object.keys(this.selectedIndexes)
          .map(item => parseInt(item, 10))
          .sort()[0];

        this.selectedIndexes = {};
        this.$set(this.selectedIndexes, firstIndex - 1, true);
      }

      this.loadDictionary();
    },

    selectRight() {
      if (Object.keys(this.selectedIndexes).length === 0) {
        this.$set(this.selectedIndexes, 0, true);
      } else {
        const lastIndex = Object.keys(this.selectedIndexes)
          .map(item => parseInt(item, 10))
          .sort()
          .slice(-1)[0];

        if (lastIndex + 1 < this.block.character.length) {
          this.selectedIndexes = {};
          this.$set(this.selectedIndexes, lastIndex + 1, true);
        }
      }
      this.loadDictionary();
    },

    async requestDictionary(character, pinyin) {
      const cacheKey = `${character}_${pinyin}`;

      if (memoryDictionary[cacheKey]) {
        return memoryDictionary[cacheKey];
      }

      if (loadingDictionary[cacheKey] === true) {
        const awaitedResult = await new Promise(resolve => {
          function verifyLoadDictionary() {
            if (memoryDictionary[cacheKey]) {
              return resolve(memoryDictionary[cacheKey]);
            }

            if (!loadingDictionary[cacheKey]) {
              return resolve(null);
            }

            setTimeout(() => {
              verifyLoadDictionary();
            }, 50);
          }
          verifyLoadDictionary();
        });

        if (awaitedResult) {
          return awaitedResult;
        }
      }

      loadingDictionary[cacheKey] = true;

      setTimeout(() => {
        loadingDictionary[cacheKey] = false;
      }, 5000);

      memoryDictionary[cacheKey] = (await http.get('unihan/dictionary', {
        params: {
          ideograms: character,
          pinyin: pinyin,
        },
      })).data;

      return memoryDictionary[cacheKey];
    },

    async loadDictionary() {
      this.dictionaryLoading = true;

      let character = this.block.character;
      let pinyin = this.block.pinyin;

      if (Object.keys(this.selectedIndexes).length > 0) {
        character = '';
        pinyin = '';
        const pinyinList = this.block.originalPinyin.split(
          String.fromCharCode(160),
        );
        for (const key of Object.keys(this.selectedIndexes)) {
          character += this.block.character[key];
          pinyin += pinyinList[key];
        }
      }

      const response = await this.requestDictionary(character, pinyin);

      this.dictionary = this.baseDictionary;
      this.dictionaryList = [];

      if (response.list) {
        this.dictionaryList = response.list;
        this.dictionaryLoading = false;
        return;
      }

      const isSimplifiedEquals = response.ideograms === character;

      const isTraditionalEquals = response.search_ideograms === character;

      if (!isSimplifiedEquals && !isTraditionalEquals) {
        return;
      }

      if (Object.keys(this.selectedIndexes).length === 0) {
        this.fullDictionary = response;
      }
      this.dictionary = response;
      this.dictionaryLoading = false;
    },
  },
};
</script>

<style scoped>
.sound-btn,
.clipboard-btn {
  padding: 0 !important;
  margin: 0 !important;
  width: 30px !important;
  min-width: 30px !important;
  height: 30px !important;
  min-height: 30px !important;
}

.sound-btn i,
.clipboard-btn i {
  width: 20px !important;
  min-width: 20px !important;
  height: 20px !important;
  min-height: 20px !important;
  font-size: 20px !important;
}

.navigation-container {
  width: 100%;
  display: flex;
  justify-content: flex-start;
}

.navigation-container i {
  font-size: 30px !important;
  width: 30px !important;
  height: 30px !important;
  line-height: 30px !important;
}

.navigation-container .md-button {
  margin-left: 8px !important;
}
</style>
