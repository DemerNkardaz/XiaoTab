<script setup lang="ts">
import { computed } from 'vue';
import { useRandomBackground } from '@/composables/useRandomBackground';

const { current } = useRandomBackground();

const style = computed(() => ({
  backgroundImage: current.value ? URL.createObjectURL(current.value.blob) : undefined,
}));
</script>

<template>
  <div class="background" :style="style" />
</template>

<style scoped>
.background {
  position: fixed;
  inset: 0;

  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  z-index: -1;
}
</style>
