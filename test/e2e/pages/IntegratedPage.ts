import type { Page } from '@playwright/test'

export class IntegratedPage {
  constructor(private page: Page) {}

  // --- Filters ---
  get filterFunction()       { return this.page.getByTestId('integrated-filter-function-select') }
  get filterSeniority()      { return this.page.getByTestId('integrated-filter-seniority-select') }
  get filterCountry()        { return this.page.getByTestId('integrated-filter-country-select') }
  get filterYear()           { return this.page.getByTestId('integrated-filter-year-select') }
  get applyFiltersBtn()      { return this.page.getByTestId('integrated-apply-filters-btn') }
  get importFiltersBtn()     { return this.page.getByTestId('integrated-import-filters-btn') }
  get saveFiltersBtn()       { return this.page.getByTestId('integrated-save-filters-btn') }

  // --- Chart 1: Headcount pyramid ---
  get pyramidSection()               { return this.page.getByTestId('integrated-pyramid-section') }
  get pyramidCustomerService()       { return this.page.getByTestId('integrated-pyramid-customer-service') }
  get pyramidGoToMarket()            { return this.page.getByTestId('integrated-pyramid-go-to-market') }
  get pyramidRd()                    { return this.page.getByTestId('integrated-pyramid-rd') }
  get pyramidGa()                    { return this.page.getByTestId('integrated-pyramid-ga') }

  // --- Chart 2: Workforce composition ---
  get compositionSection()   { return this.page.getByTestId('integrated-composition-section') }
  get compositionChart()     { return this.page.getByTestId('integrated-composition-chart') }

  // --- Chart 3: Revenue vs. Labor Spend ---
  get revLaborSection()      { return this.page.getByTestId('integrated-revlabor-section') }
  get revLaborChart()        { return this.page.getByTestId('integrated-revlabor-chart') }
  get revLaborTargetMarker() { return this.page.getByTestId('integrated-revlabor-target-marker') }

  // --- Actions ---
  async applyFilters(filters: { function?: string; seniority?: string; country?: string; year?: string }) {
    if (filters.function)  await this.filterFunction.selectOption(filters.function)
    if (filters.seniority) await this.filterSeniority.selectOption(filters.seniority)
    if (filters.country)   await this.filterCountry.selectOption(filters.country)
    if (filters.year)      await this.filterYear.selectOption(filters.year)
    await this.applyFiltersBtn.click()
  }
}
