<template>
  <div>
    <div class="bottom-bar no-print" v-if="show">
      <span
        class="ideogram-link"
        v-for="(data,index) in printData"
        @click.prevent="openModal(data.characterLink)"
        :key="index"
      >
        <ideograms-show :pinyin="data.pinyin" :character="data.character" ref="ideogram-show"/>
      </span>

      <span class="bottom-bar-pinyin">{{ block.pinyin }}</span>

      <md-button class="md-icon-button md-primary" @click.native="loadDictionary()">
        <md-icon>find_in_page</md-icon>
      </md-button>

      <menu-content position="top">
        <template slot="click">
          <md-button class="md-icon-button md-primary md-2">
            <md-icon>more_vert</md-icon>
          </md-button>
        </template>

        <div class="list-container">
          <div class="list-item" @click="close()">
            <div class="icon">
              <md-icon>clear</md-icon>
            </div>
            <div class="content">{{ $t("close") }}</div>
          </div>

          <div class="list-item" @click="joinLeft(block)">
            <div class="icon">
              <md-icon>arrow_back</md-icon>
            </div>
            <div class="content">{{ $t("join_left") }}</div>
          </div>

          <div class="list-item" @click="separate(block)">
            <div class="icon">
              <md-icon>swap_horiz</md-icon>
            </div>
            <div class="content">{{ $t("split") }}</div>
          </div>

          <div class="list-item" @click="edit(block)">
            <div class="icon">
              <md-icon>edit</md-icon>
            </div>
            <div class="content">{{ $t("edit") }}</div>
          </div>

          <div class="list-item" @click="openLinkMenu()">
            <div class="icon">
              <md-icon>open_in_browser</md-icon>
            </div>
            <div class="content">Links</div>
          </div>
        </div>
      </menu-content>
      <Links list="0" :character="block.character" ref="links"/>
    </div>

    <md-dialog
      ref="dialogDictionary"
      :md-active.sync="modalDictionaryOpen"
      :md-fullscreen="false"
      id="dialog-dictionary"
    >
      <md-dialog-title>
        <traditional-simplified-show
          :pinyin="block.pinyin"
          :ideograms="block.character"
          :variants="dictionary.variants"
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
            <div class="loadable-loader" v-show="modalDictionaryLoading">
              <md-progress-spinner
                class="md-accent"
                md-mode="indeterminate"
                :visible="modalDictionaryLoading"
              ></md-progress-spinner>
            </div>
            <dictionary-details
              :dictionary="dictionary"
              :pinyin="block.pinyin"
              @change-show="changeShow"
              ref="dictionaryDetails"
              v-show="!modalDictionaryLoading"
            />
            <dictionary-list :list="dictionaryList" v-show="!modalDictionaryLoading"/>
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
        <md-button class="md-primary" @click.native="modalDictionaryOpen = false">OK</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog ref="dialogSeparate" :md-active.sync="modalSeparateOpen" :md-fullscreen="false">
      <md-dialog-title>
        <ideograms-show :pinyin="block.pinyin" :character="block.character"/>
        - {{ block.pinyin }}
      </md-dialog-title>

      <md-dialog-content>
        <div class="field-container">
          <input type="text" v-model="separateCharacter">
        </div>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click.native="confirmSeparate">OK</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog ref="dialogEdit" :md-active.sync="modalEditOpen" :md-fullscreen="false">
      <md-dialog-title>
        <ideograms-show :pinyin="block.pinyin" :character="block.character"/>
        - {{ block.pinyin }}
      </md-dialog-title>

      <md-dialog-content>
        <div class="field-container">
          <input type="text" v-model="editPinyin">
        </div>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click.native="confirmEdit">OK</md-button>
      </md-dialog-actions>
    </md-dialog>

    <forvo-modal ref="dialogForvo" :character="block.character"/>

    <md-snackbar md-position="center" :md-duration="1300" :md-active.sync="clipboardOpen">
      <span>{{ $t('copied_to_clipboard') }}</span>
    </md-snackbar>
  </div>
</template>

