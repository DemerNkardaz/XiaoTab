import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type UiMode = 'view' | 'edit';

export const useUiModeStore = defineStore('uiMode', () => {
  const mode = ref<UiMode>('view');

  const isEditMode = computed(() => mode.value === 'edit');
  const isViewMode = computed(() => mode.value === 'view');

  function enterEditMode() {
    mode.value = 'edit';
  }

  function enterViewMode() {
    mode.value = 'view';
  }

  function toggle() {
    mode.value = mode.value === 'view' ? 'edit' : 'view';
  }

  return { mode, isEditMode, isViewMode, enterEditMode, enterViewMode, toggle };
});
