<template>
  <div>
    <md-dialog ref="modal">
      <md-dialog-title>
      </md-dialog-title>

      <md-dialog-content>
        <div class="">
          <file-row-print
                :line="line"
                :lineIndex="lineIndex"
                v-if="lineIndex"/>
        </div>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click.native="closeDialog()">{{ $t('close') }}</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  import FileRowPrint from 'src/components/files/FileRowPrint';

  export default {
    name: 'modal-footnote',
    props: {
      line: '',
      lineIndex: '',
    },
    components: {
      FileRowPrint,
    },
    methods: {
      openDialog() {
        this.$refs.modal.open();
      },
      closeDialog() {
        this.$refs.modal.close();
      },
    },
  };
</script>
