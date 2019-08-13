<template>
  <div>
    <form>
      <textarea v-model="reader" />
    </form>
    <file-container
      ref="fileContainer"
      :lines="lines"
      :fullLines="fullLines"
      filename
      :fileLoading="fileLoading"
      :parent="true"
      :showHighlight="false"
    />
  </div>
</template>

<script>
import clipboardUrl from 'src/domain/clipboard-url';
import separatePinyinInSyllables from 'src/helpers/separate-pinyin-in-syllables';
import clipboard04 from 'src/domain/clipboard-04';
import { mapGetters } from 'vuex';

export default {
  name: 'reader',

  data() {
    return {
      fileLoading: false,
      reader: '',
      lines: [],
      fullLines: [],
    };
  },

  watch: {
    reader() {
      console.log('Reader changed');
      clipboard04(this.reader);
    },
  },

  methods: {
    async loadUrl(url) {
      this.fullLines = [];
      this.lines = [];

      if (!url) {
        this.fileLoading = false;
        return;
      }

      this.fileLoading = true;
      const lines = await clipboardUrl(url);
      for (const line of lines) {
        for (const block of line) {
          const pinyinList = separatePinyinInSyllables(block.p);
          block.p = pinyinList.join(String.fromCharCode(160));
        }
      }

      this.fullLines = lines;
      this.lines = lines;

      this.fileLoading = false;
    },
  },
  mounted() {
    if (this.url) {
      this.loadUrl(this.url);
    }
  },
};
</script>
