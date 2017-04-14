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
    <h2 v-if="dictionary.pronunciation">
    {{ dictionary.pronunciation }} <md-icon class="md-warn sound" @click.native="openSound">volume_up</md-icon>
    </h2>
    <dictionary-list :dictionary="dictionary"/>
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
  import DictionaryList from 'src/components/dictionary/List';

  export default {
    name: 'dicionary-search',
    components: {
      LoadableContent,
      DictionaryList,
    },
    data() {
      return {
        forvoUrl: null,
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
          this.forvoUrl = `https://pt.forvo.com/word/${value}/#zh`;
          this.dictionary = response.data;
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
  width: 100%;
  padding: 0 10px;
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
