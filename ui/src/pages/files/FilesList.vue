<template>
  <div class="files-container">
    <md-list class="md-double-line">
      <md-list-item  @click="goToFile(file)" v-for="file in files">

        <md-button class="md-icon-button list-icon">
          <md-icon class="md-primary">collections</md-icon>
        </md-button>

        <div class="md-list-text-container">
          {{ file }}
        </div>

        <md-menu md-size="4">
          <md-button md-menu-trigger class="md-icon-button md-list-action" @click="openOptions">
            <md-icon>more_vert</md-icon>
          </md-button>

          <md-menu-content>
            <md-menu-item @click="visualizationMode(file)">
              <md-icon>visibility</md-icon>
              <span>{{ $t("visualization_mode") }}</span>
            </md-menu-item>
            <md-menu-item @click="openDeleteDialog(file)">
              <md-icon>delete</md-icon>
              <span>{{ $t("delete") }}</span>
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
        redirect: true,
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
        this.redirect = true;
        setTimeout(() => {
          if (!this.redirect) {
            return;
          }

          this.$router.push({
            name: 'file',
            params: { filename },
          });
        }, 200);
      },
      openOptions() {
        setTimeout(() => {
          this.redirect = false;
        }, 100);
      },
      openDeleteDialog(file) {
        this.deleteFilename = file;
        this.$refs.deleteModal.openDialog();
      },
      visualizationMode(filename) {
        this.$router.push({
          name: 'print',
          params: { filename },
        });
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
