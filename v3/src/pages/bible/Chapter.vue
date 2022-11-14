<template>
  <tool-bar></tool-bar>
  <v-main>
    <chapter-container
      :book="$route.params.book"
      :chapter="$route.params.chapter"
      :parent="true"
    />
  </v-main>
</template>

<script lang="ts">
import ChapterContainer from "@/components/bible/ChapterContainer.vue";
import ToolBar from "@/components/layout/ToolBar.vue";

export default {
  name: "bible-chapter",
  components: {
    ChapterContainer,
    ToolBar,
  },
};
</script>
