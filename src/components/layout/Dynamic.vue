<template>
  <div :class="[topBarClass, 'top-bar-container']">
    <dictionary-top-bar v-if="topBar == 'dictionary'"/>
    <video-top-bar v-if="topBar == 'videos'"/>
    <file-details-top-bar v-if="topBar == 'file-details'"/>
    <file-print-top-bar v-if="topBar == 'file-print'"/>
    <bible-books-top-bar v-if="topBar == 'bible-books'"/>
    <bible-chapters-top-bar v-if="topBar == 'bible-chapters'"/>
    <bible-chapter-top-bar v-if="topBar == 'bible-chapter'"/>
    <bible-save-top-bar v-if="topBar == 'bible-save'"/>
    <browser-top-bar v-if="topBar == 'browser'"/>
  </div>
</template>

<script>
import DictionaryTopBar from 'src/components/dictionary/top-bar/Dictionary';
import VideoTopBar from 'src/components/video/top-bar/Video';
import FileDetailsTopBar from 'src/components/files/top-bar/FileDetails';
import FilePrintTopBar from 'src/components/files/top-bar/FilePrint';
import BibleBooksTopBar from 'src/components/bible/top-bar/Books';
import BibleChaptersTopBar from 'src/components/bible/top-bar/Chapters';
import BibleChapterTopBar from 'src/components/bible/top-bar/Chapter';
import BibleSaveTopBar from 'src/components/bible/top-bar/Save';
import BrowserTopBar from 'src/components/browser/top-bar/Browser';

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
      this.topBarClass = 'md-toolbar-section-end';
      if (this.$route.meta.topBarLeft) {
        this.topBarClass = '';
      }
    },
  },
  data() {
    let topBarClass = 'md-toolbar-section-end';
    if (this.$route.meta.topBarLeft) {
      topBarClass = '';
    }

    return {
      topBarClass,
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
