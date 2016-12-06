<template>
  <div>
    Teste
  </div>
</template>
<script>
  import Config from 'src/helpers/config';

  const apiUrl = Config.get('apiUrl');

  export default {
    created() {
      this.$http.get(`${apiUrl}files/file`, {
        params: { filename: 'test.json' },
      })
      .then(() => {
        // console.log(response.data);
      })
      .catch(() => {

      });
    },

  };

</script>
