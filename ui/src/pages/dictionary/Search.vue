<template>
<div class="dictionary-container">
  <form novalidate @submit.stop.prevent="submit">
    <md-input-container>
      <md-icon>pageview</md-icon>
      <label>{{ $t("search") }}</label>
      <md-input @change="search" type="text" ref="inputSearch" autofocus v-model="searchValue"></md-input>
    </md-input-container>
  </form>
  <div>
    <div v-for="entry in entries" @click="details(entry.id)" class="entry-container">
      <span class="ideogram">{{ entry.ideogram }}</span><span class="pinyin"> - {{ entry.pronunciation }}</span>
    </div>
  </div>
</div>
</template>

<script>
  import http from 'src/helpers/http';
  import LoadableContent from 'src/components/common/loading/LoadableContent';

  export default {
    name: 'dicionary-search',
    components: {
      LoadableContent,
    },
    data() {
      return {
        searchValue: '',
        entries: [],
        loading: false,
      };
    },
    mounted() {
      if (this.searchValue) {
        this.search(this.searchValue);
      }
    },
    methods: {
      search(value) {
        this.loading = true;
        http
        .get('unihan/dictionary_search', {
          params: {
            search: value,
          },
        })
        .then((response) => {
          if (value === response.data.search) {
            this.entries = response.data.entries;
            this.loading = false;
          }
        });
      },
      details(id) {
        this.$router.push({
          name: 'dictionary-details',
          params: { id },
        });
      },
    },
  };
</script>

<style>
.dictionary-container {
  flex: 1;
  padding: 0 10px;
  overflow: auto;
}

.dictionary-container .md-input-container {
  margin-bottom: 15px;
}

.dictionary-container .entry-container {
  margin-bottom: 5px;
  cursor: pointer;
}

.dictionary-container .ideogram {
  font-size:20px;
}

.dictionary-container .pinyin {
  font-size: 20px;
}
</style>
