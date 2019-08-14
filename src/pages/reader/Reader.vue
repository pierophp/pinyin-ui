<template>
  <div class="reader-container">
    <portal to="portal-file-container-header">
      <div class="textareaContainer">
        <md-field md-clearable>
          <label>{{ $t('text') }}</label>
          <md-textarea v-model="reader" autofocus />
        </md-field>
      </div>
    </portal>
    <file-container
      ref="fileContainer"
      :lines="lines"
      :fullLines="fullLines"
      filename
      :fileLoading="fileLoading"
      :parent="true"
      :portal="true"
      :showHighlight="false"
    />
  </div>
</template>

<script>
import separatePinyinInSyllables from 'src/helpers/separate-pinyin-in-syllables';
import http from 'src/helpers/http';
import bluebird from 'bluebird';

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

      this.lines = [];
      this.fullLines = [];

      const readerLines = this.reader.split('\n').filter(item => item);
      const lines = await bluebird.map(
        readerLines,
        async line => {
          line = line.replace(/\s{2,}/g, ' ').trim();
          if (!line) {
            return;
          }

          const response = await http.post('segmentation/segment', {
            ideograms: line,
          });

          const row = [];
          response.data.ideograms.forEach(char => {
            row.push({
              p: '',
              c: char,
            });
          });

          const ideograms = [];
          row.forEach(block => {
            ideograms.push(block.c);
          });

          const pinyinResponse = await http.post('unihan/to_pinyin', {
            ideograms,
          });

          return pinyinResponse.data.map(item => {
            return {
              c: item.ideogram,
              p: separatePinyinInSyllables(item.pinyin).join(
                String.fromCharCode(160),
              ),
            };
          });
        },
        { concurrency: 10 },
      );

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
  height: 110px;
}

textarea {
  width: 100%;
  height: 100px;
}
</style>