<script>
import http from 'src/helpers/http';
import DictionaryDetails from 'src/components/dictionary/Details';
import DictionaryList from 'src/components/dictionary/List';
import IdeogramsShow from 'src/components/ideograms/Show';
import Links from 'src/components/ideograms/Links';
import OptionsManager from 'src/domain/options-manager';

import separatePinyinInSyllables from 'src/helpers/separate-pinyin-in-syllables';
import replaceall from 'replaceall';
import pinyinHelper from 'src/helpers/pinyin';
import isMobile from 'src/helpers/is-mobile';
import ForvoModal from 'src/components/modals/Forvo';
import TraditionalSimplifiedShow from 'src/components/ideograms/TraditionalSimplifiedShow';
import DictionaryStrokeOrder from 'src/components/dictionary/StrokeOrder';
import MenuContent from 'src/components/common/MenuContent';
import { mapActions, mapMutations, mapGetters } from 'vuex';
import Tabs from 'src/components/common/Tabs';
import Tab from 'src/components/common/Tab';

import {
  FILE_ACTION_JOIN_LEFT,
  FILE_ACTION_SEPARATE,
  FILE_MUTATION_SET_MY_CJK_TEMP,
  FILE_MUTATION_UPDATE_PINYIN,
  FILE_GETTER_MY_CJK,
} from 'src/data/file/types';

let memoryDictionary = {};
const loadingDictionary = {};

