import type { Page } from '@playwright/test'

export class FinancialPage {
  constructor(private page: Page) {}

  // --- Method selection ---
  get methodSelectionContainer() { return this.page.getByTestId('financial-method-selection-container') }
  get tickerCard()               { return this.page.getByTestId('financial-method-ticker-card') }
  get uploadCard()               { return this.page.getByTestId('financial-method-upload-card') }
  get manualCard()               { return this.page.getByTestId('financial-method-manual-card') }

  // --- Ticker modal ---
  get tickerModal()              { return this.page.getByTestId('financial-ticker-modal') }
  get tickerYearSelect()         { return this.page.getByTestId('financial-ticker-year-select') }
  get tickerSymbolInput()        { return this.page.getByTestId('financial-ticker-symbol-input') }
  get tickerExchangeInput()      { return this.page.getByTestId('financial-ticker-exchange-input') }
  get tickerWarningBanner()      { return this.page.getByTestId('financial-ticker-warning-banner') }
  get tickerCancelBtn()          { return this.page.getByTestId('financial-ticker-cancel-btn') }
  get tickerSubmitBtn()          { return this.page.getByTestId('financial-ticker-submit-btn') }

  // --- Upload modal ---
  get uploadModal()              { return this.page.getByTestId('financial-upload-modal') }
  get uploadYearSelect()         { return this.page.getByTestId('financial-upload-year-select') }
  get uploadDropzone()           { return this.page.getByTestId('financial-upload-dropzone') }
  get uploadWarningBanner()      { return this.page.getByTestId('financial-upload-warning-banner') }
  get uploadCancelBtn()          { return this.page.getByTestId('financial-upload-cancel-btn') }
  get uploadSubmitBtn()          { return this.page.getByTestId('financial-upload-submit-btn') }

  // --- Manual modal ---
  get manualModal()              { return this.page.getByTestId('financial-manual-modal') }
  get manualYearSelect()         { return this.page.getByTestId('financial-manual-year-select') }
  get manualWarningBanner()      { return this.page.getByTestId('financial-manual-warning-banner') }
  get manualCancelBtn()          { return this.page.getByTestId('financial-manual-cancel-btn') }
  get manualContinueBtn()        { return this.page.getByTestId('financial-manual-continue-btn') }

  // --- Replace (re-import) modal ---
  get replaceModal()             { return this.page.getByTestId('financial-replace-modal') }
  get replaceTickerCard()        { return this.page.getByTestId('financial-replace-ticker-card') }
  get replaceUploadCard()        { return this.page.getByTestId('financial-replace-upload-card') }
  get replaceManualCard()        { return this.page.getByTestId('financial-replace-manual-card') }
  get replaceCancelBtn()         { return this.page.getByTestId('financial-replace-cancel-btn') }
  get replaceContinueBtn()       { return this.page.getByTestId('financial-replace-continue-btn') }

  // --- Loading overlay ---
  get loadingOverlay()           { return this.page.getByTestId('financial-loading-overlay') }
  get loadingText()              { return this.page.getByTestId('financial-loading-text') }

  // --- Extraction error modal ---
  get extractionErrorModal()     { return this.page.getByTestId('financial-extraction-error-modal') }
  get extractionErrorBanner()    { return this.page.getByTestId('financial-extraction-error-banner') }
  get extractionErrorCancelBtn() { return this.page.getByTestId('financial-extraction-error-cancel-btn') }
  get extractionErrorContinueBtn() { return this.page.getByTestId('financial-extraction-error-continue-btn') }

  // --- Loaded state controls ---
  get yearSelect()               { return this.page.getByTestId('financial-year-select') }
  get importedTag()              { return this.page.getByTestId('financial-imported-tag') }

  // --- PDF preview ---
  get previewPanel()             { return this.page.getByTestId('financial-preview-panel') }
  get previewPanelTitle()        { return this.page.getByTestId('financial-preview-panel-title') }
  get previewDocument()          { return this.page.getByTestId('financial-preview-document') }

  // --- Empty year state ---
  get emptyYearState()           { return this.page.getByTestId('financial-empty-year-state') }
  get emptyYearText()            { return this.page.getByTestId('financial-empty-year-text') }

  // --- Financial form ---
  get formContainer()            { return this.page.getByTestId('financial-form-container') }
  get sectionEbitda()            { return this.page.getByTestId('financial-section-ebitda') }
  get sectionTotalExpenses()     { return this.page.getByTestId('financial-section-total-expenses') }
  get fieldTotalRevenue()        { return this.page.getByTestId('financial-field-total-revenue-input') }
  get fieldOperatingIncome()     { return this.page.getByTestId('financial-field-operating-income-input') }
  get fieldDepreciation()        { return this.page.getByTestId('financial-field-depreciation-input') }
  get fieldEbitdaDisplay()       { return this.page.getByTestId('financial-field-ebitda-calculated-display') }
  get fieldCostOfRevenue()       { return this.page.getByTestId('financial-field-cost-of-revenue-input') }
  get fieldRd()                  { return this.page.getByTestId('financial-field-rd-input') }
  get fieldSalesMarketing()      { return this.page.getByTestId('financial-field-sales-marketing-input') }
  get fieldGeneralAdmin()        { return this.page.getByTestId('financial-field-general-admin-input') }

  // --- Actions ---
  async fillTickerForm(year: string, ticker: string, exchange: string) {
    await this.tickerCard.click()
    await this.tickerYearSelect.selectOption(year)
    await this.tickerSymbolInput.fill(ticker)
    await this.tickerExchangeInput.fill(exchange)
  }

  async submitTicker() {
    await this.tickerSubmitBtn.click()
    await this.loadingOverlay.waitFor({ state: 'hidden' })
  }

  async fetchByTicker(year: string, ticker: string, exchange: string) {
    await this.fillTickerForm(year, ticker, exchange)
    await this.submitTicker()
  }

  async uploadPdf(filePath: string, year: string) {
    await this.uploadCard.click()
    await this.uploadYearSelect.selectOption(year)
    const [fileChooser] = await Promise.all([
      this.page.waitForEvent('filechooser'),
      this.uploadDropzone.click(),
    ])
    await fileChooser.setFiles(filePath)
    await this.uploadSubmitBtn.click()
  }

  async enterManually(year: string) {
    await this.manualCard.click()
    await this.manualYearSelect.selectOption(year)
    await this.manualContinueBtn.click()
  }

  async fillField(field: 'totalRevenue' | 'operatingIncome' | 'depreciation' | 'costOfRevenue' | 'rd' | 'salesMarketing' | 'generalAdmin', value: string) {
    const fieldMap = {
      totalRevenue: this.fieldTotalRevenue,
      operatingIncome: this.fieldOperatingIncome,
      depreciation: this.fieldDepreciation,
      costOfRevenue: this.fieldCostOfRevenue,
      rd: this.fieldRd,
      salesMarketing: this.fieldSalesMarketing,
      generalAdmin: this.fieldGeneralAdmin,
    }
    await fieldMap[field].fill(value)
  }

  async changeYear(year: string) {
    await this.yearSelect.selectOption(year)
  }
}
