<template>
  <div class="container">
    <div class="ideograms">喜樂</div>
    <div class="pinyin">xǐlè</div>

    <div class="actions">
      <a class="hard" href="javascript:void(0)">Difícil</a>
      <a class="medium" href="javascript:void(0)">Médio</a>
      <a class="easy" href="javascript:void(0)">Fácil</a>
      <a class="dont-show" href="javascript:void(0)">Já sei</a>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { mapActions, mapGetters } from "vuex";

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
  props: {},

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

<style>
.container {
  width: 100%;
  height: calc(100vh - 68px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.ideograms {
  width: 100%;
  text-align: center;
  font-size: 100px;
  padding: 40px;
  flex: 1 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pinyin {
  width: 100%;
  text-align: center;
  font-size: 45px;
  padding: 40px;
  flex: 1 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.actions {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.actions a {
  flex: 1 100%;
  text-align: center;
  padding: 10px;
  margin: 3px;
  color: #ffffff !important;
  border-radius: 5px;
  align-self: center;
}

.actions a:hover {
  text-decoration: none;
  opacity: 0.85;
}

.actions .hard {
  background: #a70202;
}

.actions .medium {
  background: #023d81;
}

.actions .easy {
  background: #016301;
}

.actions .dont-show {
  background: #5f003b;
}
</style>
