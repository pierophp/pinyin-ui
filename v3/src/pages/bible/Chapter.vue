<template>
  <chapter-container
    :book="$route.params.book"
    :chapter="$route.params.chapter"
    :parent="true"
  />
</template>

<script lang="ts">
import ChapterContainer from "@/components/bible/ChapterContainer.vue";

export default {
  name: "bible-chapter",
  components: {
    ChapterContainer,
  },
};
</script>
