import axios from 'axios'
import type { RosterUploadResponse, RosterApiError } from '@/models/roster'

const USE_MOCK = true
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

const MOCK_RESPONSE: RosterUploadResponse = {
  employees: [
    { employeeId: 6,  jobTitle: 'Chief Technology Officer', jobFunction: 'Engineering',      seniority: 'VP+',      country: 'United States', salary: 160000, taxes: 40000,  total: 200000 },
    { employeeId: 7,  jobTitle: 'Product Manager',          jobFunction: 'Product',          seniority: 'Manager',  country: 'United States', salary: 80000,  taxes: 20000,  total: 100000 },
    { employeeId: 8,  jobTitle: 'Product Analyst',          jobFunction: 'Product',          seniority: 'Manager',  country: 'United States', salary: 80000,  taxes: 20000,  total: 100000 },
    { employeeId: 9,  jobTitle: 'Engineering Lead',         jobFunction: 'Engineering',      seniority: 'Senior',   country: 'United States', salary: 100000, taxes: 25000,  total: 125000 },
    { employeeId: 10, jobTitle: 'Backend Engineer',         jobFunction: 'Engineering',      seniority: 'Senior',   country: 'United States', salary: 90000,  taxes: 22500,  total: 112500 },
    { employeeId: 11, jobTitle: 'Managing Director',        jobFunction: 'Management',       seniority: 'Director', country: 'Argentina',     salary: 120000, taxes: 30000,  total: 150000 },
    { employeeId: 12, jobTitle: 'Finance Manager',          jobFunction: 'Finance',          seniority: 'Manager',  country: 'Argentina',     salary: 70000,  taxes: 17500,  total: 87500  },
    { employeeId: 13, jobTitle: 'Senior Financial Analyst', jobFunction: 'Finance',          seniority: 'Senior',   country: 'Argentina',     salary: 60000,  taxes: 15000,  total: 75000  },
    { employeeId: 14, jobTitle: 'Financial Analyst',        jobFunction: 'Finance',          seniority: 'Staff',    country: 'Argentina',     salary: 50000,  taxes: 12500,  total: 62500  },
    { employeeId: 15, jobTitle: 'Operations Lead',          jobFunction: 'Operations',       seniority: 'Senior',   country: 'Argentina',     salary: 60000,  taxes: 15000,  total: 75000  },
    { employeeId: 16, jobTitle: 'CS Team Lead',             jobFunction: 'Customer Service', seniority: 'Head',     country: 'United States', salary: 110000, taxes: 27500,  total: 137500 },
    { employeeId: 17, jobTitle: 'Support Specialist',       jobFunction: 'Customer Service', seniority: 'Staff',    country: 'United States', salary: 45000,  taxes: 11250,  total: 56250  },
  ],
  summary: {
    headcount: 12,
    countries: 2,
    totalSalary: 1025000,
    totalTaxes: 256250,
    totalLaborSpend: 1281250,
  },
}

export async function uploadRoster(file: File): Promise<RosterUploadResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 1500))
    return MOCK_RESPONSE
  }
  const formData = new FormData()
  formData.append('file', file)
  try {
    const { data } = await axios.post<RosterUploadResponse>(
      `${BASE_URL}/api/roster/upload`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return data
  } catch (err: any) {
    const apiError: RosterApiError = err?.response?.data ?? {
      error: 'SERVER_ERROR',
      message: 'An unexpected error occurred. Please try again.',
    }
    throw apiError
  }
}
