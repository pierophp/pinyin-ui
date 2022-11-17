<template>
  <i class="svg-loader" v-html="html"></i>
</template>

<script lang="ts">
// @ts-nocheck
let svgStore = {};

export default {
  name: "SVGLoader",
  props: {
    src: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    html: null,
    error: null,
  }),
  watch: {
    src() {
      this.html = null;
      this.loadSVG();
    },
  },
  methods: {
    isSVG(mimetype: string | null) {
      if (typeof mimetype !== "string") return false;
      return mimetype.indexOf("svg") >= 0;
    },
    setHtml() {
      svgStore[this.src]
        .then((html) => {
          this.html = html;

          return this.$nextTick();
        })
        .then(() => this.$emit("svg-loaded"));
    },
    unexpectedError(reject) {
      this.error = `Something bad happened trying to fetch ${this.src}.`;
      reject(this.error);
    },
    loadSVG() {
      if (!svgStore.hasOwnProperty(this.src)) {
        svgStore[this.src] = new Promise((resolve, reject) => {
          const request = new window.XMLHttpRequest();

          request.open("GET", this.src, true);

          request.onload = () => {
            const mimetype = request.getResponseHeader("content-type");

            if (request.status === 200) {
              if (this.isSVG(mimetype)) {
                resolve(request.response);
                this.setHtml();
              } else {
                this.error = `The file ${this.src} is not a valid SVG.`;
                reject(this.error);
              }
            } else if (request.status >= 400 && request.status < 500) {
              this.error = `The file ${this.src} do not exists.`;
              reject(this.error);
            } else {
              this.unexpectedError(reject);
            }
          };

          request.onerror = () => this.unexpectedError(reject);
          request.onabort = () => this.unexpectedError(reject);
          request.send();
        });
      } else {
        this.setHtml();
      }
    },
  },
  mounted() {
    this.loadSVG();
  },
};
</script>

<style>
.svg-loader svg {
  width: 100%;
}
</style>
