<script setup lang="ts">
import { onMounted } from 'vue';
import { ensureDefaultProfile } from '@/db/seed';

import Background from '@/components/Background.vue';
import Toolbar from '@/components/Toolbar.vue';

onMounted(() => {
  ensureDefaultProfile();
});
</script>
<template>
  <Background />
  <Toolbar />
  <slot />
</template>

<style scoped></style>
