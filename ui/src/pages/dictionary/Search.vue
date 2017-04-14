<template>
<div class="dictionary-container">
  <form novalidate @submit.stop.prevent="submit">
    <md-input-container>
      <md-icon>pageview</md-icon>
      <label>{{ $t("search") }}</label>
      <md-input @change="search" type="text" ref="inputSearch" autofocus></md-input>
    </md-input-container>
  </form>

  <loadable-content :loading="loading">
    <dictionary-list :dictionary="dictionary"/>
  </loadable-content>
</div>
</template>

<script>
  import http from 'src/helpers/http';
  import LoadableContent from 'src/components/common/loading/LoadableContent';
  import DictionaryList from 'src/components/dictionary/List';

  export default {
    name: 'dicionary-search',
    components: {
      LoadableContent,
      DictionaryList,
    },
    data() {
      return {
        dictionary: {},
        loading: false,
      };
    },
    methods: {
      search(value) {
        this.loading = true;
        http
        .post('unihan/dictionary', {
          ideograms: value,
        })
        .then((response) => {
          this.dictionary = response.data;
          this.loading = false;
        });
      },
    },
  };
</script>

<style>
.dictionary-container {
  width: 100%;
  padding: 0 10px;
}
</style>
