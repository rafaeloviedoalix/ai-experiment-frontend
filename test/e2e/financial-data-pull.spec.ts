import { test, expect } from '@playwright/test'
import { AppPage } from './pages/AppPage'
import { FinancialPage } from './pages/FinancialPage'
import { mockFinancialTicker, mockFinancialUpload } from './mocks'

const SAMPLE_PDF = 'test/e2e/fixtures/sample_10k.pdf'

test.describe('Financial Data Pull', () => {
  let app: AppPage
  let financial: FinancialPage

  test.beforeEach(async ({ page }) => {
    app = new AppPage(page)
    financial = new FinancialPage(page)
    await app.goto()
    await app.navigateToFinancial()
  })

  // TC-016 / AC-F01
  test('method selection screen shown on first visit', async () => {
    await expect(financial.methodSelectionContainer).toBeVisible()
    await expect(financial.tickerCard).toBeVisible()
    await expect(financial.uploadCard).toBeVisible()
    await expect(financial.manualCard).toBeVisible()
  })

  // TC-017 / AC-F02 — submit disabled until all 3 fields filled
  test('ticker modal — submit disabled until all 3 fields filled', async () => {
    await financial.tickerCard.click()

    await expect(financial.tickerModal).toBeVisible()
    await expect(financial.tickerSubmitBtn).toBeDisabled()

    await financial.tickerYearSelect.selectOption('FY2024')
    await expect(financial.tickerSubmitBtn).toBeDisabled()

    await financial.tickerSymbolInput.fill('MSFT')
    await expect(financial.tickerSubmitBtn).toBeDisabled()

    await financial.tickerExchangeInput.fill('NASDAQ')
    await expect(financial.tickerSubmitBtn).toBeEnabled()
  })

  // TC-017 / AC-F03 — submit triggers loading overlay
  test('ticker modal — submit shows loading overlay with correct text', async ({ page }) => {
    await mockFinancialTicker(page, 200)
    await financial.fillTickerForm('FY2024', 'MSFT', 'NASDAQ')
    await financial.tickerSubmitBtn.click()

    await expect(financial.loadingOverlay).toBeVisible()
    await expect(financial.loadingText).toContainText('Pulling 10-K...')
  })

  // TC-018 / AC-F04 — ticker 200: fields auto-populated, imported tag with ticker name
  test('ticker 200 — fields auto-populated and imported tag shows ticker', async ({ page }) => {
    await mockFinancialTicker(page, 200)
    await financial.fetchByTicker('FY2024', 'MSFT', 'NASDAQ')

    await expect(financial.fieldTotalRevenue).not.toBeEmpty()
    await expect(financial.importedTag).toBeVisible()
    await expect(financial.importedTag).toContainText('MSFT')
    await expect(financial.importedTag).toContainText('FY2024')
    await expect(financial.fieldEbitdaDisplay).not.toBeEmpty()
  })

  // TC-019 — ticker 404
  test('ticker 404 — error message shown to user', async ({ page }) => {
    await mockFinancialTicker(page, 404)
    await financial.fillTickerForm('FY2024', 'ZZZZ', 'NYSE')
    await financial.tickerSubmitBtn.click()

    await expect(financial.loadingOverlay).not.toBeVisible()
    await expect(financial.tickerModal.page().getByText(/No 10-K found/i)).toBeVisible()
  })

  // AC-F05 — warning banner when year matches already loaded data
  test('ticker modal — warning banner shown when year matches loaded data', async ({ page }) => {
    await mockFinancialTicker(page, 200)
    await financial.fetchByTicker('FY2024', 'MSFT', 'NASDAQ')

    await app.clickCta()
    await financial.replaceTickerCard.click()
    await financial.replaceContinueBtn.click()

    await financial.tickerYearSelect.selectOption('FY2024')

    await expect(financial.tickerWarningBanner).toBeVisible()
  })

  // TC-020 / AC-F06 — upload modal rejects non-PDF
  test('upload modal — non-PDF file is rejected', async () => {
    await financial.uploadCard.click()

    await expect(financial.uploadModal).toBeVisible()
    await expect(financial.uploadSubmitBtn).toBeDisabled()

    await financial.uploadDropzone.dispatchEvent('drop', {
      dataTransfer: { files: [{ name: 'roster.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }] },
    })

    await expect(financial.uploadSubmitBtn).toBeDisabled()
  })

  // TC-020 / AC-F07 — PDF upload 206: extraction error modal
  test('PDF upload 206 — extraction error modal appears', async ({ page }) => {
    await mockFinancialUpload(page, 206)
    await financial.uploadPdf(SAMPLE_PDF, 'FY2024')

    await expect(financial.extractionErrorModal).toBeVisible()
    await expect(financial.extractionErrorBanner).toBeVisible()
    await expect(financial.extractionErrorContinueBtn).toBeVisible()
    await expect(financial.extractionErrorCancelBtn).toBeVisible()
  })

  // TC-021 / AC-F08 — continue from extraction error: preview panel + empty fields
  test('continue from extraction error — preview panel visible and fields empty', async ({ page }) => {
    await mockFinancialUpload(page, 206)
    await financial.uploadPdf(SAMPLE_PDF, 'FY2024')
    await expect(financial.extractionErrorModal).toBeVisible()

    await financial.extractionErrorContinueBtn.click()

    await expect(financial.previewPanel).toBeVisible()
    await expect(financial.previewPanelTitle).toContainText('10-K File preview')
    await expect(financial.fieldTotalRevenue).toBeEmpty()
    await expect(financial.fieldTotalRevenue).toBeEditable()
  })

  // TC-022 — enter manually: year modal then empty form
  test('enter manually — continue disabled until year selected, then empty editable form', async () => {
    await financial.manualCard.click()

    await expect(financial.manualModal).toBeVisible()
    await expect(financial.manualContinueBtn).toBeDisabled()

    await financial.manualYearSelect.selectOption('FY2024')
    await expect(financial.manualContinueBtn).toBeEnabled()
    await financial.manualContinueBtn.click()

    await expect(financial.fieldTotalRevenue).toBeEmpty()
    await expect(financial.fieldTotalRevenue).toBeEditable()
  })

  // AC-F14 — manual tag shows "Entered manually · FY{year}"
  test('manual entry — imported tag shows "Entered manually" variant', async () => {
    await financial.enterManually('FY2024')

    await expect(financial.importedTag).toBeVisible()
    await expect(financial.importedTag).toContainText('Entered manually')
    await expect(financial.importedTag).toContainText('FY2024')
  })

  // TC-023 — total revenue field accepts manual input
  test('total revenue field accepts manual input', async () => {
    await financial.enterManually('FY2024')
    await financial.fillField('totalRevenue', '100,000')
    await financial.fieldTotalRevenue.press('Tab')

    await expect(financial.fieldTotalRevenue).toHaveValue('100,000')
  })

  // TC-024 / AC-F09 — EBITDA auto-calculates
  test('EBITDA auto-calculates as operating income + D&A', async () => {
    await financial.enterManually('FY2024')
    await financial.fillField('operatingIncome', '490,000')
    await financial.fillField('depreciation', '122,500')

    await expect(financial.fieldEbitdaDisplay).toHaveValue('612,500')
  })

  // TC-024 edge case — one field empty: sum treating empty as 0
  test('EBITDA shows partial sum when one field is empty', async () => {
    await financial.enterManually('FY2024')
    await financial.fillField('operatingIncome', '490,000')

    await expect(financial.fieldEbitdaDisplay).toHaveValue('490,000')
  })

  // TC-024 edge case — both fields empty: EBITDA is empty string
  test('EBITDA is empty when both income fields are empty', async () => {
    await financial.enterManually('FY2024')

    await expect(financial.fieldEbitdaDisplay).toHaveValue('')
  })

  // TC-025 / AC-F10 — EBITDA field is read-only
  test('EBITDA calculated field is disabled', async () => {
    await financial.enterManually('FY2024')

    await expect(financial.fieldEbitdaDisplay).toBeDisabled()
  })

  // TC-026 — auto-extracted field is editable
  test('auto-extracted field is editable after ticker fetch', async ({ page }) => {
    await mockFinancialTicker(page, 200)
    await financial.fetchByTicker('FY2024', 'MSFT', 'NASDAQ')

    await financial.fieldTotalRevenue.clear()
    await financial.fieldTotalRevenue.fill('999,999')

    await expect(financial.fieldTotalRevenue).toHaveValue('999,999')
  })

  // TC-027 / AC-F11 — re-import modal shows cards, continue disabled until card selected
  test('re-import modal — shows cards and continue disabled until card selected', async ({ page }) => {
    await mockFinancialTicker(page, 200)
    await financial.fetchByTicker('FY2024', 'MSFT', 'NASDAQ')

    await app.clickCta()

    await expect(financial.replaceModal).toBeVisible()
    await expect(financial.replaceTickerCard).toBeVisible()
    await expect(financial.replaceUploadCard).toBeVisible()
    await expect(financial.replaceManualCard).toBeVisible()
    await expect(financial.replaceContinueBtn).toBeDisabled()
  })

  // TC-027 / AC-F12 — selecting a card enables continue
  test('re-import modal — selecting a card enables continue button', async ({ page }) => {
    await mockFinancialTicker(page, 200)
    await financial.fetchByTicker('FY2024', 'MSFT', 'NASDAQ')

    await app.clickCta()
    await financial.replaceUploadCard.click()

    await expect(financial.replaceContinueBtn).toBeEnabled()
  })

  // TC-028 — data persists when switching tabs
  test('financial data persists when switching tabs', async () => {
    await financial.enterManually('FY2024')
    await financial.fillField('totalRevenue', '100,000')

    await app.navigateToRoster()
    await app.navigateToFinancial()

    await expect(financial.fieldTotalRevenue).toHaveValue('100,000')
  })

  // AC-F13 — empty year state when year changed to one without data
  test('changing year to one without data shows empty year state', async ({ page }) => {
    await mockFinancialTicker(page, 200)
    await financial.fetchByTicker('FY2024', 'MSFT', 'NASDAQ')

    await financial.changeYear('FY2022')

    await expect(financial.emptyYearState).toBeVisible()
    await expect(financial.emptyYearText).toContainText('No 10K available for the selected year.')
    await expect(financial.formContainer).not.toBeVisible()
  })
})
