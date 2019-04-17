<template>
  <div class="files-wrapper" ref="fileWrapper">
    <div class="files-container">
      <loadable-content :loading="loading">
        <folder-structure/>

        <div class="list-container">
          <div
            class="list-item"
            v-for="(file, fileId) in filesList"
            @click="openOptions(fileId, $event)"
            v-bind:key="fileId"
          >
            <div class="icon">
              <md-button class="md-icon-button list-icon" v-if="file.type === 'file'">
                <md-icon class="md-primary">note</md-icon>
              </md-button>

              <md-button class="md-icon-button list-icon" v-if="file.type !== 'file'">
                <md-icon class="md-accent">folder</md-icon>
              </md-button>
            </div>

            <div class="content">
              <filename :filename="file.filename"/>
            </div>

            <div class="actions">
              <menu-content>
                <template slot="click">
                  <md-button class="md-icon-button md-list-action">
                    <md-icon>more_vert</md-icon>
                  </md-button>
                </template>

                <div class="list-container">
                  <div class="list-item" @click="openImportDialog(file.path)">
                    <div class="icon">
                      <md-icon>cloud_upload</md-icon>
                    </div>
                    <div class="content">{{ $t("import_site") }}</div>
                  </div>

                  <div
                    class="list-item"
                    @click="visualizationMode(file.filename, file.dirname)"
                    v-if="file.type == 'file'"
                  >
                    <div class="icon">
                      <md-icon>visibility</md-icon>
                    </div>
                    <div class="content">{{ $t("visualization_mode") }}</div>
                  </div>

                  <div
                    class="list-item"
                    @click="goToFile(file.filename, file.dirname)"
                    v-if="file.type == 'file'"
                  >
                    <div class="icon">
                      <md-icon>edit</md-icon>
                    </div>
                    <div class="content">{{ $t("edition_mode") }}</div>
                  </div>

                  <div class="list-item" @click="goToDir(file.path)" v-if="file.type == 'dir'">
                    <div class="icon">
                      <md-icon>visibility</md-icon>
                    </div>
                    <div class="content">{{ $t("visualization_mode") }}</div>
                  </div>

                  <div class="list-item" @click="openDeleteDialog(file)">
                    <div class="icon">
                      <md-icon>delete</md-icon>
                    </div>
                    <div class="content">{{ $t("delete") }}</div>
                  </div>
                </div>
              </menu-content>
            </div>
          </div>
        </div>
      </loadable-content>
    </div>
    <new-file-modal></new-file-modal>
    <delete-file-modal :file="deleteFile" ref="deleteModal"></delete-file-modal>
    <import-site-modal :filename="importFilename" ref="importModal"></import-site-modal>
  </div>
</template>

<script>
import NewFileModal from 'src/components/modals/NewFile';
import Filename from 'src/components/files/Filename';
import FolderStructure from 'src/components/files/FolderStructure';
import DeleteFileModal from 'src/components/modals/DeleteFile';
import ImportSiteModal from 'src/components/modals/ImportSite';
import LoadableContent from 'src/components/common/loading/LoadableContent';
import MenuContent from 'src/components/common/MenuContent';
import { mapActions, mapGetters } from 'vuex';
import trimStart from 'lodash/trimStart';
import {
  FILES_ACTION_FETCH,
  FILES_GETTER,
  FILE_GETTER_IMPORTING,
} from 'src/data/file/types';

export default {
  name: 'files-list',

  components: {
    NewFileModal,
    DeleteFileModal,
    ImportSiteModal,
    LoadableContent,
    Filename,
    FolderStructure,
    MenuContent,
  },

  watch: {
    files() {
      this.reloadDirname();
    },
    $route() {
      this.reloadDirname();
    },
  },

  computed: {
    filesList: function filesList() {
      if (!this.enableFiles) {
        return [];
      }

      return []
        .concat(this.files)
        .filter(item => item.dirname === this.dirname);
    },

    ...mapGetters({
      files: FILES_GETTER,
      loading: FILE_GETTER_IMPORTING,
    }),
  },

  data() {
    return {
      enableFiles: false,
      redirect: true,
      deleteFile: {},
      importFilename: '',
      menuX: 0,
      menuFileId: '',
      dirname: '/',
    };
  },

  created() {
    this.reloadDirname();
    this.fetch();
  },

  mounted() {
    setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.enableFiles = true;
        });
      });
    }, 400);
  },

  methods: {
    ...mapActions({
      fetch: FILES_ACTION_FETCH,
    }),

    reloadDirname() {
      this.dirname = '/';
      if (this.$route.query.d) {
        this.dirname = this.$route.query.d;
      }

      this.$nextTick(() => {
        this.$refs.fileWrapper.scrollTo(0, 0);
      });
    },

    goToFile(filename, dirname) {
      this.redirect = true;
      if (!this.redirect) {
        return;
      }

      this.$router.push({
        name: 'file',
        params: { filename },
        query: { d: `/${trimStart(dirname, '/')}` },
      });
    },

    goToDir(dirname) {
      this.$router.push({
        name: 'files',
        query: { d: `/${trimStart(dirname, '/')}` },
      });
    },
    openOptions(fileId, e) {
      this.menuX = (window.innerWidth - (e.clientX + 100)) * -1;
      this.$nextTick(() => {
        // this.$refs.menu[fileId]['md-active'] = true;
        this.menuFileId = fileId;
      });
    },
    openDeleteDialog(file) {
      this.deleteFile = file;
      this.$refs.deleteModal.openDialog();
    },
    openImportDialog(file) {
      this.importFilename = file;
      this.$refs.importModal.openDialog();
    },
    visualizationMode(filename, dirname) {
      this.$router.push({
        name: 'print',
        params: { filename },
        query: { d: `/${dirname}` },
      });
    },
  },
};
</script>

<style>
.files-wrapper {
  flex: 1;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.files-container {
  padding-bottom: 65px;
  will-change: transform;
}
</style>
