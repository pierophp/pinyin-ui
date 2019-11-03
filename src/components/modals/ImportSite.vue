<template>
  <md-dialog ref="modal" :md-active.sync="modalOpen" :md-fullscreen="false">
    <md-dialog-title>{{ $t('import_site') }}</md-dialog-title>

    <md-dialog-content>
      <div class="field-container">
        <label>{{ $t("url") }}</label>
        <input type="text" ref="inputUrl" v-model="siteUrl" />
      </div>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary" @click.native="closeDialog()">{{ $t('cancel') }}</md-button>
      <md-button class="md-primary" @click.native.prevent="confirm">{{ $t('import') }}</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import { mapActions } from 'vuex';

import { FILE_ACTION_IMPORT_FILE } from 'src/data/file/types';

function isIos() {
  if (verificationIos === null) {
    verificationIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  return verificationIos;
}

export default {
  name: 'modal-import-site',
  data() {
    return {
      siteUrl: '',
      modalOpen: false,
    };
  },
  props: {
    filename: '',
  },
  methods: {
    confirm() {
      this.closeDialog();
      this.importFile({
        content: this.siteUrl,
        filename: this.filename,
      });
      this.siteUrl = '';
    },
    onOpen() {
      if (isIos()) {
        return;
      }

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
input[type='text'] {
  width: 100%;
}
</style>
