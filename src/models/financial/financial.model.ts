export interface RevenueSegment {
  label: string
  value: number | null
}

export interface FinancialData {
  fiscalYear: string
  source: 'ticker' | 'upload' | 'manual'
  importedLabel: string | null
  totalRevenue: number | null
  revenueSegments: RevenueSegment[]
  operatingIncome: number | null
  depreciationAmortization: number | null
  costOfRevenue: number | null
  researchDevelopment: number | null
  salesMarketing: number | null
  generalAdmin: number | null
  previewUrl: string | null
}

export interface FinancialApiError {
  error: 'NOT_FOUND' | 'EXTRACTION_FAILED' | 'EXTRACTION_PARTIAL' | 'PARSE_ERROR' | 'SERVER_ERROR'
  message: string
  previewUrl?: string
  partialData?: Partial<FinancialData>
}

export type FinancialStatus = 'idle' | 'loading' | 'success' | 'extraction_error' | 'error'
export type EntryMethod = 'ticker' | 'upload' | 'manual' | null
export type ActiveModal = 'ticker' | 'upload' | 'manual' | 'reimport' | 'extractionError' | null

export interface TickerPayload {
  year: string
  ticker: string
  exchange: string
}
