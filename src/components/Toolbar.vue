<script setup lang="ts">
import { useUiModeStore } from '@/stores/ui-mode';

const uiMode = useUiModeStore();
</script>

<template>
  <div class="toolbar">
    <button @click="uiMode.toggle">
      {{ uiMode.isEditMode ? 'Готово' : 'Редактировать' }}
    </button>
  </div>
</template>

<style lang="scss">
.toolbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  -webkit-user-select: none;
  user-select: none;

  display: flex;
  justify-content: flex-end;
  padding: 1rem;

  button {
    background-color: rgba(255, 255, 255, 0.8);
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 16px;
  }
  user-select: none;

  button {
    background-color: rgba(255, 255, 255, 0.8);
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 16px;
  }
}
</style>
