<script lang="ts" setup>
import { computed } from 'vue'
import { ApSelect, ApPill } from '@ap-platforms/vue-components'
import AppLayout                      from '@/components/shared/AppLayout/AppLayout.vue'
import FinancialMethodSelection       from '@/components/financial/FinancialMethodSelection/FinancialMethodSelection.vue'
import FinancialTickerModal           from '@/components/financial/FinancialTickerModal/FinancialTickerModal.vue'
import FinancialUploadModal           from '@/components/financial/FinancialUploadModal/FinancialUploadModal.vue'
import FinancialManualModal           from '@/components/financial/FinancialManualModal/FinancialManualModal.vue'
import FinancialReimportModal         from '@/components/financial/FinancialReimportModal/FinancialReimportModal.vue'
import FinancialExtractionErrorModal  from '@/components/financial/FinancialExtractionErrorModal/FinancialExtractionErrorModal.vue'
import FinancialLoadingOverlay        from '@/components/financial/FinancialLoadingOverlay/FinancialLoadingOverlay.vue'
import FinancialDataForm              from '@/components/financial/FinancialDataForm/FinancialDataForm.vue'
import FinancialPreviewPanel          from '@/components/financial/FinancialPreviewPanel/FinancialPreviewPanel.vue'
import { useFinancialStore }          from '@/stores/financial.store'

const store = useFinancialStore()

const showSplitLayout = computed(() => store.hasData && store.showPreview)
const showFormOnly    = computed(() => store.hasData && !store.showPreview)

const yearOptions = computed(() => {
  const current = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, i) => ({
    label: `FY${current - i}`,
    value: String(current - i),
  }))
})
</script>

<template>
  <AppLayout>

    <!-- Modals & overlays -->
    <FinancialLoadingOverlay      v-if="store.status === 'loading'" />
    <FinancialTickerModal         v-if="store.activeModal === 'ticker'" />
    <FinancialUploadModal         v-if="store.activeModal === 'upload'" />
    <FinancialManualModal         v-if="store.activeModal === 'manual'" />
    <FinancialReimportModal       v-if="store.activeModal === 'reimport'" />
    <FinancialExtractionErrorModal v-if="store.activeModal === 'extractionError'" />

    <!-- Entry point — no data yet -->
    <FinancialMethodSelection v-if="!store.hasData && store.status !== 'loading'" />

    <!-- Loaded: split layout (upload path with PDF preview) -->
    <div v-if="showSplitLayout" class="split-layout">
      <div class="split-layout__preview">
        <FinancialPreviewPanel />
      </div>
      <div class="split-layout__form">
        <div class="form-controls">
          <ApSelect
            :model-value="store.financialData?.fiscalYear ?? ''"
            :items="yearOptions"
            label=""
            item-label="label"
            item-value="value"
            placeholder="Year"
            :is-disabled="true"
            data-testId="financial-year-select"
          />
          <ApPill
            v-if="store.financialData?.importedLabel"
            :text="`Imported from: ${store.financialData.importedLabel}`"
            variant="green"
            data-testId="financial-imported-badge"
          />
        </div>
        <FinancialDataForm />
      </div>
    </div>

    <!-- Loaded: form only (ticker or manual) -->
    <div v-if="showFormOnly" class="form-layout">
      <div class="form-controls">
        <ApSelect
          :model-value="store.financialData?.fiscalYear ?? ''"
          :items="yearOptions"
          label=""
          item-label="label"
          item-value="value"
          placeholder="Year"
          :is-disabled="true"
          data-testId="financial-year-select"
        />
        <ApPill
          v-if="store.financialData?.importedLabel"
          :text="`Imported from: ${store.financialData.importedLabel}`"
          variant="green"
          data-testId="financial-imported-badge"
        />
      </div>
      <FinancialDataForm />
    </div>

  </AppLayout>
</template>

<style lang="scss" scoped>
.split-layout {
  display: flex;
  gap: 24px;
  align-items: stretch;
  height: calc(100vh - 200px);

  &__preview, &__form {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-height: 0;
  }
}

.form-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 800px;
}

.form-controls {
  display: flex;
  align-items: center;
  gap: 12px;

  > :first-child { width: 200px; flex-shrink: 0; }
}
</style>
