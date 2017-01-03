<template>
  <div class="files-container">
    <md-list class="md-double-line">
      <md-list-item  v-for="file in files"  @click="goToFile(file)">

        <md-icon class="md-primary">collections</md-icon>

        <div class="md-list-text-container">
          {{ file }}
        </div>

        <md-button class="md-icon-button md-list-action">
          <md-icon>more_vert</md-icon>
        </md-button>
      </md-list-item>
    </md-list>
    <new-file-modal></new-file-modal>
  </div>
</template>

<script>
  import NewFileModal from 'src/components/modals/NewFile';

  import {
    mapActions,
    mapGetters,
  } from 'vuex';

  import {
  FILES_ACTION_FETCH,
  FILES_GETTER,
  } from 'src/data/file/types';

  export default {
    name: 'files-list',

    components: {
      NewFileModal,
    },

    computed: {
      ...mapGetters({
        files: FILES_GETTER,
      }),
    },

    created() {
      this.fetch();
    },

    methods: {
      ...mapActions({
        fetch: FILES_ACTION_FETCH,
      }),
      goToFile(filename) {
        this.$router.push({
          name: 'file',
          params: { filename },
        });
      },
      newFile() {
        // $('#newFileModal').modal();
      },
    },
  };
</script>

<style>
.files-container{
  padding-bottom: 60px;
}
</style>
