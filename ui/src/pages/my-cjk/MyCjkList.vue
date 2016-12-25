<template>
  <div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title">Simple Pinyin Editor</h3>
    </div>

    <div class="panel-body">
      <table class="">
        <thead>
          <tr>
            <th>Ideogram</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import http from 'src/helpers/http';

  http
    .get('my-cjk')
    .then(() => {
    });

  export default {
  };
</script>

