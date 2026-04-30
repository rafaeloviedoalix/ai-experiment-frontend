<script lang="ts" setup>
import { computed } from 'vue'
import { ApInput } from '@ap-platforms/vue-components'
import { useFinancialStore } from '@/stores/financial.store'

const store = useFinancialStore()
const data  = computed(() => store.financialData)

function onField(field: string, val: string | number) {
  store.updateField(field as any, String(val))
}

function onSegment(idx: number, val: string | number) {
  store.updateRevenueSegment(idx, String(val))
}
</script>

<template>
  <div v-if="data" class="fin-form" data-testId="financial-data-form">
    <div class="fin-table__thead">
      <div class="fin-col-label">Field</div>
      <div class="fin-col-value">Value</div>
    </div>

    <!-- Total revenue -->
    <div class="fin-table__row fin-table__row--bold">
      <div class="fin-col-label">Total revenue</div>
      <div class="fin-col-value">
        <ApInput
          :model-value="data.totalRevenue !== null ? String(data.totalRevenue) : ''"
          label=""
          type="number"
          placeholder="0"
          data-testId="financial-field-total-revenue-input"
          @update:model-value="onField('totalRevenue', $event)"
        />
      </div>
    </div>

    <!-- Revenue breakdown -->
    <div class="fin-table__section" data-testId="financial-section-revenue-breakdown">
      Revenue breakdown
    </div>
    <div
      v-for="(seg, idx) in data.revenueSegments"
      :key="idx"
      class="fin-table__row"
    >
      <div class="fin-col-label">{{ seg.label }}</div>
      <div class="fin-col-value">
        <ApInput
          :model-value="seg.value !== null ? String(seg.value) : ''"
          label=""
          :name="`revenue-segment-${idx}`"
          type="number"
          placeholder="0"
          :data-testId="`financial-field-revenue-segment-${idx}-input`"
          @update:model-value="onSegment(idx, $event)"
        />
      </div>
    </div>

    <!-- EBITDA -->
    <div class="fin-table__section" data-testId="financial-section-ebitda">
      EBITDA
    </div>
    <div class="fin-table__row">
      <div class="fin-col-label">Operating income</div>
      <div class="fin-col-value">
        <ApInput
          :model-value="data.operatingIncome !== null ? String(data.operatingIncome) : ''"
          label=""
          type="number"
          placeholder="0"
          data-testId="financial-field-operating-income-input"
          @update:model-value="onField('operatingIncome', $event)"
        />
      </div>
    </div>
    <div class="fin-table__row">
      <div class="fin-col-label">Depreciation &amp; amortization</div>
      <div class="fin-col-value">
        <ApInput
          :model-value="data.depreciationAmortization !== null ? String(data.depreciationAmortization) : ''"
          label=""
          type="number"
          placeholder="0"
          data-testId="financial-field-depreciation-input"
          @update:model-value="onField('depreciationAmortization', $event)"
        />
      </div>
    </div>
    <div class="fin-table__row fin-table__row--calculated">
      <div class="fin-col-label">EBITDA (calculated)</div>
      <div class="fin-col-value">
        <ApInput
          :model-value="store.ebitdaCalculated !== null ? String(store.ebitdaCalculated) : ''"
          label=""
          :is-disabled="true"
          placeholder="—"
          data-testId="financial-field-ebitda-calculated-display"
        />
      </div>
    </div>

    <!-- Total expenses -->
    <div class="fin-table__section" data-testId="financial-section-total-expenses">
      Total expenses
    </div>
    <div class="fin-table__row">
      <div class="fin-col-label">Cost of revenue</div>
      <div class="fin-col-value">
        <ApInput
          :model-value="data.costOfRevenue !== null ? String(data.costOfRevenue) : ''"
          label=""
          type="number"
          placeholder="0"
          data-testId="financial-field-cost-of-revenue-input"
          @update:model-value="onField('costOfRevenue', $event)"
        />
      </div>
    </div>
    <div class="fin-table__row">
      <div class="fin-col-label">Research &amp; development</div>
      <div class="fin-col-value">
        <ApInput
          :model-value="data.researchDevelopment !== null ? String(data.researchDevelopment) : ''"
          label=""
          type="number"
          placeholder="0"
          data-testId="financial-field-rd-input"
          @update:model-value="onField('researchDevelopment', $event)"
        />
      </div>
    </div>
    <div class="fin-table__row">
      <div class="fin-col-label">Sales &amp; marketing</div>
      <div class="fin-col-value">
        <ApInput
          :model-value="data.salesMarketing !== null ? String(data.salesMarketing) : ''"
          label=""
          type="number"
          placeholder="0"
          data-testId="financial-field-sales-marketing-input"
          @update:model-value="onField('salesMarketing', $event)"
        />
      </div>
    </div>
    <div class="fin-table__row">
      <div class="fin-col-label">General &amp; administrative</div>
      <div class="fin-col-value">
        <ApInput
          :model-value="data.generalAdmin !== null ? String(data.generalAdmin) : ''"
          label=""
          type="number"
          placeholder="0"
          data-testId="financial-field-general-admin-input"
          @update:model-value="onField('generalAdmin', $event)"
        />
      </div>
    </div>

  </div>
</template>

<style lang="scss" scoped>
.fin-form {
  background: ap(white-1);
  border-radius: 6px;
  overflow: hidden;
  flex: 1;
}

.fin-table {
  &__thead {
    display: flex;
    align-items: center;
    background: #F8F8F8;
    border-bottom: 2px solid #EBEBEB;
    padding: 10px 20px;

    .fin-col-label, .fin-col-value {
      font-weight: 700;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: ap(dark-text);
    }
  }

  &__section {
    padding: 8px 20px;
    background: ap(black-2);
    color: ap(white-1);
    font-size: 13px;
    font-weight: 700;
  }

  &__row {
    display: flex;
    align-items: center;
    padding: 6px 20px;
    border-bottom: 1px solid ap(row);

    &:last-child { border-bottom: none; }
    &--calculated { background: ap(background); }
    &--bold .fin-col-label { font-weight: 700; }
  }
}

.fin-col-label {
  flex: 1;
  font-size: 13px;
  color: ap(dark-text);
  padding-right: 16px;
}

.fin-col-value {
  width: 280px;
  flex-shrink: 0;
}
</style>
