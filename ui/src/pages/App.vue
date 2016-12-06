<template>
  <div id="container">
    <transition name="fade-page">
      <keep-alive>
        <router-view />
      </keep-alive>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>
