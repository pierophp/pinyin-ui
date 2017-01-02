<template>
  <div>
    <h3>My Total: {{total}}</h3>
    <md-table>
      <md-table-header>
        <md-table-row>
          <md-table-head>Frequency</md-table-head>
          <md-table-head>Total</md-table-head>
          <md-table-head>My Ideograms</md-table-head>
          <md-table-head>Percent</md-table-head>
        </md-table-row>
      </md-table-header>
      <md-table-body>
        <md-table-row v-for="row in report">
          <md-table-cell>{{row.frequency}}</md-table-cell>
          <md-table-cell>{{row.total}}</md-table-cell>
          <md-table-cell>{{row.total_my}}</md-table-cell>
          <md-table-cell>{{row.percent}}%</md-table-cell>
        </md-table-row>
      </md-table-body>
    </md-table>
  </div>
</template>

<script>
  import http from 'src/helpers/http';

  export default {
    name: 'my-cjk-list',
    data() {
      return {
        total: 0,
        report: [],
      };
    },
    created() {
      http
      .get('my-cjk/report')
      .then((result) => {
        this.total = result.data.total;
        this.report = result.data.report;
      });
    },
  };
</script>

