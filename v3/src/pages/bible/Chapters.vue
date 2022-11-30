<template>
  <tool-bar></tool-bar>
  <Main>
    <div class="bible-chapters-container">
      <div
        v-for="(chapter, chapterId) in chapters"
        v-bind:key="chapterId"
        class="bible-chapter"
        @click="goTo(chapter.c)"
      >
        {{ chapter.c }}
      </div>
    </div>
  </Main>
</template>

<script lang="ts" setup>
import chaptersData from "@/data/bible/chapters";
import ToolBar from "@/components/layout/ToolBar.vue";
import Main from "@/components/layout/Main.vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const book = route.params.book as string;

function goTo(chapter: number) {
  router.push(`/bible/${book}/${chapter}`);
}

const chapters = chaptersData[book];
</script>

<style>
.bible-chapters-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  width: 100%;
  margin: 15px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.bible-chapter {
  color: #fff;
  line-height: 45px;
  height: 45px;
  width: 45px;
  background-color: #bab6b6;
  justify-content: flex-start;
  margin: 2px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
}

.bible-chapter:hover {
  background-color: #275197;
}
</style>
