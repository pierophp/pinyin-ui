export default async Vue => {
  const Raven = await import(/* webpackChunkName: "raven" */ 'raven-js');
  const RavenVue = await import(/* webpackChunkName: "raven" */ 'raven-js/plugins/vue');

  Raven.config('https://c66b5a8acf4440d796646fdab764969a@sentry.io/245293')
    .addPlugin(RavenVue, Vue)
    .install();
};
