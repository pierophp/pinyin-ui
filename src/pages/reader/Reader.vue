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
      for (const row of rows) {
        const ideograms = [];
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
  height: 110px;
}

textarea {
  width: 100%;
  height: 100px;
}
</style>