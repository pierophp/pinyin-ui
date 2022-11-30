<template>
  <ToolBar />
  <Main>
    <div class="content">
      <ChapterContainer
        :book="($route.params.book as string)"
        :chapter="($route.params.chapter as string)"
        :parent="true"
      />
    </div>
  </Main>
</template>

<script lang="ts" setup>
import ChapterContainer from "@/components/bible/ChapterContainer.vue";
import ToolBar from "@/components/layout/ToolBar.vue";
import Main from "@/components/layout/Main.vue";
</script>
