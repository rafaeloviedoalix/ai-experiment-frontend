<script lang="ts" setup>
import { ApIcon, ApIconName } from '@ap-platforms/vue-components'
import { useFinancialStore } from '@/stores/financial.store'
import type { EntryMethod }  from '@/models/financial'

const store = useFinancialStore()

const methods: { key: NonNullable<EntryMethod>; icon: ApIconName; title: string; description: string; testId: string }[] = [
  {
    key: 'ticker',
    icon: ApIconName.SEARCH,
    title: 'Search by ticker',
    description: "Fetch the latest 10-K automatically from SEC EDGAR using the company's ticker symbol.",
    testId: 'financial-method-ticker-card',
  },
  {
    key: 'upload',
    icon: ApIconName.IMPORT,
    title: 'Upload 10-K file',
    description: 'Import a PDF of the 10-K. The tool will extract the financial data automatically — or let you fill it in manually if needed.',
    testId: 'financial-method-upload-card',
  },
  {
    key: 'manual',
    icon: ApIconName.EDIT_FILLED,
    title: 'Enter data manually',
    description: 'Type in the financial figures directly. Use this if you already have the numbers on hand.',
    testId: 'financial-method-manual-card',
  },
]
</script>

<template>
  <div class="method-selection" data-testId="financial-method-selection-container">
    <div class="method-selection__panel">
      <h2 class="method-selection__heading">How do you want to pull the 10-K?</h2>
      <div class="method-selection__cards">
        <button
          v-for="m in methods"
          :key="m.key"
          class="method-card"
          :data-testId="m.testId"
          @click="store.openMethodModal(m.key)"
        >
          <div class="method-card__icon-wrap">
            <ApIcon :name="m.icon" class="method-card__icon" />
          </div>
          <h3 class="method-card__title">{{ m.title }}</h3>
          <p  class="method-card__desc">{{ m.description }}</p>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.method-selection {
  flex: 1;
  display: flex;
  flex-direction: column;

  &__panel {
    flex: 1;
    background: ap(white-1);
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 32px;
    min-height: 380px;
    padding: 48px 24px;
  }

  &__heading {
    font-size: 17px;
    font-weight: 700;
    color: ap(black-text);
    margin: 0;
  }

  &__cards {
    display: flex;
    gap: 20px;
    width: 100%;
    max-width: 860px;
  }
}

.method-card {
  flex: 1;
  background: ap(white-1);
  border: 1px solid ap(lines-gray);
  border-radius: 6px;
  padding: 20px;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
  min-height: 189px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &:hover {
    border-color: ap(green-3);
    border-width: 2px;
    box-shadow: 0 2px 8px rgba(73, 142, 43, 0.12);
  }

  &__icon-wrap {
    width: 43px;
    height: 43px;
    border-radius: 8px;
    background: ap(background);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__icon {
    font-size: 22px;
    color: ap(alix-green);
  }

  &__title {
    font-size: 15px;
    font-weight: 500;
    color: ap(black-text);
    margin: 0;
    text-align: left;
  }

  &__desc {
    font-size: 13px;
    color: ap(alix-gray);
    margin: 0;
    line-height: 1.5;
    text-align: left;
  }
}
</style>
