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
          <a>
              Normal
          </a>
        </li>
        <li>
          <a>
              Larger
          </a>
        </li>
      </ul>
    </div>

    <a href="/auth/logout" class="btn btn-danger"><i class="glyphicon glyphicon-log-out"></i> Logout</a>
  </div>

  <div class="panel-body larger-print">
    <file-row
      v-for="(line, index) in lines"
      :line="line"
      :line-index="index"
      ></file-row>
    <div class="clearfix"></div>
    <div class="footer">
      <a class="btn btn-success" @click.prevent="addEmptyLine()">+ line</a>
    </div>
  </div>
</div>
</template>

<script>

  import FileRow from 'src/components/files/FileRow';

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

    created() {
      this.filename = this.$route.params.file;
      this.getFile();
    },

    methods: {
      ...mapActions({
        fetch: FILE_ACTION_FETCH,
        save: FILE_ACTION_SAVE,
      }),

      ...mapMutations({
        addEmptyLine: FILE_MUTATION_ADD_EMPTY_LINE,
      }),

      getFile() {
        if (!this.lines.length) {
          this.fetch(this.filename);
        }
      },
    },
  };
</script>
