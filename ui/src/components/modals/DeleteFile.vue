<template>
  <md-dialog md-open-from="#deleteModal" md-close-to="#deleteModal" ref="modal">
    <md-dialog-title>{{ $t('delete_file') }}</md-dialog-title>

    <md-dialog-content>
      {{ $t('sure_delete_file') }}
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary" @click.native="closeDialog()">{{ $t('cancel') }}</md-button>
      <md-button class="md-primary" @click.native.prevent="confirm">{{ $t('delete') }}</md-button>
    </md-dialog-actions>
  </md-dialog>
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
