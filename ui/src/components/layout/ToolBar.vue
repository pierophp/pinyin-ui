<template>
  <md-whiteframe md-tag="md-toolbar" md-elevation="2" md-theme="deep-purple" class="md-dense">
    <div class="md-toolbar-container">
      <md-button class="md-icon-button" @click="$emit('toggle-sidebar')">
        <md-icon>menu</md-icon>
      </md-button>

      <h2 class="md-title">Simple Pinyin Editor</h2>

      <span style="flex: 1"></span>

      <md-button class="md-icon-button">
        <md-icon>search</md-icon>
      </md-button>

      <md-button class="md-icon-button">
        <md-icon>view_module</md-icon>
      </md-button>
    </div>
  </md-whiteframe>
</template>
