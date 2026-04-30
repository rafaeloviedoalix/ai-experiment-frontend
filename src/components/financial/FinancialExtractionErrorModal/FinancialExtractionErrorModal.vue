<script lang="ts" setup>
import { ApPrimaryButton, ApInfoBanner } from '@ap-platforms/vue-components'
import ApModal from '@/components/shared/ApModal/ApModal.vue'
import { useFinancialStore } from '@/stores/financial.store'

const store = useFinancialStore()
</script>

<template>
  <ApModal title="Extraction error" :is-open="true" data-testId="financial-extraction-error-modal" @close="store.closeModal()">
    <div class="extraction-error">
      <ApInfoBanner
        type="warning"
        text="We were unable to extract the data from this file. To proceed, you will need to enter the financial data manually. A preview of the document will be displayed alongside the fields for reference."
        data-testId="financial-extraction-error-banner"
      />

      <div class="extraction-error__actions">
        <ApPrimaryButton
          text="Cancel"
          variant="cancel"
          data-testId="financial-extraction-error-cancel-btn"
          @click="store.reset()"
        />
        <ApPrimaryButton
          text="Continue"
          data-testId="financial-extraction-error-continue-btn"
          @click="store.acceptExtractionError()"
        />
      </div>
    </div>
  </ApModal>
</template>

<style lang="scss" scoped>
.extraction-error {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 460px;

  &__actions {
    display: flex;
    justify-content: center;
    gap: 12px;
  }
}
</style>
