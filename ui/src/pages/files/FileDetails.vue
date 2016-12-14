<template>
<div class="panel panel-default">
  <div class="panel-heading">
    <h3 class="panel-title">{{filename}}</h3>

    <a class="btn btn-success" @click.prevent="save({filename, content: lines})">
      <i class="glyphicon glyphicon-save-file"></i> Save
    </a>
    <div class="btn-group">
      <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <i class="glyphicon glyphicon-print"></i> Print
        <span class="caret"></span>
      </button>
      <ul class="dropdown-menu">
        <li>
          <router-link :to="{ name: 'print', params: { filename}, query: {size: 'normal' }}">Normal</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'print', params: { filename}, query: {size: 'larger' }}">Larger</router-link>
        </li>
      </ul>
    </div>

    <a @click.prevent="logout" class="btn btn-danger"><i class="glyphicon glyphicon-log-out"></i> Logout</a>
  </div>

  <div class="panel-body larger-print">
    <file-row
      v-for="(line, index) in lines"
      :line="line"
      :line-index="index"
      :data-index="index"
      v-drag-drop="{
        group: 'file-row',
        drop: {
            css: 'drop',
            method: moveElement
        }
      }"
      ></file-row>
    <div class="clearfix"></div>
    <div class="footer">
      <a class="btn btn-success" @click.prevent="addEmptyLine()">+ line</a>
    </div>
  </div>
  <file-paste-modal></file-paste-modal>
</div>
</template>

<script>
  // import Vue from 'vue';
  import FileRow from 'src/components/files/FileRow';
  import FilePasteModal from 'src/components/modals/FilePaste';
  import User from 'src/domain/user';

  import {
    mapActions,
    mapGetters,
    mapMutations,
  } from 'vuex';

  import {
  FILE_ACTION_FETCH,
  FILE_ACTION_SAVE,
  FILE_GETTER,
  FILE_MUTATION_ADD_EMPTY_LINE,
  } from 'src/data/file/types';

  export default {
    name: 'file-details',

    components: {
      FileRow,
      FilePasteModal,
    },

    data() {
      return {
        filename: '',
      };
    },

    computed: {
      ...mapGetters({
        lines: FILE_GETTER,
      }),
    },

    watch: {
      $route() {
        if (this.$route.params.filename) {
          this.getFile(this.$route.params.filename);
        }
      },
    },

    created() {
      this.getFile(this.$route.params.filename);
    },

    methods: {
      ...mapActions({
        fetch: FILE_ACTION_FETCH,
        save: FILE_ACTION_SAVE,
      }),

      ...mapMutations({
        addEmptyLine: FILE_MUTATION_ADD_EMPTY_LINE,
      }),

      getFile(filename) {
        if (!this.lines.length || this.filename !== filename) {
          this.fetch(filename);
        }

        this.filename = filename;
      },

      logout() {
        User.logout();
      },

      moveElement(draggedElement, droppedElement) {
        const draggedIndex = draggedElement.getAttribute('data-index');
        const droppedIndex = droppedElement.getAttribute('data-index');
        console.log(draggedIndex);
        console.log(droppedIndex);
        // const newDraggedElement = this.lines[draggedIndex];
        // const newDroppedElement = this.lines[droppedIndex];
        // Vue.set(this.lines, droppedIndex, newDraggedElement);
        // Vue.set(this.lines, draggedIndex, newDroppedElement);
      },
    },
  };
</script>

<style>
  	.list {  }
		.list li { font-size:14px; font-family:Arial; color:#fff; background-color:#3879d9; padding:7px 20px; border:2px solid transparent; cursor:pointer; }
		.list li:hover { color:#3879d9; background-color:#fff; border:2px solid #3879d9; }
		.list li.drag-start { background-color:#C56767; }
		.list li.drag-over { background-color:#67c58f; }
		.empty-container { font-size:0; }
		.empty-container .column { display:inline-block; vertical-align:top; }
		.empty-container.two-column .column { width:48.5%; margin-right:1.5%; }
		.empty-container.two-column .column:nth-of-type(2n) { margin-right:0; }
</style>
