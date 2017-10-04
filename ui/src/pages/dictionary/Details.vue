<template>
<div class="dictionary-container">
  <loadable-content :loading="loading">
    <h2>
      <ideograms-show :pinyin="dictionary.pronunciation" :character="dictionary.ideograms"/>
      - {{ dictionary.pronunciation }} <md-icon class="md-warn sound" @click.native="openSound">volume_up</md-icon>
    </h2>

    <md-tabs>
      <md-tab id="dict" :md-label="$t('definition')">
        <dictionary-details :dictionary="dictionary" :pinyin="dictionary.pronunciation"/>
      </md-tab>

      <md-tab id="stroke" :md-label="$t('stroke')">
        <dictionary-stroke-order :ideograms="dictionary.ideograms"/>
      </md-tab>
    </md-tabs>
  </loadable-content>

  <forvo-modal ref="dialogForvo" :character="dictionary.ideograms" />

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
  import IdeogramsShow from 'src/components/ideograms/Show';
  import ForvoModal from 'src/components/modals/Forvo';

  export default {
    name: 'dicionary-search',
    components: {
      LoadableContent,
      DictionaryDetails,
      DictionaryStrokeOrder,
      IdeogramsShow,
      ForvoModal,
    },
    data() {
      return {
        forvoUrl: null,
        dictionary: {},
        loading: false,
      };
    },
    mounted() {
      this.search();
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
        .then((response) => {
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
      openSound() {
        this.openDialog('dialogForvo');
      },
      openDialog(ref) {
        this.$refs[ref].open();
      },
      closeDialog(ref) {
        this.$refs[ref].close();
      },
    },
  };
</script>

<style>
.dictionary-container {
  flex: 1;
  padding: 0 10px 65px;
  overflow: auto;
}

.dictionary-container .md-input-container {
  margin-bottom: 15px;
}

.dictionary-container .md-tabs .md-tab {
  padding: 10px;
}
.dictionary-container h2 .ideogram-show span {
  display: inline-block;
  width: 30px;
}

.sound{
  cursor: pointer;
}

#forvo {
  width:  100%;
  height: 500px;
  border: 0;
}
</style>
