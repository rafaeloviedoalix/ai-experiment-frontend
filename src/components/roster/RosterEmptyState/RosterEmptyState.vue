<script lang="ts" setup>
import { ApPrimaryButton } from '@ap-platforms/vue-components'
import { useRosterStore } from '@/stores/roster.store'

const store = useRosterStore()
</script>

<template>
  <div class="empty-state" data-testId="roster-empty-state">
    <div class="empty-state__card">
      <div class="empty-state__illustration" data-testId="roster-empty-illustration">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="56" fill="#dff0db"/>
          <path d="M38 72V50a4 4 0 014-4h14l6 6h16a4 4 0 014 4v16a4 4 0 01-4 4H42a4 4 0 01-4-4z" fill="#498e2b" opacity=".9"/>
          <path d="M38 58h44" stroke="#5cb335" stroke-width="1.5"/>
          <circle cx="78" cy="44" r="10" fill="#5cb335"/>
          <path d="M78 40v8M74 44h8" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <p class="empty-state__text" data-testId="roster-empty-text">
        Upload a roster to do your analysis
      </p>
      <ApPrimaryButton
        text="Upload roster"
        data-testId="roster-empty-upload-btn"
        @click="store.openModal()"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  &__card {
    background: ap(white-1);
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 60px 48px;
    width: 100%;
  }

  &__illustration { display: flex; }

  &__text {
    font-size: 15px;
    color: ap(black-text);
    margin: 0;
  }
}
</style>
