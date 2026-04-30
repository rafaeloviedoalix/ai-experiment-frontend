<script lang="ts" setup>
import { ApIcon } from '@ap-platforms/vue-components'
import { useRosterStore } from '@/stores/roster.store'
import { useCurrency }    from '@/composables/useCurrency'

const store = useRosterStore()
const { formatCurrency } = useCurrency()
</script>

<template>
  <div class="kpi-row" data-testId="roster-kpi-cards">

    <div class="kpi-card">
      <div class="kpi-card__icon-wrap">
        <ApIcon name="ap-icon-job" class="kpi-card__icon" />
      </div>
      <div class="kpi-card__text">
        <span class="kpi-card__label" data-testId="roster-kpi-headcount-label">Headcount</span>
        <span class="kpi-card__value" data-testId="roster-kpi-headcount-value">
          {{ store.summary?.headcount ?? '—' }}
        </span>
      </div>
    </div>

    <div class="kpi-card">
      <div class="kpi-card__icon-wrap">
        <ApIcon name="ap-icon-direction" class="kpi-card__icon" />
      </div>
      <div class="kpi-card__text">
        <span class="kpi-card__label" data-testId="roster-kpi-countries-label">Countries</span>
        <span class="kpi-card__value" data-testId="roster-kpi-countries-value">
          {{ store.summary?.countries ?? '—' }}
        </span>
      </div>
    </div>

    <div class="kpi-card">
      <div class="kpi-card__icon-wrap">
        <ApIcon name="ap-icon-financial-filled" class="kpi-card__icon" />
      </div>
      <div class="kpi-card__text">
        <span class="kpi-card__label" data-testId="roster-kpi-salary-label">Salary</span>
        <span class="kpi-card__value" data-testId="roster-kpi-salary-value">
          {{ formatCurrency(store.summary?.totalSalary) }}
        </span>
      </div>
    </div>

    <div class="kpi-card">
      <div class="kpi-card__icon-wrap">
        <ApIcon name="ap-icon-document" class="kpi-card__icon" />
      </div>
      <div class="kpi-card__text">
        <span class="kpi-card__label" data-testId="roster-kpi-taxes-label">Taxes</span>
        <span class="kpi-card__value" data-testId="roster-kpi-taxes-value">
          {{ formatCurrency(store.summary?.totalTaxes) }}
        </span>
      </div>
    </div>

    <div class="kpi-card kpi-card--accent">
      <div class="kpi-card__icon-wrap kpi-card__icon-wrap--accent">
        <ApIcon name="ap-icon-financial" class="kpi-card__icon" />
      </div>
      <div class="kpi-card__text">
        <span class="kpi-card__label" data-testId="roster-kpi-laborspend-label">Total labor spend</span>
        <span class="kpi-card__value" data-testId="roster-kpi-laborspend-value">
          {{ formatCurrency(store.summary?.totalLaborSpend) }}
        </span>
      </div>
    </div>

  </div>
</template>

<style lang="scss" scoped>
.kpi-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.kpi-card {
  flex: 1;
  background: ap(white-1);
  border-radius: 6px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 14px;

  &--accent {
    background: ap(green-1);
    border: 1px solid ap(green-2);
  }

  &__icon-wrap {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: ap(background);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &--accent { background: #ddf0cc; }
  }

  &__icon {
    font-size: 20px;
    color: ap(alix-green);
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ap(alix-gray);
  }

  &__value {
    font-size: 22px;
    font-weight: 700;
    color: ap(black-text);
    line-height: 1;
  }
}
</style>
