<script lang="ts" setup>
import { ApInput, ApSelect } from '@ap-platforms/vue-components'
import { useRosterStore } from '@/stores/roster.store'

const store = useRosterStore()

const ALL_OPTION = { label: 'All', value: '' }

const functionOptions  = () => [ALL_OPTION, ...store.availableJobFunctions.map((v) => ({ label: v, value: v }))]
const seniorityOptions = () => [ALL_OPTION, ...store.availableSeniorities.map((v)  => ({ label: v, value: v }))]
const countryOptions   = () => [ALL_OPTION, ...store.availableCountries.map((v)    => ({ label: v, value: v }))]

function onSearch(val: string | number)    { store.setFilter('search',      String(val)) }
function onFunction(val: string | undefined)  { store.setFilter('jobFunction', val || null) }
function onSeniority(val: string | undefined) { store.setFilter('seniority',   val || null) }
function onCountry(val: string | undefined)   { store.setFilter('country',     val || null) }
</script>

<template>
  <div class="filter-bar">
    <div class="filter-bar__search">
      <ApInput
        :model-value="store.filters.search"
        placeholder="Search..."
        label=""
        data-testId="roster-search-input"
        @update:model-value="onSearch"
      />
    </div>

    <ApSelect
      :model-value="store.filters.jobFunction ?? ''"
      :items="functionOptions()"
      label=""
      item-label="label"
      item-value="value"
      placeholder="Job function"
      data-testId="roster-filter-function-select"
      @update:model-value="onFunction"
    />

    <ApSelect
      :model-value="store.filters.seniority ?? ''"
      :items="seniorityOptions()"
      label=""
      item-label="label"
      item-value="value"
      placeholder="Seniority"
      data-testId="roster-filter-seniority-select"
      @update:model-value="onSeniority"
    />

    <ApSelect
      :model-value="store.filters.country ?? ''"
      :items="countryOptions()"
      label=""
      item-label="label"
      item-value="value"
      placeholder="Country"
      data-testId="roster-filter-country-select"
      @update:model-value="onCountry"
    />
  </div>
</template>

<style lang="scss" scoped>
.filter-bar {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  margin-bottom: 16px;

  > * { flex: 1; }

  &__search { max-width: 240px; }
}
</style>
