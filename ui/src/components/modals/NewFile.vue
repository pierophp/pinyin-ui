<template>
  <div class="modal fade" tabindex="-1" role="dialog" id="newFileModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title">New File</h4>
        </div>
        <div class="modal-body">
          <input type="text" class="form-control" v-model="filename"/>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary" @click.prevent="confirm">OK</button>
        </div>
      </div>
    </div>
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
    created() {
      $(document).ready(() => {
        $('#newFileModal').on('shown.bs.modal', () => {
          $('#newFileModal input[type=text]').focus();
        });
      });
    },
    methods: {
      confirm() {
        $('#newFileModal').modal('hide');
        this.newFile({
          filename: this.filename,
        });
        this.filename = '';
      },
      ...mapActions({
        newFile: FILE_ACTION_NEW_FILE,
      }),
    },
  };
</script>
