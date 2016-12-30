<template>
  <!--div class="modal fade" tabindex="-1" role="dialog" id="newFileModal">
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
  </div-->
  <div>
    <md-button class="md-fab md-fab-bottom-left md-mini" @click="openDialog('newFileModal')">
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
    created() {
      /*
      $(document).ready(() => {
        $('#newFileModal').on('shown.bs.modal', () => {

        });
      });
      */
    },
    methods: {
      confirm() {
        // $('#newFileModal').modal('hide');
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
