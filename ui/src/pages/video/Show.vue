<template>
  <div class="video-container">
    <loadable-content :loading="loading">
      <md-input-container>
          <md-icon>play_circle_outline</md-icon>
          <label>{{ $t("url") }}</label>
          <md-input @change="loadVideo" type="text" ref="inputSearch" autofocus v-model="videoUrl"></md-input>
      </md-input-container>
      <video :src="videoUrl" controls preload ref="video" v-show="videoUrl">
      </video>

      <br/><br/>
      <a :href="downloadLink" v-if="downloadLink" :download="downloadFilename">{{ $t("download_track") }}</a>
    </loadable-content>
    <md-snackbar md-position="bottom center" ref="snackbar" md-duration="3000">
      <span>{{ $t("message_no_track") }}</span>
    </md-snackbar>
  </div>
</template>

<script>
  import http from 'src/helpers/http';
  import LoadableContent from 'src/components/common/loading/LoadableContent';

  export default {
    name: 'video-show',
    components: {
      LoadableContent,
    },
    methods: {
      formatTime(str) {
        if (str.split(':').length === 2) {
          return `00:${str}`.replace('.', ',');
        }

        return str.replace('.', ',');
      },
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
      loadVideo(videoUrl) {
        this.videoUrl = videoUrl;
        if (!videoUrl) {
          return;
        }

        if (this.track) {
          this.track.mode = 'hidden';
        }
        this.loading = true;
        const video = this.$refs.video;
        const track = video.addTextTrack('subtitles');
        this.track = track;
        track.mode = 'showing';
        this.downloadLink = '';


        const urlParts = videoUrl.split('/');
        this.downloadFilename = urlParts[urlParts.length - 1].replace('.mp4', '.srt');

        http
          .get('jw/track', {
            params: {
              url: videoUrl,
            },
          })
          .then((response) => {
            const lines = response.data.split('\n');
            if (lines.length === 1) {
              this.$refs.snackbar.open();
              this.loading = false;
              video.play();
              return;
            }

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

            let trackContent = '';
            i = 0;
            tracks.forEach((trackItem) => {
              i += 1;
              const message = trackItem.message.join('\n');
              trackContent += `${i}\n`;
              trackContent += `${this.formatTime(trackItem.startTime)} --> `;
              trackContent += `${this.formatTime(trackItem.endTime)}\n`;
              trackContent += `${message}\n\n`;
              const startTime = this.hmsToSecondsOnly(trackItem.startTime);
              const endTime = this.hmsToSecondsOnly(trackItem.endTime);
              const trackCue = new VTTCue(startTime, endTime, message);
              track.addCue(trackCue);
            });
            const blob = new Blob([trackContent], { type: 'text/plain' });
            this.downloadLink = window.URL.createObjectURL(blob);
            this.loading = false;
            video.play();
          });
      },
    },
    data() {
      return {
        downloadLink: '',
        downloadFilename: '',
        videoUrl: '',
        track: '',
        loading: false,
      };
    },
  };
</script>

<style>
  .video-container{
    flex: 1;
    padding: 0 10px;
    overflow: auto;
  }

  ::cue(rt) {
    color: #ccc;
    background:#000;
  }
</style>
