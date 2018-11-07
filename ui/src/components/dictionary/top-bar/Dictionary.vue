<template>
  <div>
      <md-menu md-size="medium" md-direction="top-start" :md-offset-y="-52">
      <md-button class="md-icon-button" md-menu-trigger>
        <md-icon>more_vert</md-icon>
      </md-button>
      <md-menu-content>
        <div class="list-container">
          <div class="list-item" @click="downloadPleco()">
            <div class="icon">
              <md-icon>arrow_downward</md-icon>
            </div>
            <div class="content">
              {{ $t("download_pleco_dictionary") }}
            </div>
          </div>
        </div>
      </md-menu-content>
    </md-menu>
  </div>
</template>
<script>
import axios from 'axios';

const http = axios.create();
export default {
  methods: {
    async downloadPleco() {
      const fileName = 'Dicionario_Pleco.txt';
      const content = await http.get(`/${fileName}`);
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    },
  },
};
</script>
