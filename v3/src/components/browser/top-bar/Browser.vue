<template>
  <div class="browser-url-form-container">
    <input
      type="text"
      ref="inputSearch"
      v-model="url"
      autofocus
      placeholder="URL"
    />
  </div>
</template>

<style>
.browser-url-form-container input {
  background: #fff !important;
  padding-left: 5px !important;
  height: 30px;
  width: 100%;
}
</style>

<script>
import { mapMutations, mapGetters } from "vuex";

import {
  BROWSER_GETTER_URL,
  BROWSER_MUTATION_SET_URL,
} from "@/data/browser/types";

export default {
  data() {
    return {
      url: "",
    };
  },
  computed: {
    ...mapGetters({
      storedUrl: BROWSER_GETTER_URL,
    }),
  },
  watch: {
    url() {
      this.setUrl(this.url);
    },
  },
  methods: {
    ...mapMutations({
      setUrl: BROWSER_MUTATION_SET_URL,
    }),
  },
  mounted() {
    if (this.storedUrl) {
      this.url = this.storedUrl;
    }

    setTimeout(() => {
      this.$refs.inputSearch.focus();
    }, 500);
  },
};
</script>
