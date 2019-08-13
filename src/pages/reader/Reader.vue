<template>
  <div class="reader-container">
    <portal to="portal-file-container-header">
      <div class="textareaContainer">
        <textarea v-model="reader" autofocus />
      </div>
      <md-button class="md-primary" @click.native="clear()">{{ $t('clear') }}</md-button>
    </portal>
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
import http from 'src/helpers/http';

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
    async reader() {
      this.fileLoading = true;
      const rows = await clipboard04(this.reader);

      this.lines = [];
      this.fullLines = [];

      const lines = [];
      const ideograms = [];
      for (const row of rows) {
        row.forEach(block => {
          ideograms.push(block.c);
        });

        const response = await http.post('unihan/to_pinyin', {
          ideograms,
        });

        lines.push(
          response.data.map(item => {
            return {
              c: item.ideogram,
              p: separatePinyinInSyllables(item.pinyin).join(
                String.fromCharCode(160),
              ),
            };
          }),
        );
      }

      this.lines = lines;
      this.fullLines = lines;

      this.fileLoading = false;
    },
  },
  methods: {
    clear() {
      this.reader = '';
      this.lines = [];
      this.fullLines = [];
    },
  },
};
</script>
<style scoped>
.reader-container {
  display: flex;
  flex: 1;
}

.textareaContainer {
  display: block;
  width: 100%;
  margin: 5px 0;
  padding: 3px;
}

textarea {
  width: 100%;
  height: 100px;
}
</style>