import type { Page } from '@playwright/test'

export class AppPage {
  constructor(private page: Page) {}

  // --- Elements ---
  get navbar()              { return this.page.getByTestId('app-navbar') }
  get navbarLogo()          { return this.page.getByTestId('app-navbar-logo') }
  get navbarProjectName()   { return this.page.getByTestId('app-navbar-project-name') }
  get navbarBellBtn()       { return this.page.getByTestId('app-navbar-bell-btn') }
  get navbarHelpBtn()       { return this.page.getByTestId('app-navbar-help-btn') }
  get navbarAvatar()        { return this.page.getByTestId('app-navbar-avatar') }
  get companyNameHeading()  { return this.page.getByTestId('app-company-name-heading') }
  get tabBar()              { return this.page.getByTestId('app-tab-bar') }
  get tabRoster()           { return this.page.getByTestId('app-tab-roster') }
  get tabFinancial()        { return this.page.getByTestId('app-tab-financial') }
  get tabIntegrated()       { return this.page.getByTestId('app-tab-integrated') }
  get ctaBtn()              { return this.page.getByTestId('app-cta-btn') }

  // --- Actions ---
  async goto() {
    await this.page.goto('/')
  }

  async navigateToRoster() {
    await this.tabRoster.click()
  }

  async navigateToFinancial() {
    await this.tabFinancial.click()
  }

  async navigateToIntegrated() {
    await this.tabIntegrated.click()
  }

  async setCompanyName(name: string) {
    await this.companyNameHeading.click()
    await this.companyNameHeading.fill(name)
    await this.page.keyboard.press('Enter')
  }

  async clickCta() {
    await this.ctaBtn.click()
  }
}