export default {
  name: 'file-bottom-bar',
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
      editPinyin: '',
      separateCharacter: '',
      show: false,
      tempDictCharacter: null,
      block: {},
      printData: {},
      modalDictionaryOpen: false,
      modalDictionaryLoading: false,
      modalSeparateOpen: false,
      modalEditOpen: false,
      clipboardOpen: false,
      baseDictionary,
      dictionary: baseDictionary,
      dictionaryList: [],
      isMobile: isMobile(),
    };
  },
  components: {
    DictionaryDetails,
    DictionaryList,
    DictionaryStrokeOrder,
    IdeogramsShow,
    Links,
    ForvoModal,
    TraditionalSimplifiedShow,
    MenuContent,
    Tabs,
    Tab,
  },
  computed: {
    ...mapGetters({
      myCjk: FILE_GETTER_MY_CJK,
    }),
  },

  watch: {
    editPinyin() {
      this.changeEditPinyin(this.editPinyin);
    },
  },

  methods: {
    ...mapActions({
      joinLeftAction: FILE_ACTION_JOIN_LEFT,
      separateAction: FILE_ACTION_SEPARATE,
    }),
    ...mapMutations({
      setMyCjkTemp: FILE_MUTATION_SET_MY_CJK_TEMP,
      updatePinyin: FILE_MUTATION_UPDATE_PINYIN,
    }),

    openLinkMenu() {
      this.$refs.links.open();
    },

    changeShow(show) {
      this.show = !show;
      const action = show ? 'remove' : 'add';
      document.body.classList[action]('has-bottom-bar');
      memoryDictionary = {};
    },

    separate() {
      this.separateCharacter = this.block.character;
      this.modalSeparateOpen = true;
    },

    async confirmSeparate() {
      this.modalSeparateOpen = false;
      await this.separateAction({
        ...this.block,
        separateCharacter: this.separateCharacter,
      });

      setTimeout(() => {
        this.$emit('reopen', this.block.lineIndex, this.block.blockIndex);
      }, 1000);
    },

    async joinLeft(block) {
      await this.joinLeftAction(block);
      setTimeout(() => {
        this.$emit('reopen', this.block.lineIndex, this.block.blockIndex - 1);
      }, 1000);
    },

    edit() {
      this.editPinyin = this.block.pinyin;
      this.modalEditOpen = true;
    },

    confirmEdit() {
      this.updatePinyin({ ...this.block, pinyin: this.editPinyin });
      this.modalEditOpen = false;
      this.$emit('reopen', this.block.lineIndex, this.block.blockIndex);
    },

    changeEditPinyin(pinyin) {
      this.editPinyin = pinyinHelper(pinyin);
    },

    close() {
      document.body.classList.remove('has-bottom-bar');
      this.show = false;
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

    open(block) {
      document.body.classList.add('has-bottom-bar');
      this.show = true;

      if (this.isMobile && this.tempDictCharacter === block.character) {
        block.openDictionary = true;
      }

      this.block = block;
      block.pinyin = replaceall(
        String.fromCharCode(160),
        '',
        block.pinyin || '',
      );

      this.requestDictionary(block.character, block.pinyin).then();
      this.tempDictCharacter = block.character;
      const pinyin = separatePinyinInSyllables(block.pinyin);

      // clean the selection in 2 seconds
      setTimeout(() => {
        this.tempDictCharacter = null;
      }, 2000);
      const chars = block.character.toString();
      const printData = [];
      const options = OptionsManager.getOptions();
      for (let i = 0; i < chars.length; i += 1) {
        let characterLink = chars[i];
        if (options.pinyinHide === '2') {
          characterLink = chars;
        }

        let pinyinSeparated = '';
        if (pinyin[i]) {
          pinyinSeparated = pinyin[i].trim();
        }

        printData.push({
          pinyin: pinyinSeparated,
          character: chars[i],
          characterLink,
        });
      }

      this.printData = printData;

      if (block.openDictionary) {
        this.loadDictionary();
      }

      if (this.$refs['ideogram-show']) {
        this.$nextTick(() => {
          for (const ideogramShow of this.$refs['ideogram-show']) {
            ideogramShow.updateRender();
          }
        });
      }
    },

    openModal(character) {
      let add = true;
      if (this.myCjk[character] !== undefined) {
        add = false;
      }

      this.setMyCjkTemp(character);
      this.$emit('open-modal', add);
    },

    async loadDictionary() {
      this.dictionary = this.baseDictionary;
      this.dictionaryList = [];
      this.modalDictionaryOpen = true;
      this.modalDictionaryLoading = true;
      const response = await this.requestDictionary(
        this.block.character,
        this.block.pinyin,
      );

      this.dictionary = this.baseDictionary;
      this.dictionaryList = [];

      if (response.list) {
        this.dictionaryList = response.list;
        this.modalDictionaryLoading = false;
        return;
      }

      const isSimplifiedEquals = response.ideograms === this.block.character;

      const isTraditionalEquals =
        response.search_ideograms === this.block.character;

      if (!isSimplifiedEquals && !isTraditionalEquals) {
        return;
      }
      this.dictionary = response;
      this.modalDictionaryLoading = false;
    },

    openPinyinList() {
      http
        .post('unihan/to_pinyin_all', {
          ideograms: [this.block.character],
        })
        .then(response => {
          // eslint-disable-next-line
          console.log(response.data);
        });
    },

    clipboard(ideogram) {
      this.$clipboard(ideogram);
      this.clipboardOpen = true;
    },

    openSound() {
      this.openDialog('dialogForvo');
    },

    openDialog(ref) {
      this.$refs[ref].open();
    },
    closeDialog(ref) {
      this.$refs.dictionaryDetails.cancelEdit();
      this.show = true;
      this.$refs[ref].close();
    },
    onOpen() {
      // eslint-disable-next-line
      console.log('Opened');
    },

    onClose(type) {
      // eslint-disable-next-line
      console.log('Closed', type);
    },
  },
};
</script>

<style>
.bottom-bar {
  border-top: 2px #ccc solid;
  background: #fff;
  font-size: 22px;
  padding: 0 10px;
  line-height: 40px;
  height: 40px;
  width: 100%;
  display: flex;
  flex-shrink: 0;
}

.bottom-bar .menu-container {
  width: 20px;
}

.bottom-bar .list-container {
  font-size: 14px;
}

#dialog-dictionary .loadable-loader {
  min-height: 200px;
  text-align: center;
  margin: 50px;
}

#dialog-dictionary.md-dialog {
  height: 80%;
}

#dialog-dictionary .md-dialog-title {
  margin-bottom: 0 !important;
  padding: 15px 15px 0;
}

#dialog-dictionary .md-dialog-content {
  padding: 0 15px 15px;
}

.bottom-bar-pinyin {
  font-size: 15px;
}

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

.bottom-bar .ideogram-link {
  cursor: pointer;
}

.bottom-bar .md-button {
  min-width: auto;
}
</style>
