import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Employee, RosterSummary, RosterFilters, UploadStatus } from '@/models/roster'
import { uploadRoster } from '@/providers/RosterProvider'

export const useRosterStore = defineStore('roster', () => {
  const employees    = ref<Employee[]>([])
  const summary      = ref<RosterSummary | null>(null)
  const uploadStatus = ref<UploadStatus>('idle')
  const uploadError  = ref<string | null>(null)
  const isModalOpen  = ref(false)

  const filters = ref<RosterFilters>({
    search: '', jobFunction: null, seniority: null, country: null,
  })

  const filteredEmployees = computed<Employee[]>(() => {
    let result = employees.value
    if (filters.value.search) {
      const q = filters.value.search.toLowerCase()
      result = result.filter((e) => e.jobTitle.toLowerCase().includes(q))
    }
    if (filters.value.jobFunction) result = result.filter((e) => e.jobFunction === filters.value.jobFunction)
    if (filters.value.seniority)   result = result.filter((e) => e.seniority   === filters.value.seniority)
    if (filters.value.country)     result = result.filter((e) => e.country     === filters.value.country)
    return result
  })

  const SENIORITY_ORDER = ['VP+', 'Head', 'Director', 'Manager', 'Senior', 'Staff', 'Other']

  const availableJobFunctions = computed(() => [...new Set(employees.value.map((e) => e.jobFunction))].sort())
  const availableSeniorities  = computed(() => {
    const distinct = [...new Set(employees.value.map((e) => e.seniority))]
    return distinct.sort((a, b) => {
      const ai = SENIORITY_ORDER.indexOf(a); const bi = SENIORITY_ORDER.indexOf(b)
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
    })
  })
  const availableCountries = computed(() => [...new Set(employees.value.map((e) => e.country))].sort())
  const hasData            = computed(() => employees.value.length > 0)

  function openModal()  { uploadError.value = null; isModalOpen.value = true  }
  function closeModal() { uploadError.value = null; isModalOpen.value = false }

  async function upload(file: File) {
    uploadStatus.value = 'uploading'
    isModalOpen.value  = false
    try {
      const res          = await uploadRoster(file)
      employees.value    = res.employees
      summary.value      = res.summary
      uploadStatus.value = 'success'
      uploadError.value  = null
    } catch (err: any) {
      uploadStatus.value = 'error'
      uploadError.value  = err?.message ?? 'An unexpected error occurred. Please try again.'
      isModalOpen.value  = true
    }
  }

  function setFilter(key: keyof RosterFilters, value: string | null) {
    ;(filters.value as any)[key] = value
  }

  function resetFilters() {
    filters.value = { search: '', jobFunction: null, seniority: null, country: null }
  }

  function clearRoster() {
    employees.value = []; summary.value = null
    uploadStatus.value = 'idle'; uploadError.value = null
    isModalOpen.value = false; resetFilters()
  }

  return {
    employees, summary, uploadStatus, uploadError, isModalOpen, filters,
    filteredEmployees, availableJobFunctions, availableSeniorities, availableCountries, hasData,
    openModal, closeModal, upload, setFilter, resetFilters, clearRoster,
  }
})
