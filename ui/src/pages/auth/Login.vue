<template>
  <div class="panel panel-default">

    <div class="panel-heading">
        Simple Pinyin Editor
    </div>

    <div class="panel-body" ng-show="showLogin" >
        <a class="btn btn-social btn-lg btn-google" :href="authGoogleUrl">
        <i class="fa fa-google"></i>
        Sign in with Google</a>
    </div>
  </div>

</template>
<script>
  import User from 'src/domain/user';
  import QueryString from 'query-string';
  import Config from 'src/helpers/config';

  export default {
    data() {
      return {
        authGoogleUrl: `${Config.get('apiUrl')}auth/google`,
      };
    },
    created() {
      const parsed = QueryString.parse(location.search);
      if (parsed.code) {
        User.login(parsed.code)
          .then(() => {
            window.location = '/#/files';
          })
          .catch();
      }
    },
  };
</script>
