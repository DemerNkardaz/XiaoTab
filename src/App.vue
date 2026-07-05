<script setup lang="ts">
import { onMounted } from 'vue';
import { ensureDefaultProfile } from '@/db/seed';

onMounted(() => {
  ensureDefaultProfile();
});
</script>
<template>

</template>

<style scoped></style>
