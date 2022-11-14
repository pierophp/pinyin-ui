<template>
  <div>
    <md-button class="md-fab md-fab-bottom-right" @click.native="openDialog()">
      <md-icon>add</md-icon>
    </md-button>

    <md-dialog
      md-open-from="#newFileModal"
      md-close-to="#newFileModal"
      ref="modal"
      @md-opened="onOpen"
      :md-active.sync="modalOpen"
      :md-fullscreen="false"
    >
      <md-dialog-title>{{ $t("new") }}</md-dialog-title>

      <md-dialog-content>
        <div class="field-container">
          <label>{{ $t("type") }}</label>
          <select
            v-model="type"
            name="type"
            id="select-type"
            class="select-field"
          >
            <option value="file">{{ $t("file") }}</option>
            <option value="dir">{{ $t("folder") }}</option>
          </select>
        </div>

        <div class="field-container new-file-input-container">
          <label for="name">{{ $t("name") }}</label>
          <input
            type="text"
            :placeholder="$t('name')"
            id="name"
            v-model="filename"
            ref="inputFilename"
          />
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
    </md-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";

import { FILE_ACTION_NEW_FILE } from "@/data/file/types";

export default {
  name: "modal-new-file",
  data() {
    return {
      type: "file",
      filename: "",
      modalOpen: false,
    };
  },
  watch: {
    type() {
      setTimeout(() => {
        if (!this.$refs.inputFilename) {
          return;
        }

        this.$refs.inputFilename.focus();
      }, 200);
    },
  },
  methods: {
    confirm() {
      this.closeDialog("newFileModal");
      this.$nextTick(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.newFile({
              filename: this.filename,
              type: this.type,
              dirname: this.$route.query.d ? this.$route.query.d : "/",
            });
            this.filename = "";
          });
        });
      });
    },
    openDialog() {
      this.modalOpen = true;
    },
    closeDialog() {
      this.modalOpen = false;
    },
    onOpen() {
      setTimeout(() => {
        this.$refs.inputFilename.focus();
      }, 100);
    },
    ...mapActions({
      newFile: FILE_ACTION_NEW_FILE,
    }),
  },
};
</script>

<style>
.new-file-input-container input {
  width: 100%;
}
</style>
