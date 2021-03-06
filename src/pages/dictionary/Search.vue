<template>
  <div class="dictionary-container">
    <form novalidate>
      <div class="search-container">
        <md-icon>pageview</md-icon>
        <div class="field-container">
          <label>{{ $t("search") }}</label>
          <input
            type="text"
            ref="inputSearch"
            autofocus
            autocapitalize="none"
            v-model="searchValue"
            :placeholder="$t('search')"
          >
          <div class="clean-dictionaty">
            <md-button class="md-icon-button md-clear md-input-action" @click.native="clear()">
              <md-icon>clear</md-icon>
            </md-button>
          </div>
        </div>
      </div>
    </form>

    <div>
      <loadable-content :loading="loading" :portal="false">
        <div
          class="list-item"
          v-for="entry in entries"
          @click="details(entry.id)"
          v-bind:key="entry.id"
        >
          <span class="ideogram">
            <traditional-simplified-show
              :pinyin="entry.pronunciation"
              :ideograms="entry.ideogram"
              :variants="entry.variants"
            />
          </span>
          <span class="pinyin">- {{ entry.pronunciation }}</span>
        </div>
        <div v-if="noResults">{{ $t("no_results") }}</div>
      </loadable-content>
    </div>
  </div>
</template>

<script>
import http from 'src/helpers/http';
import LoadableContent from 'src/components/common/loading/LoadableContent';
import TraditionalSimplifiedShow from 'src/components/ideograms/TraditionalSimplifiedShow';
import replaceall from 'replaceall';

export default {
  name: 'dicionary-search',
  components: {
    LoadableContent,
    TraditionalSimplifiedShow,
  },
  data() {
    return {
      searchValue: '',
      entries: [],
      loading: false,
      noResults: false,
    };
  },
  watch: {
    searchValue() {
      this.search(this.searchValue);
    },
  },
  created() {
    setTimeout(() => {
      this.$refs.inputSearch.focus();
      this.$refs.inputSearch.setSelectionRange(0, 1000);
    }, 500);
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
    clear() {
      this.searchValue = '';
      this.entries = [];
      this.loading = false;
      this.$refs.inputSearch.focus();
    },
    search(value) {
      const that = this;
      (function search() {
        const searchValue = value;
        setTimeout(() => {
          if (searchValue === that.searchValue && searchValue) {
            that.noResults = false;
            that.loading = true;
            that.entries = [];
            http
              .get('unihan/dictionary_search', {
                params: {
                  search: value,
                },
              })
              .then(response => {
                if (
                  replaceall(' ', '', value) ===
                  replaceall(' ', '', response.data.search)
                ) {
                  that.entries = response.data.entries;
                  that.loading = false;
                  if (that.entries.length === 0) {
                    that.noResults = true;
                  }
                }
              });
          }

          if (!that.searchValue) {
            that.entries = [];
            that.noResults = false;
          }
        }, 600);
      })();

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
        query: {
          search: this.searchValue,
        },
        params: {
          id,
        },
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
  -webkit-overflow-scrolling: touch;
}

.dictionary-container .search-container {
  display: flex;
}

.dictionary-container .search-container .field-container {
  flex: 1 100%;
}

.dictionary-container .search-container input {
  width: 100%;
}

.dictionary-container .search-container .clean-dictionaty {
  float: right;
  margin-top: -35px;
  margin-right: -10px;
}

.dictionary-container .md-input-container {
  margin-bottom: 15px;
}

.dictionary-container .ideogram {
  font-size: 20px;
}

.dictionary-container .list-item {
  padding: 10px 10px;
  cursor: pointer;
}

.dictionary-container .list-item:hover {
  background: #efefef;
}

.dictionary-container .list-item .ideogram-show span {
  display: inline-block;
  width: 20px;
}

.dictionary-container .pinyin {
  font-size: 20px;
}
</style>
