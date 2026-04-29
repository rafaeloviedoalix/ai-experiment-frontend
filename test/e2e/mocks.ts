import type { Page } from '@playwright/test'

export const ROSTER_RESPONSE_200 = {
  employees: [
    { employeeId: 1, jobTitle: 'Chief Technology Officer', jobFunction: 'Engineering', seniority: 'VP+', country: 'United States', salary: 160000, taxes: 40000, total: 200000 },
    { employeeId: 2, jobTitle: 'Product Manager', jobFunction: 'Product', seniority: 'Manager', country: 'United States', salary: 80000, taxes: 20000, total: 100000 },
    { employeeId: 3, jobTitle: 'Finance Manager', jobFunction: 'Finance', seniority: 'Manager', country: 'Argentina', salary: 64000, taxes: 16000, total: 80000 },
    { employeeId: 4, jobTitle: 'Financial Analyst', jobFunction: 'Finance', seniority: 'Staff', country: 'Argentina', salary: 48000, taxes: 12000, total: 60000 },
    { employeeId: 5, jobTitle: 'Backend Engineer', jobFunction: 'Engineering', seniority: 'Staff', country: 'United States', salary: 80000, taxes: 20000, total: 100000 },
  ],
  summary: {
    headcount: 5,
    countries: 2,
    totalSalary: 432000,
    totalTaxes: 108000,
    totalLaborSpend: 540000,
  },
}

export const ROSTER_RESPONSE_400 = {
  error: 'INVALID_FILE_TYPE',
  message: 'Only .xls and .xlsx files are accepted.',
}

export const ROSTER_RESPONSE_413 = {
  error: 'FILE_TOO_LARGE',
  message: 'File exceeds 15 MB limit.',
}

export const ROSTER_RESPONSE_422 = {
  error: 'PARSE_ERROR',
  message: 'Could not parse the file. Verify columns: Employee ID, Job Title, Job Function, Seniority, Country, Fully Loaded Cost.',
}

// v2: year in FY format, form values as comma-formatted strings, no revenueSegments
export const FINANCIAL_TICKER_RESPONSE_200 = {
  year: 'FY2024',
  source: 'ticker',
  ticker: 'MSFT',
  form: {
    totalRevenue: '245,122',
    operatingIncome: '109,433',
    depreciationAmortization: '14,392',
    ebitdaCalculated: '123,825',
    costOfRevenue: '74,114',
    researchDevelopment: '29,510',
    salesMarketing: '23,687',
    generalAdmin: '7,575',
  },
}

export const FINANCIAL_UPLOAD_RESPONSE_200 = {
  year: 'FY2024',
  source: 'upload',
  fileName: 'sample_10k.pdf',
  form: {
    totalRevenue: '245,122',
    operatingIncome: '109,433',
    depreciationAmortization: '14,392',
    ebitdaCalculated: '123,825',
    costOfRevenue: '74,114',
    researchDevelopment: '29,510',
    salesMarketing: '23,687',
    generalAdmin: '7,575',
  },
}

export const FINANCIAL_RESPONSE_404 = {
  error: 'NOT_FOUND',
  message: 'No 10-K found for ZZZZ on NYSE for FY2024.',
}

// v2: no previewUrl — frontend creates blob URL from the file object directly
export const FINANCIAL_RESPONSE_206 = {
  error: 'EXTRACTION_PARTIAL',
  message: 'Could not extract all fields automatically.',
  partialForm: {
    totalRevenue: '',
    operatingIncome: '',
    depreciationAmortization: '',
    ebitdaCalculated: '',
    costOfRevenue: '',
    researchDevelopment: '',
    salesMarketing: '',
    generalAdmin: '',
  },
}

export async function mockRosterUpload(page: Page, status: 200 | 400 | 413 | 422 = 200) {
  const bodies: Record<number, object> = {
    200: ROSTER_RESPONSE_200,
    400: ROSTER_RESPONSE_400,
    413: ROSTER_RESPONSE_413,
    422: ROSTER_RESPONSE_422,
  }
  await page.route('**/api/roster/upload', route =>
    route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(bodies[status]) })
  )
}

export async function mockFinancialTicker(page: Page, status: 200 | 404 = 200) {
  const bodies: Record<number, object> = {
    200: FINANCIAL_TICKER_RESPONSE_200,
    404: FINANCIAL_RESPONSE_404,
  }
  await page.route('**/api/financial/ticker', route =>
    route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(bodies[status]) })
  )
}

export async function mockFinancialUpload(page: Page, status: 200 | 206 = 200) {
  const bodies: Record<number, object> = {
    200: FINANCIAL_UPLOAD_RESPONSE_200,
    206: FINANCIAL_RESPONSE_206,
  }
  await page.route('**/api/financial/upload', route =>
    route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(bodies[status]) })
  )
}
