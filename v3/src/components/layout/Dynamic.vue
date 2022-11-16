<template>
  <div :class="['top-bar-container']">
    <dictionary-top-bar v-if="topBar == 'dictionary'" />
    <video-top-bar v-if="topBar == 'videos'" />
    <file-details-top-bar v-if="topBar == 'file-details'" />
    <file-print-top-bar v-if="topBar == 'file-print'" />
    <bible-books-top-bar v-if="topBar == 'bible-books'" />
    <bible-chapters-top-bar v-if="topBar == 'bible-chapters'" />
    <bible-chapter-top-bar v-if="topBar == 'bible-chapter'" />
    <bible-save-top-bar v-if="topBar == 'bible-save'" />
    <browser-top-bar v-if="topBar == 'browser'" />
  </div>
</template>

<script lang="ts">
/**
 * @todo change that
 */
import DictionaryTopBar from "@/components/dictionary/top-bar/Dictionary.vue";
import VideoTopBar from "@/components/video/top-bar/Video.vue";
import FileDetailsTopBar from "@/components/files/top-bar/FileDetails.vue";
import FilePrintTopBar from "@/components/files/top-bar/FilePrint.vue";
import BibleBooksTopBar from "@/components/bible/top-bar/Books.vue";
import BibleChaptersTopBar from "@/components/bible/top-bar/Chapters.vue";
import BibleChapterTopBar from "@/components/bible/top-bar/Chapter.vue";
import BibleSaveTopBar from "@/components/bible/top-bar/Save.vue";
import BrowserTopBar from "@/components/browser/top-bar/Browser.vue";

export default {
  components: {
    DictionaryTopBar,
    VideoTopBar,
    FileDetailsTopBar,
    FilePrintTopBar,
    BibleBooksTopBar,
    BibleChaptersTopBar,
    BibleChapterTopBar,
    BibleSaveTopBar,
    BrowserTopBar,
  },
  watch: {
    $route() {
      this.topBar = this.$route.meta.topBar;
    },
  },
  data() {
    return {
      topBar: this.$route.meta.topBar,
    };
  },
};
</script>

<style>
.top-bar-container {
  width: calc(100% - 46px);
}
</style>
