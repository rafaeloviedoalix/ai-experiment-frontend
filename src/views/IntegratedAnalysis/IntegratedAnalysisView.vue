<script lang="ts" setup>
import { computed } from 'vue'
import { ApSelect, ApPrimaryButton } from '@ap-platforms/vue-components'
import AppLayout         from '@/components/shared/AppLayout/AppLayout.vue'
import { useRosterStore }    from '@/stores/roster.store'
import { useFinancialStore } from '@/stores/financial.store'

const rosterStore    = useRosterStore()
const financialStore = useFinancialStore()

const missingRoster    = computed(() => !rosterStore.hasData)
const missingFinancial = computed(() => !financialStore.hasData)
const hasAll           = computed(() => !missingRoster.value && !missingFinancial.value)

const emptyMessage = computed(() => {
  if (missingRoster.value && missingFinancial.value)
    return 'Upload a roster and add financial data to get started.'
  if (missingRoster.value)
    return 'Upload a roster file to see the workforce analysis.'
  return 'Add financial data to complete the analysis.'
})

const emptyLink = computed(() => {
  if (missingRoster.value) return { label: '→ Go to Roster Analysis', route: '/roster' }
  return { label: '→ Go to Financial Data Pull', route: '/financial' }
})

const functionOptions = computed(() => [
  { label: 'All', value: '' },
  ...rosterStore.availableJobFunctions.map((v) => ({ label: v, value: v })),
])
const seniorityOptions = computed(() => [
  { label: 'All', value: '' },
  ...rosterStore.availableSeniorities.map((v) => ({ label: v, value: v })),
])
const countryOptions = computed(() => [
  { label: 'All', value: '' },
  ...rosterStore.availableCountries.map((v) => ({ label: v, value: v })),
])
const yearOptions = computed(() => {
  const current = new Date().getFullYear()
  return [
    { label: 'All', value: '' },
    ...Array.from({ length: 5 }, (_, i) => ({ label: `FY${current - i}`, value: String(current - i) })),
  ]
})
</script>

<template>
  <AppLayout>

    <!-- Empty state -->
    <div v-if="!hasAll" class="integrated-empty" data-testId="integrated-empty-state">
      <div class="integrated-empty__card">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="36" fill="#dff0db"/>
          <path d="M24 52V34a3 3 0 013-3h10l4 4h12a3 3 0 013 3v14a3 3 0 01-3 3H27a3 3 0 01-3-3z" fill="#498e2b" opacity=".9"/>
          <path d="M24 42h32" stroke="#5cb335" stroke-width="1.2"/>
          <rect x="49" y="26" width="14" height="14" rx="7" fill="#5cb335"/>
          <path d="M56 30v6M53 33h6" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <p class="integrated-empty__text">{{ emptyMessage }}</p>
        <router-link :to="emptyLink.route" class="integrated-empty__link">
          {{ emptyLink.label }}
        </router-link>
      </div>
    </div>

    <!-- Content when both datasets available -->
    <div v-if="hasAll" class="integrated-content">

      <div class="filter-bar" data-testId="integrated-filter-bar">
        <ApSelect
          :items="functionOptions"
          label=""
          item-label="label"
          item-value="value"
          placeholder="Job function"
          data-testId="integrated-filter-function-select"
        />
        <ApSelect
          :items="seniorityOptions"
          label=""
          item-label="label"
          item-value="value"
          placeholder="Seniority"
          data-testId="integrated-filter-seniority-select"
        />
        <ApSelect
          :items="countryOptions"
          label=""
          item-label="label"
          item-value="value"
          placeholder="Country"
          data-testId="integrated-filter-country-select"
        />
        <ApSelect
          :items="yearOptions"
          label=""
          item-label="label"
          item-value="value"
          placeholder="Year"
          data-testId="integrated-filter-year-select"
        />
        <ApPrimaryButton text="Apply filters" data-testId="integrated-apply-filters-btn" />
        <ApPrimaryButton text="Import filters" variant="cancel" :disabled="true" data-testId="integrated-import-filters-btn" />
        <ApPrimaryButton text="Save filters"   variant="cancel" :disabled="true" data-testId="integrated-save-filters-btn" />
      </div>

      <div class="chart-placeholder" data-testId="integrated-pyramid-section">
        <p>Headcount pyramids — coming next iteration</p>
      </div>
      <div class="chart-placeholder" data-testId="integrated-composition-section">
        <p>Workforce composition — coming next iteration</p>
      </div>
      <div class="chart-placeholder" data-testId="integrated-revlabor-section">
        <p>Revenue vs. Labor Spend — coming next iteration</p>
      </div>

    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
.integrated-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  &__card {
    background: ap(white-1);
    border-radius: 6px;
    padding: 60px 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    width: 100%;
  }

  &__text {
    font-size: 15px;
    color: ap(black-text);
    margin: 0;
    text-align: center;
  }

  &__link {
    font-size: 13px;
    color: ap(green-4);
    font-weight: 600;
    text-decoration: none;

    &:hover { text-decoration: underline; }
  }
}

.integrated-content { display: flex; flex-direction: column; gap: 24px; }

.filter-bar {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  flex-wrap: wrap;

  > * { flex: 1; min-width: 140px; }
}

.chart-placeholder {
  background: ap(white-1);
  border: 1px dashed ap(lines-gray);
  border-radius: 6px;
  padding: 48px;
  text-align: center;
  color: ap(alix-gray);
  font-size: 13px;

  p { margin: 0; }
}
</style>
