<template>
  <div>
    <md-list class="md-double-line">
      <md-list-item  v-for="file in files">
        <md-icon class="md-primary">collections</md-icon>

        <div class="md-list-text-container">
          <router-link :to="{ name: 'file', params: { filename: file }}">{{ file }}</router-link>
        </div>

        <md-button class="md-icon-button md-list-action">
          <md-icon>sms</md-icon>
        </md-button>
      </md-list-item>
    </md-list>
    <new-file-modal></new-file-modal>
  </div>
</template>

<script>
  import http from 'src/helpers/http';
  import NewFileModal from 'src/components/modals/NewFile';

  export default {
    name: 'files-list',

    components: {
      NewFileModal,
    },

    data() {
      return {
        files: [],
      };
    },
    created() {
      http
      .get('files')
      .then((response) => {
        this.files = response.data;
      });
    },

    methods: {
      newFile() {
        // $('#newFileModal').modal();
      },
    },
  };
</script>
