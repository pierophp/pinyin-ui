<template>
  <tool-bar></tool-bar>
  <v-main>
    <div class="content">
      <div class="login-container">
        <loadable-content :loading="loading">
          <br />

          <v-btn
            color="red"
            size="large"
            @click="goToAuth(authGoogleUrl)"
            v-if="!loading"
          >
            <svg-loader
              src="https://unpkg.com/simple-icons@latest/icons/google.svg"
              width="24"
              height="24"
            />
            {{ $t("sign_in_google") }}</v-btn
          >

          <v-btn
            size="large"
            color="blue"
            style="margin-left: 16px"
            @click="goToAuth(authBaiduUrl)"
            v-if="!loading"
          >
            <svg-loader
              src="https://unpkg.com/simple-icons@latest/icons/baidu.svg"
              width="44"
              height="44"
            />

            {{ $t("sign_in_baidu") }}</v-btn
          >
        </loadable-content>
      </div>
    </div>
  </v-main>
</template>

<script lang="ts">
import User from "@/domain/user";
import Config from "@/helpers/config";
import LoadableContent from "@/components/common/loading/LoadableContent.vue";
import LocalStorage from "@/helpers/local-storage";
import SvgLoader from "@/components/layout/SvgLoader.vue";
import ToolBar from "@/components/layout/ToolBar.vue";

export default {
  name: "login",
  components: {
    LoadableContent,
    ToolBar,
    SvgLoader,
  },
  data() {
    return {
      loading: true,
      authGoogleUrl: `${Config.get("apiUrl")}auth/google`,
      authBaiduUrl: `${Config.get("apiUrl")}auth/baidu`,
    };
  },
  methods: {
    goToAuth(url: string) {
      const urlToRedirect = window.location.href.split("/#");
      LocalStorage.save(
        "login-url",
        `${urlToRedirect[0]}${this.$route.meta.redirectTo}`
      );
      window.location.href = url;
    },
  },
  created() {
    if (User.isLogged()) {
      let redirectTo = LocalStorage.get("login-url");
      if (redirectTo) {
        LocalStorage.save("login-url", "");
      } else {
        redirectTo = this.$route.meta.redirectTo;
      }

      this.$router.push(redirectTo.replace("/#", ""));

      return;
    }

    let parsed: any = this.$route.query;

    if (!parsed.code) {
      const urlSearchParams = new URLSearchParams(location.search);
      parsed.code = urlSearchParams.get("code");
    }
    parsed.route = this.$route.name;

    if (parsed.code) {
      let redirectTo = LocalStorage.get("login-url");
      if (redirectTo) {
        LocalStorage.save("login-url", "");
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
.v-btn svg {
  stroke: currentColor;
  --tw-text-opacity: 1;
  color: rgba(255, 255, 255, var(--tw-text-opacity));
  width: 1.25rem;
  fill: #fff;
  display: inline-block;
  height: 1.25rem;
  margin-right: 0.25rem;
}

.login-container {
  flex: 1;
  padding: 0 10px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
