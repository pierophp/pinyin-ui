<template>
  <div class="modal fade" tabindex="-1" role="dialog" id="addCharacterModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title">Add Character</h4>
        </div>
        <div class="modal-body">
          Would you like to add "{{myCjkTemp}}" to your known list?
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
      mapGetters,
      mapActions,
    } from 'vuex';

  import {
    FILE_ACTION_ADD_MY_CJK,
    FILE_GETTER_MY_CJK_TEMP,
  } from 'src/data/file/types';

  export default {
    name: 'modal-add-character',
    computed: {
      ...mapGetters({
        myCjkTemp: FILE_GETTER_MY_CJK_TEMP,
      }),
    },
    methods: {
      confirm() {
        $('#addCharacterModal').modal('hide');
        this.addMyCjk({
          myCjk: this.myCjkTemp,
        });
      },
      ...mapActions({
        addMyCjk: FILE_ACTION_ADD_MY_CJK,
      }),
    },
  };
</script>
