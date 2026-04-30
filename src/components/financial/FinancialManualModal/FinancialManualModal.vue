<script lang="ts" setup>
import { ref } from 'vue'
import { ApPrimaryButton, ApSelect } from '@ap-platforms/vue-components'
import ApModal from '@/components/shared/ApModal/ApModal.vue'
import { useFinancialStore } from '@/stores/financial.store'

const store = useFinancialStore()
const year  = ref('')

const yearOptions = (() => {
  const current = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, i) => {
    const y = `FY${current - i}`
    return { label: y, value: String(current - i) }
  })
})()

function onYearChange(val: string | undefined) { year.value = val ?? '' }

function submit() {
  if (!year.value) return
  store.startManualEntry(year.value)
}
</script>

<template>
  <ApModal title="Enter data manually" :is-open="true" @close="store.closeModal()">
    <div class="manual-modal" data-testId="financial-manual-modal">
      <ApSelect
        :model-value="year"
        :items="yearOptions"
        label="10-K year"
        placeholder="Select year"
        item-label="label"
        item-value="value"
        :required="true"
        data-testId="financial-manual-year-select"
        @update:model-value="onYearChange"
      />
      <div class="manual-modal__actions">
        <ApPrimaryButton text="Cancel" variant="cancel" data-testId="financial-manual-cancel-btn" @click="store.closeModal()" />
        <ApPrimaryButton text="Continue" :disabled="!year" data-testId="financial-manual-continue-btn" @click="submit" />
      </div>
    </div>
  </ApModal>
</template>

<style lang="scss" scoped>
.manual-modal {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 320px;

  &__actions {
    display: flex;
    justify-content: center;
    gap: 12px;
  }
}
</style>
