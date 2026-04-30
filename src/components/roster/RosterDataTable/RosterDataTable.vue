<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ApPill } from '@ap-platforms/vue-components'
import { useRosterStore } from '@/stores/roster.store'
import { useCurrency }    from '@/composables/useCurrency'
import type { Employee }  from '@/models/roster'

const store = useRosterStore()
const { formatCurrency } = useCurrency()

type SortKey = keyof Employee
const sortKey = ref<SortKey>('employeeId')
const sortAsc = ref(true)

function toggleSort(key: SortKey) {
  if (sortKey.value === key) { sortAsc.value = !sortAsc.value }
  else { sortKey.value = key; sortAsc.value = true }
}

const sorted = computed(() => {
  return [...store.filteredEmployees].sort((a, b) => {
    const av = a[sortKey.value]; const bv = b[sortKey.value]
    if (av === bv) return 0
    const result = av < bv ? -1 : 1
    return sortAsc.value ? result : -result
  })
})

const PILL_VARIANTS: Record<string, 'green' | 'blue' | 'purple' | 'orange' | 'turquoise' | 'gray'> = {
  Engineering:        'blue',
  Product:            'purple',
  Finance:            'green',
  Management:         'orange',
  Operations:         'turquoise',
  'Customer Service': 'orange',
  'Human Resources':  'turquoise',
}

function pillVariant(fn: string) {
  return PILL_VARIANTS[fn] ?? 'gray'
}

const columns: { key: SortKey; label: string }[] = [
  { key: 'employeeId',  label: 'Emply ID'     },
  { key: 'jobTitle',    label: 'Job title'    },
  { key: 'jobFunction', label: 'Job function' },
  { key: 'seniority',   label: 'Seniority'    },
  { key: 'country',     label: 'Country'      },
  { key: 'salary',      label: 'Salary'       },
  { key: 'taxes',       label: 'Taxes'        },
  { key: 'total',       label: 'Total'        },
]

const isCurrency = (key: SortKey) => ['salary', 'taxes', 'total'].includes(key)
</script>

<template>
  <div class="table-panel" data-testId="roster-table-container">
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr data-testId="roster-table-header-row">
            <th
              v-for="col in columns"
              :key="col.key"
              class="data-table__th"
              :class="{ 'data-table__th--active': sortKey === col.key }"
              @click="toggleSort(col.key)"
            >
              {{ col.label }}
              <span class="sort-icon">{{ sortKey === col.key ? (sortAsc ? '↑' : '↓') : '' }}</span>
            </th>
          </tr>
        </thead>

        <tbody data-testId="roster-table-body">
          <tr
            v-for="(emp, idx) in sorted"
            :key="emp.employeeId"
            class="data-table__row"
            :data-testId="`roster-table-row-${idx}`"
          >
            <td>{{ emp.employeeId }}</td>
            <td>{{ emp.jobTitle }}</td>
            <td>
              <ApPill
                :text="emp.jobFunction"
                :variant="pillVariant(emp.jobFunction)"
                size="small"
                :data-testId="`roster-table-row-${idx}-function-badge`"
              />
            </td>
            <td>{{ emp.seniority }}</td>
            <td>{{ emp.country }}</td>
            <td>{{ formatCurrency(emp.salary) }}</td>
            <td>{{ formatCurrency(emp.taxes) }}</td>
            <td>{{ formatCurrency(emp.total) }}</td>
          </tr>
          <tr v-if="sorted.length === 0">
            <td colspan="8" class="no-results">No results found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-footer" data-testId="roster-table-footer-total-rows">
      Total rows: <strong>{{ store.filteredEmployees.length }}</strong>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table-panel {
  background: ap(white-1);
  border-radius: 6px;
  overflow: hidden;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  &__th {
    padding: 11px 16px;
    text-align: left;
    font-weight: 700;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ap(dark-text);
    background: #F8F8F8;
    border-bottom: 2px solid #EBEBEB;
    cursor: pointer;
    white-space: nowrap;
    user-select: none;

    &:hover { background: ap(background-gray-2); }
    &--active { color: ap(green-4); }
  }

  &__row {
    border-bottom: 1px solid ap(row);

    td {
      padding: 10px 16px;
      color: ap(dark-text);
      white-space: nowrap;
    }

    &:last-child { border-bottom: none; }
    &:hover td  { background: #FAFAFA; }
  }
}

.sort-icon {
  margin-left: 4px;
  opacity: 0.7;
  font-size: 10px;
}

.no-results {
  text-align: center !important;
  color: ap(alix-gray);
  padding: 40px 16px !important;
  font-style: italic;
}

.table-footer {
  padding: 10px 16px;
  font-size: 12px;
  color: ap(alix-gray);
  background: ap(row);
  border-top: 1px solid ap(lines-gray);

  strong { color: ap(black-text); }
}
</style>
