<template>
  <div>
    <v-btn icon @click.native="editionMode">
      <v-icon color="#fff">create</v-icon>
    </v-btn>
    <v-btn icon @click.native="copy">
      <v-icon color="#fff">content_copy</v-icon>
    </v-btn>
    <v-btn icon @click.native="print">
      <v-icon color="#fff">print</v-icon>
    </v-btn>

    <portal to="portal-menu">
      <v-snackbar
        v-model="clipboardOpen"
        :timeout="1300"
        :absolute="true"
        :bottom="true"
      >{{ $t('copied_to_clipboard') }}</v-snackbar>
    </portal>
  </div>
</template>
<script>
import { FILE_GETTER_FULL_FILE } from 'src/data/file/types';
import { mapGetters } from 'vuex';
import replaceall from 'replaceall';

export default {
  data() {
    return { clipboardOpen: false };
  },
  methods: {
    ...mapGetters({
      getFullLines: FILE_GETTER_FULL_FILE,
    }),
    editionMode() {
      this.$router.push({
        name: 'file',
        params: { filename: this.$route.params.filename },
        query: { d: this.$route.query.d },
      });
    },
    print() {
      window.print();
    },
    copy() {
      const fileCopy = [];
      const lines = this.getFullLines();
      for (const line of lines) {
        let pinyinLine = '';
        let ideogramLine = '';
        for (const block of line) {
          if (block.small) {
            continue;
          }

          pinyinLine += `${replaceall(String.fromCharCode(160), '', block.p)} `;
          ideogramLine += `${block.c} `;
        }

        if (!ideogramLine) {
          continue;
        }

        fileCopy.push(pinyinLine);
        fileCopy.push(ideogramLine);
        fileCopy.push('');
      }

      this.$clipboard(fileCopy.join('\n'));
      this.clipboardOpen = true;
    },
  },
};
</script>
