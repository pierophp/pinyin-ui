<template>
  <div>
    <menu-content>
      <template slot="click">
        <v-btn icon slot="activator">
          <v-icon color="#fff">more_vert</v-icon>
        </v-btn>
      </template>

      <div class="list-container">
        <div class="list-item" @click="downloadPleco()">
          <div class="icon">
            <v-icon>arrow_downward</v-icon>
          </div>
          <div class="content">{{ $t("download_pleco_dictionary") }}</div>
        </div>
      </div>
    </menu-content>
  </div>
</template>
<script lang="ts">
// @ts-nocheck
import axios from "axios";
import MenuContent from "@/components/common/MenuContent.vue";
const http = axios.create();
export default {
  components: {
    MenuContent,
  },
  methods: {
    async downloadPleco() {
      const fileName = "Dicionario_Pleco.txt";
      const content = await http.get(`/${fileName}`);

      const blob = new Blob([content.data], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    },
  },
};
</script>
