<template>
  <div class="login-container">
    <loadable-content :loading="loading">
      <br />

      <button
        class="btn text-white bg-red-500 group mr-4"
        @click="goToAuth(authGoogleUrl)"
        v-if="!loading"
      >
        <svg-loader
          src="https://unpkg.com/simple-icons@latest/icons/google.svg"
          width="24"
          height="24"
        />

        {{ $t('sign_in_google') }}
      </button>

      <button
        class="btn text-white bg-blue-800 group mr-4"
        @click="goToAuth(authBaiduUrl)"
        v-if="!loading"
      >
        <svg-loader
          src="https://unpkg.com/simple-icons@latest/icons/baidu.svg"
          width="24"
          height="24"
        />

        {{ $t('sign_in_baidu') }}
      </button>
    </loadable-content>
  </div>
</template>

<script>
import User from 'src/domain/user';
import Config from 'src/helpers/config';
import QueryString from 'query-string';
import LoadableContent from 'src/components/common/loading/LoadableContent';
import LocalStorage from 'src/helpers/local-storage';
import SvgLoader from '@/components/layout/SvgLoader.vue';

export default {
  name: 'login',
  components: {
    LoadableContent,
    SvgLoader,
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
.btn svg {
  @apply w-5 h-5 stroke-current text-white inline-block mr-1 group-hover:opacity-70;
  fill: #fff;
}

.login-container {
  flex: 1;
  padding: 0 10px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
