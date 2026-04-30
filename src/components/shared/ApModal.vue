<script lang="ts" setup>
defineProps<{ title: string; isOpen: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()
</script>

<template>
  <teleport to="body">
    <div
      v-if="isOpen"
      class="ap-modal-overlay"
      @click.self="emit('close')"
    >
      <div class="ap-modal-dialog" v-bind="$attrs">
        <div class="ap-modal-header">
          <span class="ap-modal-title">{{ title }}</span>
          <button class="ap-modal-close" @click="emit('close')">✕</button>
        </div>
        <div class="ap-modal-body">
          <slot />
        </div>
      </div>
    </div>
  </teleport>
</template>

<style lang="scss" scoped>
.ap-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(51, 51, 51, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
}

.ap-modal-dialog {
  background: ap(white-1);
  border-radius: 8px;
  border: 1px solid ap(lines-gray);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.16);
  width: 520px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
}

.ap-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid ap(lines-gray);
}

.ap-modal-title {
  font-size: 14px;
  font-weight: 600;
  color: ap(black-text);
}

.ap-modal-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: ap(alix-gray);
  padding: 2px 6px;
  border-radius: 4px;
  line-height: 1;

  &:hover { background: ap(background); color: ap(dark-text); }
}

.ap-modal-body {
  padding: 20px;
}
</style>
