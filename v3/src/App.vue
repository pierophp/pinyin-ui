<template>
  <v-app>
    <tool-bar :showMenu="true"></tool-bar>
    <v-main><router-view /></v-main>
  </v-app>
</template>

<script setup lang="ts">
import ToolBar from "@/components/layout/ToolBar";
</script>
