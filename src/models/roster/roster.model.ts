export interface Employee {
  employeeId: number
  jobTitle: string
  jobFunction: string
  seniority: string
  country: string
  salary: number
  taxes: number
  total: number
}

export interface RosterSummary {
  headcount: number
  countries: number
  totalSalary: number
  totalTaxes: number
  totalLaborSpend: number
}

export interface RosterUploadResponse {
  employees: Employee[]
  summary: RosterSummary
}

export interface RosterApiError {
  error: 'INVALID_FILE_TYPE' | 'FILE_TOO_LARGE' | 'PARSE_ERROR' | 'SERVER_ERROR'
  message: string
}

export interface RosterFilters {
  search: string
  jobFunction: string | null
  seniority: string | null
  country: string | null
}

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'
