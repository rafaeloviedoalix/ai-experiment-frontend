import type { Page } from '@playwright/test'

export class RosterPage {
  constructor(private page: Page) {}

  // --- Empty state ---
  get uploadBtn()           { return this.page.getByTestId('roster-upload-btn') }

  // --- Upload modal ---
  get uploadModal()         { return this.page.getByTestId('roster-upload-modal') }
  get uploadModalCloseBtn() { return this.page.getByTestId('roster-upload-modal-close-btn') }
  get dropzone()            { return this.page.getByTestId('roster-dropzone') }
  get browseFileBtn()       { return this.page.getByTestId('roster-browse-file-btn') }
  get stagedFileRow()       { return this.page.getByTestId('roster-staged-file-row') }
  get stagedFileName()      { return this.page.getByTestId('roster-staged-file-name') }
  get stagedFileSize()      { return this.page.getByTestId('roster-staged-file-size') }
  get stagedFileDeleteBtn() { return this.page.getByTestId('roster-staged-file-delete-btn') }
  get uploadCancelBtn()     { return this.page.getByTestId('roster-upload-cancel-btn') }
  get uploadConfirmBtn()    { return this.page.getByTestId('roster-upload-confirm-btn') }
  get uploadErrorBanner()   { return this.page.getByTestId('roster-upload-error-banner') }

  // --- Loading overlay ---
  get loadingOverlay()      { return this.page.getByTestId('roster-loading-overlay') }
  get loadingText()         { return this.page.getByTestId('roster-loading-text') }

  // --- KPI cards ---
  get kpiHeadcount()        { return this.page.getByTestId('roster-kpi-headcount-value') }
  get kpiCountries()        { return this.page.getByTestId('roster-kpi-countries-value') }
  get kpiSalary()           { return this.page.getByTestId('roster-kpi-salary-value') }
  get kpiTaxes()            { return this.page.getByTestId('roster-kpi-taxes-value') }
  get kpiLaborSpend()       { return this.page.getByTestId('roster-kpi-laborspend-value') }

  // --- Filter bar ---
  get searchInput()         { return this.page.getByTestId('roster-search-input') }
  get filterFunction()      { return this.page.getByTestId('roster-filter-function-select') }
  get filterSeniority()     { return this.page.getByTestId('roster-filter-seniority-select') }
  get filterCountry()       { return this.page.getByTestId('roster-filter-country-select') }

  // --- Table ---
  get tableContainer()      { return this.page.getByTestId('roster-table-container') }
  get tableHeader()         { return this.page.getByTestId('roster-table-header-row') }
  get tableBody()           { return this.page.getByTestId('roster-table-body') }
  get tableFooterTotal()    { return this.page.getByTestId('roster-table-footer-total-rows') }
  tableRow(n: number)       { return this.page.getByTestId(`roster-table-row-${n}`) }

  // --- Actions ---
  async openUploadModal() {
    await this.uploadBtn.click()
  }

  async stageFile(filePath: string) {
    const [fileChooser] = await Promise.all([
      this.page.waitForEvent('filechooser'),
      this.browseFileBtn.click(),
    ])
    await fileChooser.setFiles(filePath)
  }

  async stageInlineFile(file: { name: string; mimeType: string; buffer: Buffer }) {
    const [fileChooser] = await Promise.all([
      this.page.waitForEvent('filechooser'),
      this.browseFileBtn.click(),
    ])
    await fileChooser.setFiles(file)
  }

  async confirmUpload() {
    await this.uploadConfirmBtn.click()
  }

  async uploadRoster(filePath: string) {
    await this.openUploadModal()
    await this.stageFile(filePath)
    await this.confirmUpload()
  }

  async filterByFunction(value: string) {
    await this.filterFunction.selectOption(value)
  }

  async filterBySeniority(value: string) {
    await this.filterSeniority.selectOption(value)
  }

  async filterByCountry(value: string) {
    await this.filterCountry.selectOption(value)
  }

  async search(term: string) {
    await this.searchInput.fill(term)
  }

  async deleteStaged() {
    await this.stagedFileDeleteBtn.click()
  }
}
