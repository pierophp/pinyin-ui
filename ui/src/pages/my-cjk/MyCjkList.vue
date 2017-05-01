<template>
  <div class="ideograms-container">
    <md-tabs>
      <md-tab id="ideograms" :md-label="$t('ideograms')">
        <h3>{{ $t('my_total') }}: {{total}}</h3>
        <md-table>
          <md-table-header>
            <md-table-row>
              <md-table-head>{{ $t('freq.') }}</md-table-head>
              <md-table-head>{{ $t('my_ideograms') }}</md-table-head>
              <md-table-head></md-table-head>
            </md-table-row>
          </md-table-header>
          <md-table-body>
            <md-table-row v-for="row in report">
              <md-table-cell>{{ (row.frequency === 999) ? '-' : row.frequency }}</md-table-cell>
              <md-table-cell>
                {{row.total_my}}
                {{ (row.frequency === 999) ? '' : ('/ ' + row.total + ' (' + row.percent + '%)') }}
              </md-table-cell>
              <md-table-cell>
                <md-menu md-size="3" >
                  <md-button class="md-raised md-primary" md-menu-trigger>
                    {{ $t('action') }}
                  </md-button>
                  <md-menu-content>
                    <md-menu-item @click.native="unknownIdeograms(row.frequency)" v-if="row.frequency !== 999">
                      <span>{{ $t('unknown') }}</span>
                    </md-menu-item>
                    <md-menu-item @click.native="knownIdeograms(row.frequency)">
                      <span>{{ $t('known') }}</span>
                    </md-menu-item>
                  </md-menu-content>
                </md-menu>
              </md-table-cell>
            </md-table-row>
          </md-table-body>
        </md-table>
      </md-tab>

      <md-tab id="words" :md-label="$t('words')">
        <h3>{{ $t('my_total') }}: {{totalWords}}</h3>
        <md-table>
          <md-table-header>
            <md-table-row>
              <md-table-head>HSK</md-table-head>
              <md-table-head>{{ $t('word') }}</md-table-head>
              <md-table-head></md-table-head>
            </md-table-row>
          </md-table-header>
          <md-table-body>
            <md-table-row v-for="row in reportWords">
              <md-table-cell>{{ (row.hsk === 999) ? '-' : row.hsk }}</md-table-cell>
              <md-table-cell>{{row.total_my}}
                {{ (row.hsk === 999) ? '' : ('/ ' + row.total + ' (' + row.percent + '%)') }}
              </md-table-cell>
              <md-table-cell>
                <md-menu md-size="3" >
                  <md-button class="md-raised md-primary" md-menu-trigger>
                    {{ $t('action') }}
                  </md-button>
                  <md-menu-content>
                    <md-menu-item @click.native="unknownWords(row.hsk)" v-if="row.hsk !== 999">
                      <span>{{ $t('unknown') }}</span>
                    </md-menu-item>
                    <md-menu-item @click.native="knownWords(row.hsk)">
                      <span>{{ $t('known') }}</span>
                    </md-menu-item>
                  </md-menu-content>
                </md-menu>
              </md-table-cell>
            </md-table-row>
          </md-table-body>
        </md-table>

      </md-tab>
    </md-tabs>

    <md-dialog ref="dialogUnknown">
      <md-dialog-title>{{ $t('unknown') }} <span v-if="frequency !== 999">- {{ $t('frequency') }} {{frequency}}</span>
      </md-dialog-title>
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

    <md-dialog ref="dialogKnown">
      <md-dialog-title>{{ $t('known') }} <span v-if="frequency !== 999">- {{ $t('frequency') }} {{frequency}}</span>
      </md-dialog-title>
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
        <md-button class="md-primary" @click.native="closeDialog('dialogKnown')">OK</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog ref="dialogUnknownWords">
      <md-dialog-title>{{ $t('unknown') }} <span v-if="hsk !== 999">- HSK {{hsk}}</span>
      </md-dialog-title>
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
        <md-button class="md-primary" @click.native="closeDialog('dialogUnknownWords')">OK</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog ref="dialogKnownWords">
      <md-dialog-title>{{ $t('known') }} <span v-if="hsk !== 999">- HSK {{hsk}}</span>
      </md-dialog-title>
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
        <md-button class="md-primary" @click.native="closeDialog('dialogKnownWords')">OK</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  import http from 'src/helpers/http';
  import IdeogramsShow from 'src/components/ideograms/Show';

  export default {
    name: 'my-cjk-list',
    data() {
      return {
        total: 0,
        totalWords: 0,
        frequency: 0,
        report: [],
        reportWords: [],
        reportUnkown: [],
      };
    },
    components: {
      IdeogramsShow,
    },
    methods: {
      knownIdeograms(frequency) {
        this.frequency = frequency;
        http
        .get('my-cjk/report_known', {
          params: {
            frequency,
          },
        })
        .then((result) => {
          this.reportUnkown = result.data.ideograms;
          this.openDialog('dialogKnown');
        });
      },
      unknownIdeograms(frequency) {
        this.frequency = frequency;
        http
        .get('my-cjk/report_unknown', {
          params: {
            frequency,
          },
        })
        .then((result) => {
          this.reportUnkown = result.data.ideograms;
          this.openDialog('dialogUnknown');
        });
      },
      knownWords(hsk) {
        this.hsk = hsk;
        http
        .get('my-cjk/report_known_words', {
          params: {
            hsk,
          },
        })
        .then((result) => {
          this.reportUnkown = result.data.ideograms;
          this.openDialog('dialogKnownWords');
        });
      },
      unknownWords(hsk) {
        this.hsk = hsk;
        http
        .get('my-cjk/report_unknown_words', {
          params: {
            hsk,
          },
        })
        .then((result) => {
          this.reportUnkown = result.data.ideograms;
          this.openDialog('dialogUnknownWords');
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
      .get('my-cjk/report_words')
      .then((result) => {
        this.totalWords = result.data.total;
        this.reportWords = result.data.report;
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
    margin-top: 20px;
  }

  .ideograms-container h3{
    margin-top: 0px;
  }

  #ideograms .md-table{
    max-width: 650px;
  }

  #ideograms .md-table th:first-child{
    width: 20px;
  }

  #words .md-table{
    max-width: 650px;
  }

  #ideograms .md-table-head-text,
  #words .md-table-head-text{
    font-size: 16px !important;
  }

  #ideograms .md-table-cell-container,
  #words .md-table-cell-container{
    font-size: 16px;
  }

  .ideogram .md-table-cell-container{
    font-family: 'Noto Sans SC', sans-serif;
    font-size: 21px !important;
    font-weight: 300 !important;
  }

  .ideograms-container .md-table .md-table-head-text{
    padding-right:0 !important;
  }
  .ideograms-container .md-table .md-table-cell .md-button {
    width: auto;
  }
</style>

