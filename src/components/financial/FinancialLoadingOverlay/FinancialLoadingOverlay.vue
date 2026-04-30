<script lang="ts" setup>
import { ApLoader } from '@ap-platforms/vue-components'
</script>

<template>
  <div class="fin-loading" data-testId="financial-loading-overlay">
    <div class="fin-loading__card">
      <ApLoader />
      <p class="fin-loading__text" data-testId="financial-loading-text">Pulling 10-K...</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fin-loading {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;

  &__card {
    background: ap(white-1);
    border-radius: 8px;
    padding: 40px 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  }

  &__text {
    font-size: 14px;
    font-weight: 500;
    color: ap(dark-text);
    margin: 0;
  }
}
</style>
