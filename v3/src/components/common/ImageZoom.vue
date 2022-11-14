<template>
  <!-- <md-dialog
    ref="modal"
    id="image-zoom-modal"
    :md-active.sync="modalOpen"
    :md-fullscreen="false"
  >
    <md-dialog-title>
      <div class="top-actions"></div>
    </md-dialog-title>

    <md-dialog-content>
      <vue-pinch-zoom :src="src" :min-zoom="1" :max-zoom="2.5" />
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary" @click.native="closeDialog()">{{
        $t("close")
      }}</md-button>
    </md-dialog-actions>
  </md-dialog> -->
</template>

<script>
import VuePinchZoom from "@/components/common/VuePinchZoom";
export default {
  name: "image-zoom",
  props: {
    src: "",
  },
  components: { VuePinchZoom },
  data() {
    return {
      modalOpen: false,
    };
  },
  methods: {
    confirm() {
      this.modalOpen = false;
    },
    openDialog() {
      this.modalOpen = true;
    },
    closeDialog() {
      this.modalOpen = false;
    },
  },
};
</script>

<style>
.top-actions {
  width: 100%;
  height: 40px;
  background-color: #777;
}

#image-zoom-modal.md-dialog {
  min-width: 95%;
  max-width: 95%;
  max-height: 95%;
}

#image-zoom-modal .md-dialog-title {
  padding: 0;
  margin-bottom: 0;
}

#image-zoom-modal .md-dialog-content {
  padding: 0;
  margin-bottom: 0;
}
/*
.img-zoom:hover {
  transform: scale(3);
}
*/
</style>
