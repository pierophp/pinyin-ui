<template>
  <div class="songs-container">
    <div v-for="(song) in songs" v-bind:key="song" class="song" @click="goTo(song)">{{ song }}</div>
  </div>
</template>

<script>
export default {
  name: 'songs',
  data() {
    const songs = [];
    for (let i = 1; i <= 151; i++) {
      songs.push(i);
    }

    return {
      songs,
    };
  },
  methods: {
    goTo(link) {
      this.$router.push(`/songs/${link}`);
    },
  },
};
</script>

<style>
.songs-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  width: 100%;
  margin: 15px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.song {
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

.song:hover {
  background-color: #275197;
}
</style>
