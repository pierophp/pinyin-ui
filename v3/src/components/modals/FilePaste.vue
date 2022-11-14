<template>
  <!-- <md-dialog
    md-open-from="#filePasteModal"
    md-close-to="#filePasteModal"
    ref="modal"
    @open="onOpen"
    :md-active.sync="modalOpen"
    :md-fullscreen="true"
  >
    <md-dialog-title>{{ $t("paste") }}</md-dialog-title>

    <md-dialog-content>
      <div class="field-container">
        <label for="action">{{ $t("action") }}</label>
        <select v-model="action" name="action" class="select-field">
          <option value="4">{{ $t("paste_action.ideograms") }}</option>
          <option value="3">{{ $t("paste_action.ideograms_spaced") }}</option>
        </select>
      </div>

      <div class="field-container">
        <label for="action">{{ $t("paste") }}</label>
        <textarea v-model="textarea" ref="textarea"></textarea>
      </div>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary" @click.native="closeDialog()">{{
        $t("cancel")
      }}</md-button>
      <md-button class="md-primary" @click.native.prevent="confirm">{{
        $t("ok")
      }}</md-button>
    </md-dialog-actions>
  </md-dialog> -->
</template>

<script>
import { mapActions } from "vuex";

import { FILE_ACTION_PARSE_PASTE } from "@/data/file/types";

export default {
  name: "modal-file-paste",
  data() {
    return {
      action: "4",
      textarea: "",
      modalOpen: false,
    };
  },
  methods: {
    confirm() {
      this.closeDialog("filePasteModal");
      this.parsePaste({
        action: this.action,
        content: this.textarea,
      });
      this.textarea = "";
    },
    openDialog() {
      this.modalOpen = true;
    },
    closeDialog() {
      this.modalOpen = false;
    },
    onOpen() {
      setTimeout(() => {
        this.$refs.textareas.focus();
      }, 500);
    },
    ...mapActions({
      parsePaste: FILE_ACTION_PARSE_PASTE,
    }),
  },
};
</script>

<style>
.md-dialog-content textarea {
  width: 500px;
  min-height: 350px;
  max-height: auto;
}
</style>
