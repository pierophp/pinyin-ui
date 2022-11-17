<template>
  <div>
    <!-- <md-dialog ref="dialogKnownWords" :md-active.sync="this.active">
      <md-dialog-title>
        {{ $t(action) }}
        <span v-if="type === 'words' && hsk !== 999">- HSK {{ hsk }}</span>
        <span v-if="type === 'ideograms' && frequency !== 999"
          >- {{ $t("frequency") }} {{ frequency }}</span
        >
      </md-dialog-title>
      <md-dialog-content>
        <table class="spaced-table">
          <thead>
            <tr>
              <th>{{ $t("ideogram") }}</th>
              <th>{{ $t("pronunciation") }}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in renderItems"
              :key="item.ideogram + item.pronunciation"
            >
              <td class="ideogram">
                <ideograms-show
                  :pinyin="item.pronunciation"
                  :character="item.ideogram"
                />
              </td>
              <td>{{ item.pronunciation }}</td>

              <td v-if="action === 'unknown'" class="cell-button">
                <md-button
                  v-if="options.type !== '4'"
                  class="md-icon-button md-raised"
                  @click.native="openModal(true, item.ideogram, index)"
                >
                  <md-icon>add</md-icon>
                </md-button>
                <md-button
                  v-if="options.type === '4'"
                  class="md-icon-button md-raised"
                  @click.native="openModal(false, item.ideogram, index)"
                >
                  <md-icon>remove</md-icon>
                </md-button>
              </td>

              <td v-if="action === 'known'" class="cell-button">
                <md-button
                  v-if="options.type !== '4'"
                  class="md-icon-button md-raised"
                  @click.native="openModal(false, item.ideogram, index)"
                >
                  <md-icon>remove</md-icon>
                </md-button>
                <md-button
                  v-if="options.type === '4'"
                  class="md-icon-button md-raised"
                  @click.native="openModal(true, item.ideogram, index)"
                >
                  <md-icon>add</md-icon>
                </md-button>
              </td>
            </tr>
          </tbody>
        </table>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click.native="closeDialog()"
          >OK</md-button
        >
      </md-dialog-actions>
    </md-dialog> -->

    <add-remove-character-modal
      @add-character="addRemoveCharacter"
      @remove-character="addRemoveCharacter"
      ref="addRemoveCharacterModal"
    />
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import OptionsManager from "@/domain/options-manager";
import IdeogramsShow from "@/components/ideograms/Show.vue";
import AddRemoveCharacterModal from "@/components/modals/AddRemoveCharacter.vue";

import { mapMutations } from "vuex";

import { FILE_MUTATION_SET_MY_CJK_TEMP } from "@/data/file/types";

const optionsManager = new OptionsManager(undefined);
const options = optionsManager.getOptions();

export default {
  name: "modal-my-cjk",
  data() {
    return {
      options,
      selectedCharacter: null,
    };
  },
  props: {
    active: { type: String },
    type: { type: String },
    action: { type: String },
    hsk: { type: String },
    frequency: { type: String },
    items: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    IdeogramsShow,
    AddRemoveCharacterModal,
  },
  watch: {
    active() {
      this.forceUpdate();
    },
  },
  methods: {
    ...mapMutations({
      setMyCjkTemp: FILE_MUTATION_SET_MY_CJK_TEMP,
    }),

    forceUpdate() {
      this.renderItems = this.items;
      this.$forceUpdate();
    },

    closeDialog() {
      this.$emit("close", true);
    },
    openModal(add, cjk, selectedCharacter) {
      this.selectedCharacter = selectedCharacter;
      this.setMyCjkTemp(cjk);
      this.$refs.addRemoveCharacterModal.openDialog(add);
    },

    addRemoveCharacter() {
      this.$emit("change", this.selectedCharacter);
      setTimeout(() => {
        this.forceUpdate();
      }, 100);
    },
  },
};
</script>
