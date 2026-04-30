import axios from 'axios'
import type { FinancialData, FinancialApiError, TickerPayload } from '@/models/financial'

const USE_MOCK = true
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

const MOCK_FINANCIAL: FinancialData = {
  fiscalYear: '2024',
  source: 'ticker',
  importedLabel: '10-K FY2024',
  totalRevenue: 211915,
  revenueSegments: [
    { label: 'Intelligent Cloud',       value: 105361 },
    { label: 'Productivity & Business', value: 77698  },
    { label: 'More Personal Computing', value: 28856  },
  ],
  operatingIncome: 88523,
  depreciationAmortization: 15369,
  costOfRevenue: 65863,
  researchDevelopment: 29510,
  salesMarketing: 24456,
  generalAdmin: 7575,
  previewUrl: null,
}

export async function fetchByTicker(payload: TickerPayload): Promise<FinancialData> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 2000))
    return { ...MOCK_FINANCIAL, fiscalYear: payload.year, importedLabel: `10-K FY${payload.year}`, source: 'ticker' }
  }
  try {
    const { data } = await axios.post<FinancialData>(`${BASE_URL}/api/financial/ticker`, payload)
    return data
  } catch (err: any) {
    const apiError: FinancialApiError = err?.response?.data ?? {
      error: 'SERVER_ERROR',
      message: 'An unexpected error occurred. Please try again.',
    }
    throw apiError
  }
}

export async function uploadTenK(year: string, file: File): Promise<FinancialData> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 2000))
    if (Math.random() < 0.3) {
      const err: FinancialApiError = {
        error: 'EXTRACTION_PARTIAL',
        message: 'We were unable to extract the data from this file.',
        previewUrl: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/sample.pdf',
        partialData: { fiscalYear: year, totalRevenue: 211915 },
      }
      throw err
    }
    return { ...MOCK_FINANCIAL, fiscalYear: year, importedLabel: `10-K FY${year}`, source: 'upload', previewUrl: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/sample.pdf' }
  }
  const formData = new FormData()
  formData.append('year', year)
  formData.append('file', file)
  try {
    const { data } = await axios.post<FinancialData>(`${BASE_URL}/api/financial/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  } catch (err: any) {
    const apiError: FinancialApiError = err?.response?.data ?? {
      error: 'SERVER_ERROR',
      message: 'An unexpected error occurred. Please try again.',
    }
    throw apiError
  }
}
