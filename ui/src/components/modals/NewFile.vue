<template>
  <div>
    <md-button class="md-fab md-fab-bottom-left" @click="openDialog('newFileModal')">
      <md-icon>add</md-icon>
    </md-button>

    <md-dialog md-open-from="#newFileModal" md-close-to="#newFileModal" ref="newFileModal" @open="onOpen">
      <md-dialog-title>New File</md-dialog-title>

      <md-dialog-content>
         <md-input-container>
          <label>Filename</label>
          <md-input placeholder="Filename" v-model="filename" ref="inputFilename"></md-input>
        </md-input-container>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="closeDialog('newFileModal')">Cancel</md-button>
        <md-button class="md-primary" @click.prevent="confirm">Ok</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  import {
      mapActions,
    } from 'vuex';

  import {
    FILE_ACTION_NEW_FILE,
  } from 'src/data/file/types';

  export default {
    name: 'modal-new-file',
    data() {
      return {
        filename: '',
      };
    },
    methods: {
      confirm() {
        this.closeDialog('newFileModal');
        this.newFile({
          filename: this.filename,
        });
        this.filename = '';
      },
      openDialog(ref) {
        this.$refs[ref].open();
      },
      closeDialog(ref) {
        this.$refs[ref].close();
      },
      onOpen() {
        setTimeout(() => {
          this.$refs.inputFilename.$el.focus();
        }, 10);
      },
      ...mapActions({
        newFile: FILE_ACTION_NEW_FILE,
      }),
    },
  };
</script>
