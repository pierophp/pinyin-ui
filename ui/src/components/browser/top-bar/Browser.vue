<template>
  <md-field class="browser-url-form-container">
    <label>{{ $t("url") }}</label>
    <md-input type="text" ref="inputSearch" v-model="url"></md-input>
  </md-field>
</template>

<style>
.browser-url-form-container input {
  background: #fff !important;
  padding-left: 5px !important;
}

.browser-url-form-container label {
  padding-left: 5px !important;
}
</style>


<script>
import { mapMutations, mapGetters } from 'vuex';

import { BROWSER_MUTATION_SET_URL } from 'src/data/browser/types';
import { BROWSER_GETTER_URL } from 'src/data/browser/types';
export default {
  data() {
    return {
      url: '',
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
      this.$refs.inputSearch.$el.focus();
    }, 500);
  },
};
</script>
