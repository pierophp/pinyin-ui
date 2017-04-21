<template>
  <video controls ref="video">
    <source src="https://download-a.akamaihd.net/files/media_video/d9/pk_CHS_026_r240P.mp4" ></source>
  </video>
</template>

<script>
  import http from 'src/helpers/http';

  export default {
    name: 'video-show',
    methods: {
      hmsToSecondsOnly(str) {
        const p = str.split(':');
        let s = 0;
        let m = 1;

        while (p.length > 0) {
          s += m * parseFloat(p.pop(), 10);
          m *= 60;
        }

        return s;
      },
    },
    mounted() {
      const video = this.$refs.video;
      const track = video.addTextTrack('subtitles');
      track.mode = 'showing';

      http
        .get('jw/track', {
          params: {
            url: 'https://download-a.akamaihd.net/files/media_video/56/pk_CHS_026_r720P.vtt',
          },
        })
        .then((response) => {
          const lines = response.data.split('\n');
          let i = 0;
          const tracks = [];
          lines.forEach((line) => {
            const lineSplit = line.split('-->');
            if (lineSplit.length > 1) {
              i += 1;
              tracks[i] = {};
              tracks[i].startTime = lineSplit[0].trim();
              tracks[i].endTime = lineSplit[1].trim();
              tracks[i].message = [];
              return;
            }

            if (i > 0) {
              if (line.trim()) {
                tracks[i].message.push(line.trim());
              }
            }
          });

          tracks.forEach((trackItem) => {
            const trackCue = new VTTCue(this.hmsToSecondsOnly(trackItem.startTime), this.hmsToSecondsOnly(trackItem.endTime), trackItem.message.join('\n'));
            track.addCue(trackCue);
          });

          video.play();
        });
    },
  };
</script>

<style>
  ::cue {

  }

  ::cue(rt) {
    float: left;
    color: #ccc;
  }
</style>
