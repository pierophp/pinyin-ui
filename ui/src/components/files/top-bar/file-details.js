export default {
  template: '<div><md-button class="md-icon-button" @click="visualizationMode()"><md-icon>visibility</md-icon></md-button></div>',
  methods: {
    visualizationMode() {
      this.$router.push({
        name: 'print',
        params: { filename: this.$route.params.filename },
      });
    },
  },
};
