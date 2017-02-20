export default {
  template: '<div><md-button class="md-icon-button" @click.native="editionMode"><md-icon>create</md-icon></md-button></div>',
  methods: {
    editionMode() {
      this.$router.push({
        name: 'file',
        params: { filename: this.$route.params.filename },
      });
    },
  },
};
