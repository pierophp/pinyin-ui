<template>
  <div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title">Simple Pinyin Editor</h3>
        <a href class="btn btn-success" ng-click="addFile()"><i class="glyphicon glyphicon-plus"></i> New File</a>
        <a href="/auth/logout" class="btn btn-danger"><i class="glyphicon glyphicon-log-out"></i> Logout</a>
    </div>

    <div class="panel-body">
        <table class="table table-striped table-bordered table-hover table-condensed">
        <tr>
            <th>File</th>
            <th>Action</th>
        </tr>
        <tr v-for="file in files">
            <td>
                <router-link :to="{ name: 'file', params: { file: file }}">{{ file }}</router-link>
            </td>
            <td></td>
        </tr>
        <table>
    </div>
  </div>
</template>

<script>
  import http from 'src/helpers/http';

  export default {
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
  };
</script>
