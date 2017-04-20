<template>
  <div class="ideograms-container">
    <h3>{{ $t('my_total') }}: {{total}}</h3>
    <md-tabs>
      <md-tab id="summary" :md-label="$t('summary')">
        <md-table>
          <md-table-header>
            <md-table-row>
              <md-table-head></md-table-head>
              <md-table-head>{{ $t('my_ideograms') }}</md-table-head>
              <md-table-head></md-table-head>
            </md-table-row>
          </md-table-header>
          <md-table-body>
            <md-table-row v-for="row in report">
              <md-table-cell>{{row.frequency}}</md-table-cell>
              <md-table-cell>{{row.total_my}} / {{row.total}} ({{row.percent}}%)</md-table-cell>
              <md-table-cell>
                <md-button class="md-warn" @click.native="unknown(row.frequency)">
                  {{ $t('unknown') }}
                </md-button>
              </md-table-cell>
            </md-table-row>
          </md-table-body>
        </md-table>
      </md-tab>

      <md-tab id="ideograms" :md-label="$t('my_ideograms')">
        <md-table>
          <md-table-header>
            <md-table-row>
              <md-table-head>{{ $t('ideogram') }}</md-table-head>
              <md-table-head>{{ $t('pronunciation') }}</md-table-head>
              <md-table-head>{{ $t('frequency') }}</md-table-head>
            </md-table-row>
          </md-table-header>
          <md-table-body>
            <md-table-row v-for="ideogram in ideograms">
              <md-table-cell class="ideogram">
                <ideograms-show :pinyin="ideogram.pronunciation" :character="ideogram.ideogram"/>
              </md-table-cell>
              <md-table-cell>{{ideogram.pronunciation}}</md-table-cell>
              <md-table-cell>{{ideogram.frequency}}</md-table-cell>
            </md-table-row>
          </md-table-body>
        </md-table>
      </md-tab>
    </md-tabs>

    <md-dialog ref="dialogUnknown">
      <md-dialog-title>{{ $t('unknown') }} - {{ $t('frequency') }} {{frequency}}</md-dialog-title>
      <md-dialog-content>
        <md-table>
          <md-table-header>
            <md-table-row>
              <md-table-head>{{ $t('ideogram') }}</md-table-head>
              <md-table-head>{{ $t('pronunciation') }}</md-table-head>
            </md-table-row>
          </md-table-header>
          <md-table-body>
            <md-table-row v-for="ideogram in reportUnkown">
              <md-table-cell class="ideogram">
                <ideograms-show :pinyin="ideogram.pronunciation" :character="ideogram.ideogram"/>
              </md-table-cell>
              <md-table-cell>{{ideogram.pronunciation}}</md-table-cell>
            </md-table-row>
          </md-table-body>
        </md-table>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click.native="closeDialog('dialogUnknown')">OK</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  import http from 'src/helpers/http';
  import codeToIdeogram from 'src/helpers/code-to-ideogram';
  import IdeogramsShow from 'src/components/ideograms/Show';

  export default {
    name: 'my-cjk-list',
    data() {
      return {
        total: 0,
        frequency: 0,
        report: [],
        reportUnkown: [],
        ideograms: [],
      };
    },
    components: {
      IdeogramsShow,
    },
    methods: {
      unknown(frequency) {
        this.frequency = frequency;
        http
        .get('my-cjk/report_unknown', {
          params: {
            frequency,
          },
        })
        .then((result) => {
          this.reportUnkown = [];
          result.data.ideograms.forEach((ideogram) => {
            ideogram.ideogram = codeToIdeogram(ideogram.ideogram);
            this.reportUnkown.push(ideogram);
          });
          this.openDialog('dialogUnknown');
        });
      },
      openDialog(ref) {
        this.$refs[ref].open();
      },
      closeDialog(ref) {
        this.$refs[ref].close();
      },
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

  .ideograms-container .md-table .md-table-head-text,
  .ideograms-container .md-table .md-table-cell .md-table-cell-container {
    padding-left: 10px !important;
    padding-right: 10px !important;
  }
  .ideograms-container {
    flex: 1;
    padding: 0 10px;
    overflow: auto;
  }

  #summary .md-table{
    max-width: 650px;
  }

  #ideograms .md-table{
    max-width: 650px;
  }

  #summary .md-table-head-text,
  #ideograms .md-table-head-text{
    font-size: 16px !important;
  }

  #summary .md-table-cell-container,
  #ideograms .md-table-cell-container{
    font-size: 16px;
  }

  .ideogram .md-table-cell-container{
    font-family: 'Noto Sans SC', sans-serif;
    font-size: 26px !important;
    font-weight: 300 !important;
  }

  .ideograms-container .md-table .md-table-head-text{
    padding-right:0 !important;
  }
  .ideograms-container .md-table .md-table-cell .md-button {
    width: auto;
  }
</style>

