<template>
  <div>
    <h3>My Total: {{total}}</h3>

    <md-tabs>
      <md-tab id="summary" md-label="Summary">
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
      </md-tab>

      <md-tab id="ideograms" md-label="My Ideograms">
        <md-table>
          <md-table-header>
            <md-table-row>
              <md-table-head>Ideogram</md-table-head>
              <md-table-head>Pronunciation</md-table-head>
              <md-table-head>Frequency</md-table-head>
            </md-table-row>
          </md-table-header>
          <md-table-body>
            <md-table-row v-for="ideogram in ideograms">
              <md-table-cell class="ideogram">{{ideogram.ideogram}}</md-table-cell>
              <md-table-cell>{{ideogram.pronunciation}}</md-table-cell>
              <md-table-cell>{{ideogram.frequency}}</md-table-cell>
            </md-table-row>
          </md-table-body>
        </md-table>
      </md-tab>
    </md-tabs>
  </div>
</template>

<style>
.md-table .md-table-head-text,
.md-table .md-table-cell .md-table-cell-container {
  padding-left: 10px !important;
  padding-right: 10px !important;
}
</style>

<script>
  import http from 'src/helpers/http';
  import codeToIdeogram from 'src/helpers/code-to-ideogram';

  export default {
    name: 'my-cjk-list',
    data() {
      return {
        total: 0,
        report: [],
        ideograms: [],
      };
    },
    created() {
      http
      .get('my-cjk/report')
      .then((result) => {
        this.total = result.data.total;
        this.report = result.data.report;
      });

      http
      .get('my-cjk')
      .then((result) => {
        this.ideograms = [];
        result.data.ideograms.forEach((ideogram) => {
          ideogram.ideogram = codeToIdeogram(ideogram.ideogram);
          this.ideograms.push(ideogram);
        });
      });
    },
  };
</script>

<style>
  #summary .md-table{
    max-width: 650px;
  }

  #ideograms .md-table{
    max-width: 650px;
  }

  #summary .md-table-head-text,
  #ideograms .md-table-head-text{
    font-size: 20px !important;
  }

  #summary .md-table-cell-container,
  #ideograms .md-table-cell-container{
    font-size: 18px   ;
  }

  .ideogram .md-table-cell-container{
    font-family: 'Noto Sans SC', sans-serif;
    font-size: 26px !important;
    font-weight: 300 !important;
  }
</style>

