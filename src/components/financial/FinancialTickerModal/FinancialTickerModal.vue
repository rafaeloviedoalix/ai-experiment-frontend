<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ApPrimaryButton, ApInput, ApSelect, ApInfoBanner } from '@ap-platforms/vue-components'
import ApModal from '@/components/shared/ApModal/ApModal.vue'
import { useFinancialStore } from '@/stores/financial.store'

const store = useFinancialStore()

const year     = ref('')
const ticker   = ref('')
const exchange = ref('')

const yearOptions = (() => {
  const current = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, i) => {
    const y = `FY${current - i}`
    return { label: y, value: String(current - i) }
  })
})()

const isReady = computed(() => year.value && ticker.value.trim() && exchange.value.trim())

function onTickerInput(val: string | number) { ticker.value = String(val).toUpperCase() }
function onYearChange(val: string | undefined) { year.value = val ?? '' }

async function submit() {
  if (!isReady.value) return
  await store.fetchTicker({ year: year.value, ticker: ticker.value.trim(), exchange: exchange.value.trim() })
}
</script>

<template>
  <ApModal title="Search by ticker" :is-open="true" @close="store.closeModal()">
    <div class="ticker-modal" data-testId="financial-ticker-modal">

      <ApInfoBanner
        v-if="store.apiError"
        type="error"
        :text="store.apiError"
        data-testId="financial-ticker-error-banner"
      />

      <ApSelect
        :model-value="year"
        :items="yearOptions"
        label="10-K year"
        placeholder="Select year"
        item-label="label"
        item-value="value"
        :required="true"
        data-testId="financial-ticker-year-select"
        @update:model-value="onYearChange"
      />

      <ApInput
        :model-value="ticker"
        label="Ticker"
        placeholder="e.g. MSFT"
        :required="true"
        data-testId="financial-ticker-symbol-input"
        @update:model-value="onTickerInput"
      />

      <ApInput
        v-model="exchange"
        label="Exchange"
        placeholder="e.g. NASDAQ"
        :required="true"
        data-testId="financial-ticker-exchange-input"
      />

      <div class="ticker-modal__actions">
        <ApPrimaryButton
          text="Cancel"
          variant="cancel"
          data-testId="financial-ticker-cancel-btn"
          @click="store.closeModal()"
        />
        <ApPrimaryButton
          text="Pull 10-K"
          :disabled="!isReady"
          data-testId="financial-ticker-submit-btn"
          @click="submit"
        />
      </div>
    </div>
  </ApModal>
</template>

<style lang="scss" scoped>
.ticker-modal {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 320px;

  &__actions {
    display: flex;
    justify-content: center;
    gap: 12px;
    padding-top: 4px;
  }
}
</style>
