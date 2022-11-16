<template>
  <div>
    <v-btn
      icon="mdi-arrow-left"
      variant="text"
      @click="$router.push('/bible')"
    ></v-btn>
  </div>
</template>

<script lang="ts">
export default {
  name: "bible-save-top-bar",
};
</script>
