<script setup lang="ts">
import { useUiModeStore } from '@/stores/ui-mode';

const uiMode = useUiModeStore();
</script>

<template>
  <div class="toolbar" :class="{ '--on-edit': uiMode.isEditMode }">
    <button @click="uiMode.toggle">
      <IconSettings class="ico-small" :class="{ '--on-edit': uiMode.isEditMode }" />
    </button>
  </div>
</template>

<style lang="scss">
.toolbar {
  position: fixed;
  top: 0;
  right: 0;
  opacity: 0.05;
  transition: opacity 0.1s ease;

  z-index: 1000;

  -webkit-user-select: none;
  user-select: none;

  display: flex;
  justify-content: flex-end;
  padding: 1rem;

  button {
    border: none;
    padding: 1rem;
    cursor: pointer;
    font-size: 1.25rem;
  }

  &:hover,
  &.--on-edit {
    opacity: 1;
  }
}
</style>
