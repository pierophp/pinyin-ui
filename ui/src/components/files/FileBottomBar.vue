<template>
  <div>
    <div class="bottom-bar" v-if="show">
      <span class="ideogram-link" v-for="(data,index) in printData" @click.prevent="openModal(data.characterLink)" :key="index">
        <ideograms-show :pinyin="data.pinyin" :character="data.character"/>
      </span>

      <span class="pinyin">{{ block.pinyin }}</span>

      <md-button class="md-icon-button md-primary" @click.native="loadDictionary()">
        <md-icon>find_in_page</md-icon>
      </md-button>

      <md-menu md-size="4"  md-direction="top left" md-offset-y="-52">
        <md-button class="md-icon-button md-primary md-2" md-menu-trigger>
          <md-icon>more_vert</md-icon>
        </md-button>

        <md-menu-content>
          <md-menu-item @click.native="joinLeft(block)">
            <md-icon>arrow_back</md-icon>
            <span>{{ $t('join_left') }}</span>
          </md-menu-item>
          <md-menu-item @click.native="separate(block)">
            <md-icon>swap_horiz</md-icon>
            <span>{{ $t('split') }}</span>
          </md-menu-item>
          <md-menu-item @click.native="edit(block)">
            <md-icon>edit</md-icon>
            <span>{{ $t('edit') }}</span>
          </md-menu-item>
          <md-menu-item @click.native="close()">
            <md-icon>clear</md-icon>
            <span>{{ $t('close') }}</span>
          </md-menu-item>
        </md-menu-content>
      </md-menu>
    </div>


    <md-dialog ref="dialogDictionary">
      <md-dialog-title>
        <ideograms-show :pinyin="block.pinyin" :character="block.character"/>
        - {{ block.pinyin }}
      </md-dialog-title>

      <md-dialog-content>
        <dictionary-details :dictionary="dictionary" :pinyin="block.pinyin" @change-show="changeShow" ref="dictionaryDetails"/>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click.native="closeDialog('dialogDictionary')">OK</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog ref="dialogSeparate">
      <md-dialog-title>
        <ideograms-show :pinyin="block.pinyin" :character="block.character"/>
        - {{ block.pinyin }}
      </md-dialog-title>

      <md-dialog-content>
        <md-input-container md-inline>
          <md-input v-model="separateCharacter"></md-input>
        </md-input-container>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click.native="confirmSeparate">OK</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog ref="dialogEdit">
      <md-dialog-title>
        <ideograms-show :pinyin="block.pinyin" :character="block.character"/>
        - {{ block.pinyin }}
      </md-dialog-title>

      <md-dialog-content>
        <md-input-container md-inline>
          <md-input :value="editPinyin" @change="changeEditPinyin"></md-input>
        </md-input-container>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click.native="confirmEdit">OK</md-button>
      </md-dialog-actions>
    </md-dialog>

  </div>
</template>

<script>
  import http from 'src/helpers/http';
  import DictionaryDetails from 'src/components/dictionary/Details';
  import IdeogramsShow from 'src/components/ideograms/Show';
  import OptionsManager from 'src/domain/options-manager';
  import MobileDetect from 'mobile-detect';
  import separatePinyinInSyllables from 'shared/helpers/separate-pinyin-in-syllables';
  import replaceall from 'replaceall';
  import pinyinHelper from 'src/helpers/pinyin';

  import {
    mapActions,
    mapMutations,
    mapGetters,
  } from 'vuex';

  import {
    FILE_ACTION_JOIN_LEFT,
    FILE_ACTION_SEPARATE,
    FILE_MUTATION_SET_MY_CJK_TEMP,
    FILE_MUTATION_UPDATE_PINYIN,
    FILE_GETTER_MY_CJK,
  } from 'src/data/file/types';

  const md = new MobileDetect(window.navigator.userAgent);

  export default {
    name: 'file-bottom-bar',
    data() {
      return {
        editPinyin: '',
        separateCharacter: '',
        show: false,
        tempDictCharacter: null,
        block: {},
        printData: {},
        dictionary: {
          pt: null,
          unihan: null,
          cedict: null,
          chinese_tools_pt: null,
          chinese_tools_es: null,
          chinese_tools_en: null,
        },
      };
    },
    components: {
      DictionaryDetails,
      IdeogramsShow,
    },
    computed: {
      ...mapGetters({
        myCjk: FILE_GETTER_MY_CJK,
      }),
    },

    methods: {
      ...mapActions({
        joinLeft: FILE_ACTION_JOIN_LEFT,
        separateAction: FILE_ACTION_SEPARATE,
      }),
      ...mapMutations({
        setMyCjkTemp: FILE_MUTATION_SET_MY_CJK_TEMP,
        updatePinyin: FILE_MUTATION_UPDATE_PINYIN,
      }),

      changeShow(show) {
        this.show = !show;
      },

      separate() {
        this.separateCharacter = this.block.character;
        this.openDialog('dialogSeparate');
      },

      confirmSeparate() {
        this.separateAction({ ...this.block, separateCharacter: this.separateCharacter });
        this.closeDialog('dialogSeparate');
      },

      edit() {
        this.editPinyin = this.block.pinyin;
        this.openDialog('dialogEdit');
      },

      confirmEdit() {
        this.updatePinyin({ ...this.block, pinyin: this.editPinyin });
        this.closeDialog('dialogEdit');
      },

      changeEditPinyin(pinyin) {
        this.editPinyin = pinyinHelper(pinyin);
      },

      close() {
        this.show = false;
      },

      open(block) {
        this.show = true;
        if (md.mobile() && this.tempDictCharacter === block.character) {
          block.openDictionary = true;
        }

        this.block = block;
        block.pinyin = replaceall(String.fromCharCode(160), '', block.pinyin);
        this.tempDictCharacter = block.character;
        const pinyin = separatePinyinInSyllables(block.pinyin);
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

          printData.push({
            pinyin: pinyin[i].trim(),
            character: chars[i],
            characterLink,
          });
        }

        this.printData = printData;

        if (block.openDictionary) {
          this.loadDictionary();
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

      loadDictionary() {
        http
        .get('unihan/dictionary', {
          params: {
            ideograms: this.block.character,
          },
        })
        .then((response) => {
          if (response.data.ideograms !== this.block.character) {
            return;
          }
          this.dictionary = response.data;
          this.openDialog('dialogDictionary');
        });
      },

      openPinyinList() {
        http
        .post('unihan/to_pinyin_all', {
          ideograms: [this.block.character],
        })
        .then((response) => {
          // eslint-disable-next-line
          console.log(response.data);
        });
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

<style scoped>
.bottom-bar {
  border-top: 2px #ccc solid;
  background: #fff;
  font-size: 22px;
  padding: 0 10px;
  line-height: 40px;
  height: 40px;
  width: 100%;
  flex-shrink: 0;
}
.md-menu {
  margin-left: -20px;
}
.pinyin{
  font-size: 15px;
}

.bottom-bar #menu-pinyin .md-menu .md-button{
  margin: 6px 0;
  padding: 0 6px;
}

.bottom-bar .ideogram-link {
  cursor: pointer;
}

.dict-title {
  font-weight: bold;
  font-size:18px;
}

.dict-block{
  padding-bottom: 10px;
}

.bottom-bar .md-button{
  min-width: auto;
}
</style>
