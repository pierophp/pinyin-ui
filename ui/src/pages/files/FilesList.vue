<template>
  <div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title">Simple Pinyin Editor</h3>
        <a @click.prevent="newFile" class="btn btn-success" ng-click="addFile()"><i class="glyphicon glyphicon-plus"></i> New File</a>
        <a @click.prevent="logout" class="btn btn-danger"><i class="glyphicon glyphicon-log-out"></i> Logout</a>
    </div>

    <div class="panel-body">
        <table class="table table-striped table-bordered table-hover table-condensed">
        <thead>
          <tr>
              <th>File</th>
              <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="file in files">
              <td>
                  <router-link :to="{ name: 'file', params: { filename: file }}">{{ file }}</router-link>
              </td>
              <td></td>
          </tr>
        </tbody>
        <table>
    </div>
    <new-file-modal></new-file-modal>
  </div>
</template>

<script>
  import http from 'src/helpers/http';
  import User from 'src/domain/user';
  import NewFileModal from 'src/components/modals/NewFile';

  export default {

    components: {
      NewFileModal,
    },

    data() {
      return {
        files: [],
      };
    },
    created() {
      http
      .get('files')
      .then((response) => {
        this.files = response.data;
      });
    },

    methods: {
      logout() {
        User.logout();
      },

      newFile() {
        $('#newFileModal').modal();
      },
    },
  };
</script>
