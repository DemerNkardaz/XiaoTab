<script setup lang="ts">
import { computed } from 'vue';
import { useRandomBackground } from '@/composables/useRandomBackground';
import { useUiModeStore } from '@/stores/ui-mode';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const { current } = useRandomBackground();

const uiMode = useUiModeStore();

const style = computed(() => ({
  backgroundImage: current.value ? URL.createObjectURL(current.value.blob) : undefined,
}));
</script>

<template>
  <div class="background" :style="style">
    <div v-if="uiMode.isEditMode" class="background__edit-mode-box">
      <div class="background__edit-mode-box__content">
        <IconBackgrounds class="ico-small" />
        {{ t('background.editModeBox') }}
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.background {
  position: fixed;
  inset: 0;

  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  z-index: 0;

  &__edit-mode-box {
    position: absolute;
    display: flex;
    inset: 1rem;
    justify-content: center;
    padding-block: 5rem;
    border-radius: 1rem;
    border: 0.125rem dashed $accent;
    background-color: alpha($accent, 0.1);
    cursor: pointer;
    transition: background-color 0.1s ease;

    z-index: 1;

    &:hover {
      background-color: alpha($accent, 0.2);
    }

    &:active {
      background-color: alpha($accent, 0.3);
    }

    &__content {
      -webkit-user-select: none;
      user-select: none;
      -webkit-app-region: none;
      pointer-events: none;

      font-size: 1.75rem;
      color: darken($accent, 15%);
    }
  }
}
</style>
