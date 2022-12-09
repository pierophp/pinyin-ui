<template>
  <file-container-quiz
    ref="fileContainer"
    :lines="lines"
    :fullLines="fullLines"
    :filename="filename"
    :fileLoading="fileLoading"
    :parent="true"
  />
</template>

<script lang="ts">
// @ts-nocheck
import { mapActions, mapGetters } from "vuex";
import FileContainerQuiz from "src/components/files/FileContainerQuiz";

import {
  FILE_ACTION_FETCH,
  FILE_ACTION_CLEAR,
  FILE_GETTER,
  FILE_GETTER_LOADING,
  FILE_GETTER_FULL_FILE,
} from "src/data/file/types";

export default {
  name: "file-quiz",

  data() {
    return {
      filename: "",
    };
  },
  components: {
    FileContainerQuiz,
  },
  watch: {
    $route() {
      if (this.$route.params.filename) {
        this.getFile(`${this.$route.query.d}/${this.$route.params.filename}`);
      }
    },
  },

  computed: {
    ...mapGetters({
      lines: FILE_GETTER,
      fullLines: FILE_GETTER_FULL_FILE,
      fileLoading: FILE_GETTER_LOADING,
    }),
  },
  mounted() {
    this.filename = this.$route.params.filename;
    if (this.filename) {
      this.getFile(`${this.$route.query.d}/${this.$route.params.filename}`);
    }
  },

  beforeDestroy() {
    this.clear();
  },
  methods: {
    ...mapActions({
      fetch: FILE_ACTION_FETCH,
      clear: FILE_ACTION_CLEAR,
    }),

    getFile(filename) {
      this.fetch(filename);
    },
  },
};
</script>
