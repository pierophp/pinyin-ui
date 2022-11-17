<template>
  <tool-bar></tool-bar>
  <v-main>
    <div class="content">
      <chapter-container
        :book="$route.params.book"
        :chapter="$route.params.chapter"
        :parent="true"
      />
    </div>
  </v-main>
</template>

<script lang="ts">
// @ts-nocheck
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
