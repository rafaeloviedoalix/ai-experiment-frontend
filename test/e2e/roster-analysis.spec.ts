import { test, expect } from '@playwright/test'
import { AppPage } from './pages/AppPage'
import { RosterPage } from './pages/RosterPage'
import { mockRosterUpload } from './mocks'

const SAMPLE_XLSX = 'test/e2e/fixtures/sample_roster.xlsx'

test.describe('Roster Analysis', () => {
  let app: AppPage
  let roster: RosterPage

  test.beforeEach(async ({ page }) => {
    app = new AppPage(page)
    roster = new RosterPage(page)
    await app.goto()
  })

  // TC-001
  test('empty state shown on first load', async () => {
    await expect(roster.uploadBtn).toBeVisible()
    await expect(roster.uploadBtn.page().getByText('Upload a roster to do your analysis')).toBeVisible()
  })

  // TC-002
  test('upload modal opens from empty state button and from CTA', async () => {
    await roster.openUploadModal()
    await expect(roster.uploadModal).toBeVisible()
    await expect(roster.uploadConfirmBtn).toBeDisabled()

    await roster.uploadModalCloseBtn.click()
    await expect(roster.uploadModal).not.toBeVisible()

    await app.clickCta()
    await expect(roster.uploadModal).toBeVisible()
  })

  // TC-003
  test('valid .xlsx staged — staged file row appears and confirm enables', async () => {
    await roster.openUploadModal()
    await roster.stageFile(SAMPLE_XLSX)

    await expect(roster.stagedFileRow).toBeVisible()
    await expect(roster.stagedFileName).toContainText('sample_roster.xlsx')
    await expect(roster.stagedFileSize).toBeVisible()
    await expect(roster.uploadConfirmBtn).toBeEnabled()
  })

  // TC-004
  test('delete staged file disables confirm button', async () => {
    await roster.openUploadModal()
    await roster.stageFile(SAMPLE_XLSX)
    await expect(roster.uploadConfirmBtn).toBeEnabled()

    await roster.deleteStaged()

    await expect(roster.stagedFileRow).not.toBeVisible()
    await expect(roster.uploadConfirmBtn).toBeDisabled()
  })

  // TC-005
  test('upload success — loading overlay then table appears', async ({ page }) => {
    await mockRosterUpload(page, 200)
    await roster.uploadRoster(SAMPLE_XLSX)

    await expect(roster.loadingOverlay).toBeVisible()
    await expect(roster.loadingText).toContainText('Uploading roster...')
    await expect(roster.tableContainer).toBeVisible()
    await expect(roster.loadingOverlay).not.toBeVisible()
  })

  // TC-006
  test('KPI cards show correct unfiltered totals', async ({ page }) => {
    await mockRosterUpload(page, 200)
    await roster.uploadRoster(SAMPLE_XLSX)
    await expect(roster.tableContainer).toBeVisible()

    await expect(roster.kpiHeadcount).toContainText('5')
    await expect(roster.kpiCountries).toContainText('2')
    await expect(roster.kpiLaborSpend).toBeVisible()
  })

  // TC-007
  test('KPI cards stay unfiltered when table filter is applied', async ({ page }) => {
    await mockRosterUpload(page, 200)
    await roster.uploadRoster(SAMPLE_XLSX)
    await expect(roster.tableContainer).toBeVisible()

    const headcountBefore = await roster.kpiHeadcount.textContent()
    await roster.filterByFunction('Finance')

    await expect(roster.kpiHeadcount).toHaveText(headcountBefore!)
  })

  // TC-008
  test('filter by seniority shows only matching rows', async ({ page }) => {
    await mockRosterUpload(page, 200)
    await roster.uploadRoster(SAMPLE_XLSX)
    await expect(roster.tableContainer).toBeVisible()

    await roster.filterBySeniority('Manager')

    const rows = roster.tableBody.locator('[data-testid^="roster-table-row-"]')
    const count = await rows.count()
    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i)).toContainText('Manager')
    }
  })

  // TC-009
  test('filter by country shows only matching rows', async ({ page }) => {
    await mockRosterUpload(page, 200)
    await roster.uploadRoster(SAMPLE_XLSX)
    await expect(roster.tableContainer).toBeVisible()

    await roster.filterByCountry('Argentina')

    const rows = roster.tableBody.locator('[data-testid^="roster-table-row-"]')
    const count = await rows.count()
    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i)).toContainText('Argentina')
    }
  })

  // TC-010
  test('search bar filters table instantly by job title', async ({ page }) => {
    await mockRosterUpload(page, 200)
    await roster.uploadRoster(SAMPLE_XLSX)
    await expect(roster.tableContainer).toBeVisible()

    await roster.search('Financial')

    const rows = roster.tableBody.locator('[data-testid^="roster-table-row-"]')
    const count = await rows.count()
    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i)).toContainText('Financial')
    }
  })

  // TC-011
  test('multiple filters apply as AND logic', async ({ page }) => {
    await mockRosterUpload(page, 200)
    await roster.uploadRoster(SAMPLE_XLSX)
    await expect(roster.tableContainer).toBeVisible()

    await roster.filterByFunction('Finance')
    await roster.filterBySeniority('Manager')

    const rows = roster.tableBody.locator('[data-testid^="roster-table-row-"]')
    const count = await rows.count()
    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i)).toContainText('Finance')
      await expect(rows.nth(i)).toContainText('Manager')
    }
  })

  // TC-012
  test('invalid file type shows 400 error banner', async ({ page }) => {
    await mockRosterUpload(page, 400)
    await roster.openUploadModal()
    await roster.stageInlineFile({ name: 'doc.pdf', mimeType: 'application/pdf', buffer: Buffer.from('fake') })

    await expect(roster.uploadErrorBanner).toBeVisible()
    await expect(roster.uploadConfirmBtn).toBeDisabled()
  })

  // TC-013
  test('file exceeding 15 MB shows 413 error banner', async ({ page }) => {
    await mockRosterUpload(page, 413)
    await roster.uploadRoster(SAMPLE_XLSX)

    await expect(roster.uploadErrorBanner).toBeVisible()
    await expect(roster.uploadErrorBanner).toContainText('15 MB')
  })

  // TC-014
  test('missing required columns shows 422 parse error banner', async ({ page }) => {
    await mockRosterUpload(page, 422)
    await roster.uploadRoster(SAMPLE_XLSX)

    await expect(roster.uploadModal).toBeVisible()
    await expect(roster.uploadErrorBanner).toBeVisible()
    await expect(roster.uploadErrorBanner).toContainText('Fully Loaded Cost')
  })

  // TC-015
  test('uploading a new roster replaces existing data', async ({ page }) => {
    await mockRosterUpload(page, 200)
    await roster.uploadRoster(SAMPLE_XLSX)
    await expect(roster.tableContainer).toBeVisible()

    await app.clickCta()
    await expect(roster.uploadModal).toBeVisible()
    await roster.stageFile(SAMPLE_XLSX)
    await roster.confirmUpload()

    await expect(roster.tableContainer).toBeVisible()
  })
})
