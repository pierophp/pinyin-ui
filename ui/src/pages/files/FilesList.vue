<template>
  <div class="files-container">
    <md-list class="md-double-line">
      <md-list-item  v-for="file in files">

        <md-button @click="goToFile(file)" class="md-icon-button list-icon">
          <md-icon class="md-primary">collections</md-icon>
        </md-button>

        <div @click="goToFile(file)"class="md-list-text-container">
          {{ file }}
        </div>

        <md-menu>
          <md-button md-menu-trigger class="md-icon-button md-list-action">
            <md-icon>more_vert</md-icon>
          </md-button>

          <md-menu-content>
            <md-menu-item @click="openDeleteDialog(file)">
              <md-icon>delete</md-icon>
              <span>Delete</span>
            </md-menu-item>
          </md-menu-content>
        </md-menu>
      </md-list-item>
    </md-list>
    <new-file-modal></new-file-modal>
    <delete-file-modal :filename="deleteFilename" ref="deleteModal"></delete-file-modal>
  </div>
</template>

<script>
  import NewFileModal from 'src/components/modals/NewFile';
  import DeleteFileModal from 'src/components/modals/DeleteFile';

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
      DeleteFileModal,
    },

    computed: {
      ...mapGetters({
        files: FILES_GETTER,
      }),
    },

    data() {
      return {
        deleteFilename: '',
      };
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
      openDeleteDialog(file) {
        this.deleteFilename = file;
        this.$refs.deleteModal.openDialog();
      },
    },
  };
</script>

<style>
.files-container{
  padding-bottom: 60px;
}

.files-container .md-list-item .list-icon{
  padding: 0;
}
</style>
