import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { FinancialData, FinancialStatus, EntryMethod, ActiveModal, TickerPayload } from '@/models/financial'
import { fetchByTicker, uploadTenK } from '@/providers/FinancialProvider'

export const useFinancialStore = defineStore('financial', () => {
  const financialData        = ref<FinancialData | null>(null)
  const status               = ref<FinancialStatus>('idle')
  const entryMethod          = ref<EntryMethod>(null)
  const activeModal          = ref<ActiveModal>(null)
  const apiError             = ref<string | null>(null)
  const extractionPreviewUrl = ref<string | null>(null)

  const ebitdaCalculated = computed<number | null>(() => {
    const oi  = financialData.value?.operatingIncome
    const da  = financialData.value?.depreciationAmortization
    if (oi === null && da === null) return null
    return (oi ?? 0) + (da ?? 0)
  })

  const hasData     = computed(() => financialData.value !== null && status.value === 'success')
  const showPreview = computed(() =>
    entryMethod.value === 'upload' && (financialData.value?.previewUrl ?? extractionPreviewUrl.value) !== null
  )

  function openMethodModal(method: EntryMethod) {
    entryMethod.value = method
    activeModal.value = method
    apiError.value    = null
  }

  function openReimportModal() { activeModal.value = 'reimport' }
  function closeModal()        { activeModal.value = null; apiError.value = null }

  async function fetchTicker(payload: TickerPayload) {
    status.value      = 'loading'
    activeModal.value = null
    apiError.value    = null
    try {
      financialData.value = await fetchByTicker(payload)
      status.value        = 'success'
    } catch (err: any) {
      status.value      = 'error'
      apiError.value    = err?.message ?? 'Could not retrieve financial data. Please try again.'
      activeModal.value = 'ticker'
    }
  }

  async function uploadFile(year: string, file: File) {
    status.value      = 'loading'
    activeModal.value = null
    apiError.value    = null
    try {
      financialData.value = await uploadTenK(year, file)
      status.value        = 'success'
    } catch (err: any) {
      if (err?.error === 'EXTRACTION_PARTIAL') {
        extractionPreviewUrl.value = err.previewUrl ?? null
        if (err.partialData) {
          financialData.value = {
            fiscalYear: year, source: 'upload', importedLabel: null,
            totalRevenue: null, revenueSegments: [], operatingIncome: null,
            depreciationAmortization: null, costOfRevenue: null,
            researchDevelopment: null, salesMarketing: null, generalAdmin: null,
            previewUrl: err.previewUrl ?? null,
            ...err.partialData,
          }
        }
        activeModal.value = 'extractionError'
        status.value      = 'extraction_error'
      } else {
        status.value      = 'error'
        apiError.value    = err?.message ?? 'An unexpected error occurred. Please try again.'
        activeModal.value = 'upload'
      }
    }
  }

  function startManualEntry(year: string) {
    financialData.value = {
      fiscalYear: year, source: 'manual', importedLabel: null,
      totalRevenue: null, revenueSegments: [
        { label: 'Segment 1', value: null },
        { label: 'Segment 2', value: null },
        { label: 'Segment 3', value: null },
      ],
      operatingIncome: null, depreciationAmortization: null,
      costOfRevenue: null, researchDevelopment: null,
      salesMarketing: null, generalAdmin: null, previewUrl: null,
    }
    status.value      = 'success'
    activeModal.value = null
  }

  function acceptExtractionError() {
    if (financialData.value) financialData.value.previewUrl = extractionPreviewUrl.value
    else financialData.value = {
      fiscalYear: '', source: 'upload', importedLabel: null,
      totalRevenue: null, revenueSegments: [], operatingIncome: null,
      depreciationAmortization: null, costOfRevenue: null,
      researchDevelopment: null, salesMarketing: null, generalAdmin: null,
      previewUrl: extractionPreviewUrl.value,
    }
    status.value      = 'success'
    activeModal.value = null
  }

  function updateField(field: keyof FinancialData, value: any) {
    if (!financialData.value) return
    ;(financialData.value as any)[field] = value === '' ? null : Number(value)
  }

  function updateRevenueSegment(index: number, value: string) {
    if (!financialData.value) return
    const v = value === '' ? null : Number(value)
    const seg = financialData.value.revenueSegments[index]
    if (!seg) return
    financialData.value.revenueSegments[index] = { label: seg.label, value: v }
  }

  function reset() {
    financialData.value = null; status.value = 'idle'
    entryMethod.value = null; activeModal.value = null
    apiError.value = null; extractionPreviewUrl.value = null
  }

  return {
    financialData, status, entryMethod, activeModal, apiError, extractionPreviewUrl,
    ebitdaCalculated, hasData, showPreview,
    openMethodModal, openReimportModal, closeModal,
    fetchTicker, uploadFile, startManualEntry, acceptExtractionError,
    updateField, updateRevenueSegment, reset,
  }
})
