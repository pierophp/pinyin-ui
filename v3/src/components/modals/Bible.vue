<template>
  <!-- <md-dialog
    ref="modal"
    class="dialog-bible"
    :md-active.sync="modalOpen"
    :md-fullscreen="false"
    :md-backdrop="true"
  >
    <md-dialog-content>
      <chapter-container
        v-if="book"
        :book="book"
        :chapter="chapter"
        :verse="verse"
        @open-bottom-bar="openBottomBar"
      />
    </md-dialog-content>

    <md-dialog-actions>
      <span class="bible-title"
        >{{ booksName(book, exhibitionType) }} {{ chapter }}:{{ verse }}</span
      >
      <md-button class="md-primary" @click.native="closeDialog()">{{
        $t("close")
      }}</md-button>
    </md-dialog-actions>
  </md-dialog> -->
</template>

<script lang="ts">
// @ts-nocheck
import chaptersData from "@/data/bible/chapters";
import ChapterContainer from "@/components/bible/ChapterContainer.vue";
import booksName from "@/data/bible/names";
import OptionsManager from "@/domain/options-manager";

export default {
  name: "modal-bible",
  data() {
    return {
      options: {},
      modalOpen: false,
    };
  },
  props: {
    bookIndex: 0,
    chapter: 0,
    verse: 0,
  },
  computed: {
    exhibitionType() {
      return `cmn-han${this.options.ideogramType}`;
    },
    book() {
      const key = this.bookIndex - 1;
      if (key < 0) {
        return "";
      }

      return Object.keys(chaptersData)[key];
    },
  },
  components: {
    // ChapterContainer,
  },
  created() {
    const optionsManager = new OptionsManager(this.$i18n);
    this.options = optionsManager.getOptions();
  },
  methods: {
    booksName,
    openBottomBar(data) {
      this.$emit("open-bottom-bar", data);
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
.dialog-bible {
  max-width: 90% !important;
  min-width: 90% !important;
  max-height: 80% !important;
}

.dialog-bible .md-dialog-title {
  margin: 0;
  padding: 15px 15px 0;
}

.dialog-bible .md-dialog-content {
  padding: 2px;
}

.dialog-bible .md-dialog-actions {
  min-height: 42px;
  justify-content: space-between;
}

.dialog-bible .bible-title {
  font-size: 19px;
  color: #000 !important;
}
</style>
