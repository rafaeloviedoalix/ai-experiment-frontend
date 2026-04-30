import { test, expect } from '@playwright/test'
import { AppPage } from './pages/AppPage'
import { RosterPage } from './pages/RosterPage'
import { FinancialPage } from './pages/FinancialPage'
import { IntegratedPage } from './pages/IntegratedPage'
import { mockRosterUpload, mockFinancialTicker } from './mocks'

const SAMPLE_XLSX = 'test/e2e/fixtures/sample_roster.xlsx'

async function loadRoster(app: AppPage, roster: RosterPage, page: import('@playwright/test').Page) {
  await mockRosterUpload(page, 200)
  await app.navigateToRoster()
  await roster.uploadRoster(SAMPLE_XLSX)
  await expect(roster.tableContainer).toBeVisible()
}

async function loadFinancials(app: AppPage, financial: FinancialPage, page: import('@playwright/test').Page) {
  await mockFinancialTicker(page, 200)
  await app.navigateToFinancial()
  await financial.fetchByTicker('FY2024', 'MSFT', 'NASDAQ')
}

test.describe('Integrated Analysis', () => {
  let app: AppPage
  let roster: RosterPage
  let financial: FinancialPage
  let integrated: IntegratedPage

  test.beforeEach(async ({ page }) => {
    app = new AppPage(page)
    roster = new RosterPage(page)
    financial = new FinancialPage(page)
    integrated = new IntegratedPage(page)
    await app.goto()
  })

  // TC-029 — missing roster
  test('shows missing roster message when no roster uploaded', async ({ page }) => {
    await app.navigateToFinancial()
    await financial.enterManually('FY2024')
    await financial.fillField('totalRevenue', '100,000')

    await app.navigateToIntegrated()

    await expect(integrated.pyramidSection.page().getByText(/roster/i)).toBeVisible()
    await expect(roster.tableContainer).not.toBeVisible()
  })

  // TC-030 — missing financial data
  test('shows missing financial data message when no financials entered', async ({ page }) => {
    await loadRoster(app, roster, page)

    await app.navigateToIntegrated()

    await expect(integrated.pyramidSection.page().getByText(/financial/i)).toBeVisible()
    await expect(integrated.pyramidSection).not.toBeVisible()
  })

  // TC-031 — all 3 charts render when both datasets loaded
  test('all 3 charts render when both datasets loaded', async ({ page }) => {
    await loadRoster(app, roster, page)
    await loadFinancials(app, financial, page)

    await app.navigateToIntegrated()

    await expect(integrated.pyramidSection).toBeVisible()
    await expect(integrated.pyramidCustomerService).toBeVisible()
    await expect(integrated.pyramidGoToMarket).toBeVisible()
    await expect(integrated.pyramidRd).toBeVisible()
    await expect(integrated.pyramidGa).toBeVisible()
    await expect(integrated.compositionChart).toBeVisible()
    await expect(integrated.revLaborChart).toBeVisible()
  })

  // TC-032 — headcount pyramid shows seniority levels
  test('headcount pyramid shows seniority levels', async ({ page }) => {
    await loadRoster(app, roster, page)
    await loadFinancials(app, financial, page)
    await app.navigateToIntegrated()

    await expect(integrated.pyramidCustomerService).toBeVisible()
    await expect(integrated.pyramidCustomerService.getByText(/VP\+|Head|Director|Manager|Other/)).toBeVisible()
  })

  // TC-033 — target company marker visible
  test('target company marker visible in Revenue vs. Labor Spend chart', async ({ page }) => {
    await loadRoster(app, roster, page)
    await loadFinancials(app, financial, page)
    await app.navigateToIntegrated()

    await expect(integrated.revLaborSection).toBeVisible()
    await expect(integrated.revLaborTargetMarker).toBeVisible()
  })

  // TC-034 — apply filters updates all 3 charts
  test('apply filters updates all 3 charts', async ({ page }) => {
    await loadRoster(app, roster, page)
    await loadFinancials(app, financial, page)
    await app.navigateToIntegrated()

    await expect(integrated.pyramidSection).toBeVisible()

    await integrated.applyFilters({ function: 'Engineering' })

    await expect(integrated.pyramidSection).toBeVisible()
    await expect(integrated.compositionChart).toBeVisible()
    await expect(integrated.revLaborChart).toBeVisible()
  })
})
