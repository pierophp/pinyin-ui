<template>
    <md-dialog md-open-from="#newFileModal" md-close-to="#deleteModal" ref="modal">
      <md-dialog-title>Delete File</md-dialog-title>

      <md-dialog-content>
        Are you sure to delete this file?
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="closeDialog()">Cancel</md-button>
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
    FILE_ACTION_DELETE_FILE,
  } from 'src/data/file/types';

  export default {
    name: 'modal-delete-file',
    props: {
      filename: '',
    },
    methods: {
      confirm() {
        this.closeDialog('deleteModal');
        this.deleteFile({
          filename: this.filename,
        });
      },
      openDialog() {
        this.$refs.modal.open();
      },
      closeDialog() {
        this.$refs.modal.close();
      },
      ...mapActions({
        deleteFile: FILE_ACTION_DELETE_FILE,
      }),
    },
  };
</script>
