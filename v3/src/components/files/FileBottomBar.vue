<template>
  <div>
    <div class="bottom-bar no-print" v-if="show">
      <span
        class="ideogram-link"
        v-for="(data, index) in printData"
        @click.prevent="openModal(data.characterLink)"
        :key="index"
      >
        <ideograms-show
          :pinyin="data.pinyin"
          :character="data.character"
          ref="ideogram-show"
        />
      </span>

      <span class="bottom-bar-pinyin">{{ block.pinyin }}</span>

      <!-- <md-button
        class="md-icon-button md-primary"
        @click.native="loadDictionary(block)"
      >
        <md-icon>find_in_page</md-icon>
      </md-button> -->

      <v-btn
        icon="mdi-file-find"
        variant="text"
        color="primary"
        @click.native="loadDictionary(block)"
      ></v-btn>

      <v-btn icon="mdi-dots-vertical" variant="text" color="primary"></v-btn>

      <!-- <menu-content position="top">
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
      </menu-content> -->
      <!-- <Links list="0" :character="block.character" ref="links" /> -->
    </div>

    <dictionary-modal ref="dictionaryModal" @change-show="changeShow" />

    <!-- <md-dialog
      ref="dialogSeparate"
      :md-active.sync="modalSeparateOpen"
      :md-fullscreen="false"
    >
      <md-dialog-title>
        <ideograms-show :pinyin="block.pinyin" :character="block.character" />
        - {{ block.pinyin }}
      </md-dialog-title>

      <md-dialog-content>
        <div class="field-container">
          <input type="text" v-model="separateCharacter" />
        </div>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click.native="confirmSeparate"
          >OK</md-button
        >
      </md-dialog-actions>
    </md-dialog>

    <md-dialog
      ref="dialogEdit"
      :md-active.sync="modalEditOpen"
      :md-fullscreen="false"
    >
      <md-dialog-title>
        <ideograms-show :pinyin="block.pinyin" :character="block.character" />
        - {{ block.pinyin }}
      </md-dialog-title>

      <md-dialog-content>
        <div class="field-container">
          <input type="text" v-model="editPinyin" />
        </div>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click.native="confirmEdit">OK</md-button>
      </md-dialog-actions>
    </md-dialog> -->
  </div>
</template>

<script lang="ts">
import http from "@/helpers/http";
import IdeogramsShow from "@/components/ideograms/Show.vue";
import Links from "@/components/ideograms/Links.vue";
import OptionsManager from "@/domain/options-manager";
import separatePinyinInSyllables from "@/helpers/separate-pinyin-in-syllables";
import replaceall from "replaceall";
import pinyinHelper from "@/helpers/pinyin";
import isMobile from "@/helpers/is-mobile";
import DictionaryModal from "@/components/modals/Dictionary.vue";
import MenuContent from "@/components/common/MenuContent.vue";
import { mapActions, mapMutations, mapGetters } from "vuex";

import {
  FILE_ACTION_JOIN_LEFT,
  FILE_ACTION_SEPARATE,
  FILE_MUTATION_SET_MY_CJK_TEMP,
  FILE_MUTATION_UPDATE_PINYIN,
  FILE_GETTER_MY_CJK,
} from "@/data/file/types";

export default {
  name: "file-bottom-bar",
  data() {
    return {
      editPinyin: "",
      separateCharacter: "",
      show: false,
      tempDictCharacter: null,
      block: {},
      printData: {},
      modalSeparateOpen: false,
      modalEditOpen: false,
      isMobile: isMobile(),
    };
  },
  components: {
    IdeogramsShow,
    Links,
    DictionaryModal,
    MenuContent,
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
      const action = show ? "remove" : "add";
      document.body.classList[action]("has-bottom-bar");
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
        this.$emit("reopen", this.block.lineIndex, this.block.blockIndex);
      }, 1000);
    },

    async joinLeft(block) {
      await this.joinLeftAction(block);
      setTimeout(() => {
        this.$emit("reopen", this.block.lineIndex, this.block.blockIndex - 1);
      }, 1000);
    },

    edit() {
      this.editPinyin = this.block.pinyin;
      this.modalEditOpen = true;
    },

    confirmEdit() {
      this.updatePinyin({ ...this.block, pinyin: this.editPinyin });
      this.modalEditOpen = false;
      this.$emit("reopen", this.block.lineIndex, this.block.blockIndex);
    },

    changeEditPinyin(pinyin) {
      this.editPinyin = pinyinHelper(pinyin);
    },

    close() {
      document.body.classList.remove("has-bottom-bar");
      this.show = false;
    },

    open(block) {
      document.body.classList.add("has-bottom-bar");
      this.show = true;

      if (this.isMobile && this.tempDictCharacter === block.character) {
        block.openDictionary = true;
      }

      this.block = block;
      block.originalPinyin = block.pinyin;
      block.pinyin = replaceall(
        String.fromCharCode(160),
        "",
        block.pinyin || ""
      );

      this.$refs.dictionaryModal.requestDictionary(
        block.character,
        block.pinyin
      );

      this.tempDictCharacter = block.character;
      const pinyin = separatePinyinInSyllables(block.pinyin);

      // clean the selection in 2 seconds
      setTimeout(() => {
        this.tempDictCharacter = null;
      }, 2000);

      if (block.openDictionary) {
        this.loadDictionary(block);
      }

      const chars = block.character.toString();
      const printData = [];
      const optionsManager = new OptionsManager(this.$i18n);
      const options = optionsManager.getOptions();
      for (let i = 0; i < chars.length; i += 1) {
        let characterLink = chars[i];
        if (options.pinyinHide === "2") {
          characterLink = chars;
        }

        let pinyinSeparated = "";
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

      if (this.$refs["ideogram-show"]) {
        this.$nextTick(() => {
          for (const ideogramShow of this.$refs["ideogram-show"]) {
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
      this.$emit("open-modal", add);
    },

    async loadDictionary(block) {
      this.$refs.dictionaryModal.open(block);
    },

    openPinyinList() {
      http
        .post("unihan/to_pinyin_all", {
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
      console.log("Opened");
    },

    onClose(type) {
      // eslint-disable-next-line
      console.log("Closed", type);
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

.bottom-bar .ideogram-link {
  cursor: pointer;
}

.bottom-bar .md-button {
  min-width: auto;
}
</style>
