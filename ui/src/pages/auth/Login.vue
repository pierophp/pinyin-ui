<template>
  <div class="login-container">
  <loadable-content :loading="loading">
      <br/>

      <md-button class="md-dense md-raised md-primary btn-google"  @click="goToAuth(authGoogleUrl)" v-if="!loading">
        <md-icon md-src="https://unpkg.com/simple-icons@latest/icons/google.svg" />
        {{ $t("sign_in_google") }}
      </md-button>

      <md-button class="md-dense md-raised md-primary btn-baidu"  @click="goToAuth(authBaiduUrl)" v-if="!loading">
        <md-icon md-src="https://unpkg.com/simple-icons@latest/icons/baidu.svg" />
        {{ $t("sign_in_baidu") }}
      </md-button>

  </loadable-content>
  </div>
</template>

<script>
import User from 'src/domain/user';
import Config from 'src/helpers/config';
import QueryString from 'query-string';
import LoadableContent from 'src/components/common/loading/LoadableContent';
import LocalStorage from 'src/helpers/local-storage';

export default {
  name: 'login',
  components: {
    LoadableContent,
  },
  data() {
    return {
      loading: true,
      authGoogleUrl: `${Config.get('apiUrl')}auth/google`,
      authBaiduUrl: `${Config.get('apiUrl')}auth/baidu`,
    };
  },
  methods: {
    goToAuth(url) {
      const urlToRedirect = window.location.href.split('/#');
      LocalStorage.save(
        'login-url',
        `${urlToRedirect[0]}${this.$route.meta.redirectTo}`,
      );
      window.location = url;
    },
  },
  created() {
    if (User.isLogged()) {
      let redirectTo = LocalStorage.get('login-url');
      if (redirectTo) {
        LocalStorage.save('login-url', '');
      } else {
        redirectTo = this.$route.meta.redirectTo;
      }

      this.$router.push(redirectTo.replace('/#', ''));

      return;
    }

    let parsed = this.$route.query;
    if (!parsed.code) {
      parsed = QueryString.parse(location.search);
    }
    parsed.route = this.$route.name;

    if (parsed.code) {
      let redirectTo = LocalStorage.get('login-url');
      if (redirectTo) {
        LocalStorage.save('login-url', '');
      } else {
        redirectTo = this.$route.meta.redirectTo;
      }

      User.login(parsed)
        .then(() => {
          window.location = redirectTo;
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
.btn-google,
.btn-google svg {
  background-color: #a32b1c !important;
  color: #fff !important;
  fill: #fff !important;
}

.btn-baidu,
.btn-baidu svg {
  background-color: #2529d8 !important;
  color: #fff !important;
  fill: #fff !important;
}

.btn-google .md-icon,
.btn-baidu .md-icon {
  display: inline-block;
  margin-right: 5px;
}

.login-container {
  flex: 1;
  padding: 0 10px;
  overflow: auto;
}
</style>
