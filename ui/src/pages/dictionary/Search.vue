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
  <loadable-content :loading="loading">
    <md-list>
      <md-list-item v-for="entry in entries" @click.native="details(entry.id)">
        <span>
          <span class="ideogram">
            <ideograms-show :pinyin="entry.pronunciation" :character="entry.ideogram"/>
          </span
          ><span class="pinyin"> - {{ entry.pronunciation }}</span>
        </span>
      </md-list-item>
    </md-list>
  </loadable-content>
  </div>
</div>
</template>

<script>
  import http from 'src/helpers/http';
  import LoadableContent from 'src/components/common/loading/LoadableContent';
  import IdeogramsShow from 'src/components/ideograms/Show';
  import replaceall from 'replaceall';

  export default {
    name: 'dicionary-search',
    components: {
      LoadableContent,
      IdeogramsShow,
    },
    data() {
      return {
        searchValue: '',
        entries: [],
        loading: false,
      };
    },
    mounted() {
      this.$nextTick(() => {
        this.searchValue = this.$route.query.search;
        if (this.searchValue) {
          this.search(this.searchValue);
        }
      });
    },
    methods: {
      search(value) {
        value = replaceall(' ', '', value);
        const that = this;
        (function search() {
          const searchValue = value;
          setTimeout(() => {
            if (searchValue === that.searchValue && searchValue) {
              that.loading = true;
              http
              .get('unihan/dictionary_search', {
                params: {
                  search: value,
                },
              })
              .then((response) => {
                if (value === response.data.search) {
                  that.entries = response.data.entries;
                  that.loading = false;
                }
              });
            }

            if (!searchValue) {
              that.entries = [];
            }
          }, 400);
        }());

        this.$router.push({
          path: this.$route.path,
          query: {
            search: value,
          },
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

.dictionary-container .md-list {
  padding: 0;
}

.dictionary-container .md-input-container {
  margin-bottom: 15px;
}

.dictionary-container .ideogram {
  font-size:20px;
}

.dictionary-container .md-list .ideogram-show span {
  display: inline-block;
  width: 20px;
}

.dictionary-container .pinyin {
  font-size: 20px;
}
</style>
