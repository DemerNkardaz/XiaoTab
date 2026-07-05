import { ref, watch, type Ref } from 'vue';
import { useActiveBackgrounds } from './useActiveBackgrounds';
import { pickRandomExcluding } from '@/utils/random';
import type { BackgroundRecord } from '@/db/types';

export function useRandomBackground() {
  const { backgrounds } = useActiveBackgrounds();
  const current: Ref<BackgroundRecord | undefined> = ref(undefined);

  watch(
    backgrounds,
    (list) => {
      if (current.value && list.some((bg) => bg.id === current.value?.id)) return;
      current.value = pickRandomExcluding(list, current.value);
    },
    { immediate: true }
  );

  function reroll() {
    current.value = pickRandomExcluding(backgrounds.value, current.value);
  }

  return { current, reroll };
}
