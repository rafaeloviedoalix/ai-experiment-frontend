<script lang="ts" setup>
import { computed } from 'vue'
import { useFinancialStore } from '@/stores/financial.store'

const store = useFinancialStore()
const url   = computed(() => store.financialData?.previewUrl ?? store.extractionPreviewUrl)
</script>

<template>
  <div class="preview-panel" data-testId="financial-preview-panel">
    <div class="preview-panel__header" data-testId="financial-preview-panel-title">
      10-K File preview
    </div>
    <div class="preview-panel__frame">
      <iframe
        v-if="url"
        :src="url"
        class="preview-panel__iframe"
        data-testId="financial-preview-document"
        title="10-K document preview"
      />
      <div v-else class="preview-panel__empty">No preview available</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.preview-panel {
  background: ap(white-1);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;

  &__header {
    padding: 12px 16px;
    font-size: 13px;
    font-weight: 700;
    color: ap(black-text);
    border-bottom: 1px solid ap(lines-gray);
    flex-shrink: 0;
  }

  &__frame {
    flex: 1;
    overflow: hidden;
    min-height: 500px;
  }

  &__iframe {
    width: 100%;
    height: 100%;
    min-height: 500px;
    border: none;
    display: block;
  }

  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 500px;
    color: ap(alix-gray);
    font-size: 13px;
  }
}
</style>
