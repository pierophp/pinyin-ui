<template>
<div class="dictionary-container">
  <loadable-content :loading="loading">
    <h2>
    {{ dictionary.ideograms }} - {{ dictionary.pronunciation }} <md-icon class="md-warn sound" @click.native="openSound">volume_up</md-icon>
    </h2>

    <md-tabs>
      <md-tab id="dict" md-label="Dict">
        <dictionary-details :dictionary="dictionary"/>
      </md-tab>

      <md-tab id="stroke" md-label="Stroke">
        <dictionary-stroke-order :ideograms="dictionary.ideograms"/>
      </md-tab>
    </md-tabs>
  </loadable-content>

  <md-dialog ref="dialogForvo">
    <md-dialog-content>
      <iframe :src="forvoUrl" id="forvo"/>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary" @click.native="closeDialog('dialogForvo')">OK</md-button>
    </md-dialog-actions>
  </md-dialog>
</div>
</template>

<script>
  import http from 'src/helpers/http';
  import LoadableContent from 'src/components/common/loading/LoadableContent';
  import DictionaryDetails from 'src/components/dictionary/Details';
  import DictionaryStrokeOrder from 'src/components/dictionary/StrokeOrder';

  export default {
    name: 'dicionary-search',
    components: {
      LoadableContent,
      DictionaryDetails,
      DictionaryStrokeOrder,
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
          this.forvoUrl = `https://pt.forvo.com/word/${this.dictionary}/#zh`;
          this.loading = false;
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
  padding: 0 10px;
  overflow: auto;
}

.dictionary-container .md-input-container {
  margin-bottom: 15px;
}

.dictionary-container .md-tabs .md-tab {
  padding: 10px;
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
