<template>
  <div class="modal fade" tabindex="-1" role="dialog" id="filePasteModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title">Paste</h4>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Action</label>
            <select class="form-control" v-model="action">
              <option value="1">Multi NWT (pinyin + space + ideogram)</option>
              <option value="2">2 lines</option>
              <option value="3">JW.ORG</option>
            </select>
          </div>
          <div class="form-group">
            <textarea class="form-control" v-model="textarea"></textarea>
          </div>
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
    FILE_ACTION_PARSE_PASTE,
  } from 'src/data/file/types';

  export default {
    name: 'modal-file-paste',
    data() {
      return {
        action: '3',
        textarea: '',
      };
    },
    created() {
      $(document).ready(() => {
        $('#filePasteModal').on('shown.bs.modal', () => {
          $('#filePasteModal textarea').focus();
        });
      });
    },
    methods: {
      confirm() {
        $('#filePasteModal').modal('hide');
        this.parsePaste({
          action: this.action,
          content: this.textarea,
        });
        this.textarea = '';
      },
      ...mapActions({
        parsePaste: FILE_ACTION_PARSE_PASTE,
      }),
    },
  };
</script>
