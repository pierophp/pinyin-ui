<template>
  <div class="dictionary-container">
    <loadable-content :loading="loading">
      <div class="title-container">
        <traditional-simplified-show
          :pinyin="dictionary.pronunciation"
          :ideograms="dictionary.ideograms"
          :variants="dictionary.variants"
        />
        <span class="pinyin">- {{ dictionary.pronunciation }}</span>
        <div>
          <md-button
            class="md-icon-button md-primary clipboard-btn"
            @click="clipboard(dictionary.ideograms)"
          >
            <md-icon>content_copy</md-icon>
          </md-button>

          <a :href="'https://pt.forvo.com/word/' + dictionary.ideograms + '#zh'" target="_blank">
            <md-button class="md-icon-button md-accent sound-btn">
              <md-icon>volume_up</md-icon>
            </md-button>
          </a>
        </div>
      </div>
      <tabs>
        <tab :label="$t('definition')">
          <dictionary-details :dictionary="dictionary" :pinyin="dictionary.pronunciation"/>
        </tab>
        <tab :label="$t('stroke')">
          <dictionary-stroke-order :ideograms="dictionary.ideograms"/>
        </tab>
        <tab label="Links">
          <Links list="1" :character="dictionary.ideograms"/>
        </tab>
      </tabs>
    </loadable-content>

    <md-snackbar md-position="center" :md-duration="1300" :md-active.sync="clipboardOpen">
      <span>{{ $t('copied_to_clipboard') }}</span>
    </md-snackbar>

    <md-button @click.native="back" class="md-fab md-fab-bottom-right md-warn">
      <md-icon>arrow_back</md-icon>
    </md-button>
  </div>
</template>

<script>
import http from 'src/helpers/http';
import LoadableContent from 'src/components/common/loading/LoadableContent';
import DictionaryDetails from 'src/components/dictionary/Details';
import DictionaryStrokeOrder from 'src/components/dictionary/StrokeOrder';
import TraditionalSimplifiedShow from 'src/components/ideograms/TraditionalSimplifiedShow';
import Links from 'src/components/ideograms/Links';
import OptionsManager from 'src/domain/options-manager';
import Tabs from 'src/components/common/Tabs';
import Tab from 'src/components/common/Tab';

const optionsManager = new OptionsManager(undefined);
const options = optionsManager.getOptions();

export default {
  name: 'dicionary-search',
  components: {
    LoadableContent,
    DictionaryDetails,
    DictionaryStrokeOrder,
    TraditionalSimplifiedShow,
    Links,
    Tabs,
    Tab,
  },
  data() {
    return {
      dictionary: {},
      loading: false,
      clipboardOpen: false,
    };
  },
  mounted() {
    this.search();
  },
  computed: {
    ideograms: function first() {
      if (options.ideogramType === 't') {
        return this.dictionary.ideogramsTraditional;
      }
      return this.dictionary.ideograms;
    },
  },
  methods: {
    search() {
      this.loading = true;
      http
        .get('unihan/dictionary', {
          params: {
            id: this.$route.params.id,
          },
        })
        .then(response => {
          this.dictionary = response.data;
          this.loading = false;
        });
    },
    back() {
      this.$router.push({
        name: 'dictionary',
        query: {
          search: this.$route.query.search,
        },
      });
    },
    
    openDialog(ref) {
      this.$refs[ref].open();
    },
    closeDialog(ref) {
      this.$refs[ref].close();
    },
    clipboard(ideogram) {
      this.$clipboard(ideogram);
      this.clipboardOpen = true;
    },
  },
};
</script>

<style>
.dictionary-container {
  flex: 1;
  padding: 0 10px 65px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.dictionary-container .md-input-container {
  margin-bottom: 15px;
}

.dictionary-container .title-container {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  font-size: 25px;
  min-height: 45px;
  margin: 15px 0 0;
}

.dictionary-container .title-container .pinyin {
  font-size: 17px;
}

.dictionary-container .title-container .ideogram-show span {
  display: inline-block;
  text-align: center;
  width: 25px;
}

.sound {
  cursor: pointer;
}

</style>
