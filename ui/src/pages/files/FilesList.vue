<template>
  <div>
    <div class="files-container">
      <md-list class="md-double-line">
        <md-list-item v-for="(file, fileId) in files" @click.native="openOptions(fileId, $event)" >
          <md-button class="md-icon-button list-icon">
            <md-icon class="md-primary">
              {{ file.type == 'file' ? 'collections' : 'folder' }}
            </md-icon>
          </md-button>

          <div class="md-list-text-container">
            {{ file.path }}
          </div>

          <md-menu md-size="4" :md-offset-x="menuX" ref="menu">
            <md-button md-menu-trigger class="md-icon-button md-list-action">
              <md-icon>more_vert</md-icon>
            </md-button>
            <md-menu-content>
              <md-menu-item @click.native="goToFile(file.path)" v-if="file.type == 'file'">
                <md-icon>edit</md-icon>
                <span>{{ $t("edition_mode") }}</span>
              </md-menu-item>
              <md-menu-item @click.native="visualizationMode(file.path)" v-if="file.type == 'file'">
                <md-icon>visibility</md-icon>
                <span>{{ $t("visualization_mode") }}</span>
              </md-menu-item>
              <md-menu-item @click.native="openDeleteDialog(file.path)">
                <md-icon>delete</md-icon>
                <span>{{ $t("delete") }}</span>
              </md-menu-item>
            </md-menu-content>
          </md-menu>
        </md-list-item>
      </md-list>
    </div>
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
        menuX: 0,
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
        // setTimeout(() => {
        if (!this.redirect) {
          return;
        }

        this.$router.push({
          name: 'file',
          params: { filename },
        });
        // }, 200);
      },
      openOptions(fileId, e) {
        this.menuX = (window.innerWidth - (e.clientX + 100)) * -1;
        this.$nextTick(() => {
          this.$refs.menu[fileId].open();
        });

        // setTimeout(() => {
        //  this.redirect = false;
        // }, 100);
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
  will-change: transform;
}

.files-container .md-list-item .list-icon{
  padding: 0;
}
</style>
