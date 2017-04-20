<template>
  <video autoplay controls>
    <source src="https://download-a.akamaihd.net/files/media_video/d9/pk_CHS_026_r240P.mp4" ></source>
    <track :src="trackUrl" default>
    </track>
  </video>
</template>

<script>
  import Config from 'src/helpers/config';

  export default {
    name: 'video-show',
    data() {
      return {
        trackUrl: '',
      };
    },
    created() {
      this.trackUrl = `${Config.get('apiUrl')}jw/track?url=https://download-a.akamaihd.net/files/media_video/56/pk_CHS_026_r720P.vtt`;
    },
  };
</script>

<style>

</style>
