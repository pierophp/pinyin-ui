<template>
  <div class="modal fade" tabindex="-1" role="dialog" id="printModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title">Print</h4>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Size</label>
            <select class="form-control" v-model="size">
              <option value="1">Normal</option>
              <option value="2">Larger</option>
            </select>
          </div>

          <div class="form-group">
            <label>Type</label>
            <select class="form-control" v-model="type">
              <option value="1">Pinyin + Ideograms</option>
              <option value="2">Ideograms only</option>
            </select>
          </div>

          <div class="form-group">
            <label>Ideogram colored</label>
            <select class="form-control" v-model="ideogramColored">
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary" @click.prevent="confirm">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'modal-print',
    data() {
      return {
        size: '1',
        type: '1',
        ideogramColored: '1',
      };
    },
    methods: {
      confirm() {
        const filename = this.$route.params.filename;
        let size = 'normal';
        if (this.size === '2') {
          size = 'larger';
        }

        $('#printModal').modal('hide');
        this.$router.push({
          name: 'print',
          params: { filename },
          query: {
            size,
            type: this.type,
            ideogramColored: this.ideogramColored,
          },
        });
      },
    },
  };
</script>
