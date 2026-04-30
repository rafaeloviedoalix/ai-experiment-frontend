<script lang="ts" setup>
import { ref } from 'vue'
import { ApPrimaryButton, ApIcon, ApIconName } from '@ap-platforms/vue-components'
import ApModal from '@/components/shared/ApModal/ApModal.vue'
import { useFinancialStore } from '@/stores/financial.store'
import type { EntryMethod }  from '@/models/financial'

const store    = useFinancialStore()
const selected = ref<NonNullable<EntryMethod>>('ticker')

const options: { label: string; value: NonNullable<EntryMethod>; icon: ApIconName; description: string; testId: string }[] = [
  {
    label: 'Search by ticker',
    value: 'ticker',
    icon: ApIconName.SEARCH,
    description: "Fetch the latest 10-K automatically from SEC EDGAR using the company's ticker symbol.",
    testId: 'financial-reimport-ticker-card',
  },
  {
    label: 'Upload 10-K file',
    value: 'upload',
    icon: ApIconName.IMPORT,
    description: 'Import a file of the 10-K. The tool will extract the financial data automatically.',
    testId: 'financial-reimport-upload-card',
  },
  {
    label: 'Enter data manually',
    value: 'manual',
    icon: ApIconName.EDIT_FILLED,
    description: 'Type in the financial figures directly.',
    testId: 'financial-reimport-manual-card',
  },
]

function proceed() {
  store.openMethodModal(selected.value)
}
</script>

<template>
  <ApModal title="Upload 10-K" :is-open="true" data-testId="financial-reimport-modal" @close="store.closeModal()">
    <div class="reimport-modal">
      <div class="reimport-cards">
        <div
          v-for="opt in options"
          :key="opt.value"
          class="reimport-card"
          :class="{ 'reimport-card--selected': selected === opt.value }"
          :data-testId="opt.testId"
          @click="selected = opt.value"
        >
          <div class="reimport-card__icon-wrap">
            <ApIcon :name="opt.icon" class="reimport-card__icon" />
          </div>
          <p class="reimport-card__title">{{ opt.label }}</p>
          <p class="reimport-card__desc">{{ opt.description }}</p>
        </div>
      </div>

      <div class="reimport-modal__actions">
        <ApPrimaryButton text="Cancel" variant="cancel" data-testId="financial-reimport-cancel-btn" @click="store.closeModal()" />
        <ApPrimaryButton text="Continue" data-testId="financial-reimport-continue-btn" @click="proceed" />
      </div>
    </div>
  </ApModal>
</template>

<style lang="scss" scoped>
.reimport-modal {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 500px;

  &__actions {
    display: flex;
    justify-content: center;
    gap: 12px;
    padding-top: 4px;
  }
}

.reimport-cards {
  display: flex;
  gap: 12px;
}

.reimport-card {
  flex: 1;
  background: ap(white-1);
  border: 1px solid ap(lines-gray);
  border-radius: 6px;
  padding: 16px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color 0.15s;

  &:hover { border-color: ap(green-3); }

  &--selected {
    border-color: ap(green-3);
    border-width: 2px;
    background: ap(green-1);
  }

  &__icon-wrap {
    width: 36px;
    height: 36px;
    border-radius: 6px;
    background: ap(background);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__icon {
    font-size: 18px;
    color: ap(alix-green);
  }

  &__title {
    font-size: 13px;
    font-weight: 600;
    color: ap(black-text);
    margin: 0;
  }

  &__desc {
    font-size: 12px;
    color: ap(alix-gray);
    margin: 0;
    line-height: 1.4;
  }
}
</style>
