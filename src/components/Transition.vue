<template>
  <transition>
    <keep-alive v-if="$route.meta.hasKey">
      <router-view :key="$route.fullPath"></router-view>
    </keep-alive>
    <keep-alive v-else-if="$route.meta.keepAlive">
      <router-view></router-view>
    </keep-alive>
    <router-view v-else></router-view>
  </transition>
</template>

<script setup>
</script>

<style scoped>
</style>
