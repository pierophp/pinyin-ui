<template>
  <div>
    <div class="modal-header">
      <h3 class="modal-title">New File</h3>
    </div>
    <div class="modal-body">
      <input type="text" class="form-control" auto-focus ng-model="text" />
    </div>
    <div class="modal-footer">
      <button class="btn btn-primary" type="button" ng-click="ok()">OK</button>
      <button class="btn btn-danger" type="button" ng-click="cancel()">Cancel</button>
    </div>
  </div>
</template>
