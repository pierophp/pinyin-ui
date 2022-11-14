<template>
  <v-dialog v-model="modalOpen" width="500">
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>{{
        $t("import_site")
      }}</v-card-title>

      <v-card-text>
        <div class="field-container">
          <label>{{ $t("url") }}</label>
          <input type="text" ref="inputUrl" v-model="siteUrl" />
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click="closeDialog()">{{ $t("cancel") }}</v-btn>
        <v-btn flat color="primary" @click="confirm()">{{
          $t("import")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from "vuex";

import { FILE_ACTION_IMPORT_FILE } from "@/data/file/types";

export default {
  name: "modal-import-site",
  data() {
    return {
      siteUrl: "",
      modalOpen: false,
    };
  },
  props: {
    filename: "",
  },
  methods: {
    confirm() {
      this.closeDialog();
      this.importFile({
        content: this.siteUrl,
        filename: this.filename,
      });
      this.siteUrl = "";
    },
    onOpen() {
      setTimeout(() => {
        this.$refs.inputUrl.focus();
      }, 500);
    },
    openDialog() {
      this.modalOpen = true;
      this.onOpen();
    },
    closeDialog() {
      this.modalOpen = false;
    },
    ...mapActions({
      importFile: FILE_ACTION_IMPORT_FILE,
    }),
  },
};
</script>

<style scoped>
input[type="text"] {
  width: 100%;
}
</style>
