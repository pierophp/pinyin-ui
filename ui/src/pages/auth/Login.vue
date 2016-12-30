<template>
  <div class="panel panel-default">
    <loadable-content :loading="loading">
      <div class="panel-heading">
          Simple Pinyin Editor
      </div>

      <div class="panel-body">
          <a class="btn btn-social btn-lg btn-google" :href="authGoogleUrl">
          <i class="fa fa-google"></i>
          Sign in with Google</a>
      </div>
    </loadable-content>
  </div>

</template>

<script>
  import User from 'src/domain/user';
  import QueryString from 'query-string';
  import Config from 'src/helpers/config';
  import LoadableContent from 'src/components/common/loading/LoadableContent';

  export default {
    name: 'login',
    components: {
      LoadableContent,
    },
    data() {
      return {
        loading: true,
        authGoogleUrl: `${Config.get('apiUrl')}auth/google`,
      };
    },
    created() {
      if (User.isLogged()) {
        window.location = '/#/files';
      }

      const parsed = QueryString.parse(location.search);
      if (parsed.code) {
        User.login(parsed.code)
          .then(() => {
            window.location = '/#/files';
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        this.loading = false;
      }
    },
  };
</script>

<style>
.btn-google{
  color: #fff !important;
}
</style>
