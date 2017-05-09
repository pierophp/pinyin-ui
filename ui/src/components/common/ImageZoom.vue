<template>
  <div class="image-zoom">
    <md-dialog ref="modal">
      <md-dialog-title>
        <div class="top-actions">

        </div>
      </md-dialog-title>

      <md-dialog-content>
        <img :src="src" class="img-zoom" referrerpolicy="no-referrer"/>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click.native="closeDialog()">{{ $t('cancel') }}</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  export default {
    name: 'image-zoom',
    props: {
      src: '',
    },
    mounted() {
      // this.openDialog();
    },
    methods: {
      confirm() {
        this.closeDialog('imageZoomModal');
      },
      openDialog() {
        this.$refs.modal.open();
      },
      closeDialog() {
        this.$refs.modal.close();
      },
    },
  };
</script>

<style>
.top-actions{
  width: 100%;
  height: 40px;
  background-color: #777;
}

/*
.img-zoom:hover {
  transform: scale(3);
}
*/
</style>
