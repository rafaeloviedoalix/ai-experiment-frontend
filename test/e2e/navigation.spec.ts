import { test, expect } from '@playwright/test'
import { AppPage } from './pages/AppPage'
import { FinancialPage } from './pages/FinancialPage'
import { RosterPage } from './pages/RosterPage'

test.describe('Navigation & Global Layout', () => {
  let app: AppPage
  let financial: FinancialPage
  let roster: RosterPage

  test.beforeEach(async ({ page }) => {
    app = new AppPage(page)
    financial = new FinancialPage(page)
    roster = new RosterPage(page)
    await app.goto()
  })

  // TC-035 — tab navigation renders each view
  test('tab navigation renders each view without errors', async () => {
    await app.navigateToFinancial()
    await expect(financial.methodSelectionContainer).toBeVisible()

    await app.navigateToIntegrated()
    await expect(app.tabIntegrated).toBeVisible()

    await app.navigateToRoster()
    await expect(roster.uploadBtn).toBeVisible()
  })

  // TC-035 continued — active tab has highlighted style
  test('active tab has selected style', async () => {
    await expect(app.tabRoster).toHaveAttribute('aria-selected', 'true')

    await app.navigateToFinancial()
    await expect(app.tabFinancial).toHaveAttribute('aria-selected', 'true')
    await expect(app.tabRoster).not.toHaveAttribute('aria-selected', 'true')
  })

  // TC-036 — navbar elements visible on every tab
  test('navbar elements visible on every tab', async () => {
    const tabs = [
      () => app.navigateToRoster(),
      () => app.navigateToFinancial(),
      () => app.navigateToIntegrated(),
    ]

    for (const navigate of tabs) {
      await navigate()
      await expect(app.navbar).toBeVisible()
      await expect(app.navbarLogo).toBeVisible()
      await expect(app.navbarProjectName).toBeVisible()
      await expect(app.navbarBellBtn).toBeVisible()
      await expect(app.navbarHelpBtn).toBeVisible()
      await expect(app.navbarAvatar).toBeVisible()
    }
  })

  // TC-037 — company alias name editable and persists across tabs
  test('company alias name is editable and persists across tabs', async () => {
    await app.setCompanyName('Acme Corp')

    await app.navigateToFinancial()
    await expect(app.companyNameHeading).toContainText('Acme Corp')

    await app.navigateToIntegrated()
    await expect(app.companyNameHeading).toContainText('Acme Corp')
  })

  // TC-038 — CTA button label changes per tab
  test('CTA button label changes per active tab', async () => {
    await app.navigateToRoster()
    await expect(app.ctaBtn).toContainText('Upload roster')

    await app.navigateToFinancial()
    await expect(app.ctaBtn).toContainText('Upload 10-K')

    await app.navigateToIntegrated()
    await expect(app.ctaBtn).toContainText('Upload 10-K')
  })
})
