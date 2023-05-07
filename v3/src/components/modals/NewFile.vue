<template>
  <v-btn
    @click.native="openDialog()"
    color="secondary"
    class="pn-floating-action-button"
    icon="mdi-plus"
  >
  </v-btn>

  <v-dialog v-model="this.modalOpen" width="auto">
    <v-card>
      <v-toolbar color="primary" :title="$t('new')"></v-toolbar>
      <v-card-text>
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
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click.native="closeDialog()">{{
          $t("cancel")
        }}</v-btn>

        <v-btn color="primary" @click.native.prevent="confirm">{{
          $t("ok")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
// @ts-nocheck
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
    modalOpen() {
      if (this.modalOpen) {
        this.onOpen();
      }
    },
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
