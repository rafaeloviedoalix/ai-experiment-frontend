# Test Plan — Outside-In Due Diligence Tool
**Hackathon Team 3 | Date: 2026-04-29 | Spec ref: OI_Specs_v3_Vue_dotNET**

---

## 1. Overview

This test plan covers the quality assurance strategy for the **Outside-In Due Diligence Tool**, a web application that allows practitioners to analyze workforce data from LinkedIn rosters (Excel) and financial data from 10-K filings, without requiring direct access to client systems.

---

## 2. Scope

### In Scope
- **Roster Analysis**: Excel file upload (drag & drop + browse), KPI display, data table with filters and search
- **Financial Data Pull**: 10-K fetch by ticker, PDF upload, or manual entry; EBITDA auto-calculation
- **Integrated Analysis**: Headcount pyramid, workforce composition, Revenue vs. Labor Spend chart
- **Navigation**: Tab switching and persistence of data across tabs (Pinia store)
- **API endpoints**: Roster processing, financial data retrieval, health check
- **Authentication**: TBD — spec marks this as open (TBD-10); auth testing deferred until confirmed

### Out of Scope
- Performance / load testing
- Security penetration testing
- Browser compatibility beyond Chrome (given hackathon time constraints)
- Accessibility testing (WCAG)

---

## 3. Test Strategy

| Layer | Tool | Type |
|-------|------|------|
| Backend unit | xUnit (.NET 8) | Unit / integration |
| End-to-end | Playwright — `data-testid` selectors | E2E |

All Playwright tests target `data-testid` attributes exclusively — no CSS classes, IDs, or text selectors. Naming convention: `[module]-[element]-[type]` (e.g. `roster-upload-btn`, `financial-field-total-revenue-input`).

Tests are organized by feature area, following the three main screens of the application.

---

## 4. Test Environment

| Item | Value |
|------|-------|
| OS | Windows 11 |
| Browser (E2E) | Chromium (Playwright default) |
| FE Dev server | `http://localhost:5173` |
| BE Dev server | TBD (port defined by .NET 8 team) |
| Auth | TBD (spec TBD-10 — may be no auth for internal tool) |
| Node version | ≥ 20.19.0 |
| .NET version | 8.0 |

---

## 5. Test Types

### 5.1 Unit Tests (xUnit — .NET 8 Backend)
- Roster processing: headcount calculation, cost aggregation, grouping by function / country / seniority
- Salary/Taxes split logic: 80% / 20% of Fully Loaded Cost when separate columns absent
- Financial data: EBITDA calculation (`Operating Income + D&A`)
- API route responses: correct status codes and payloads for all defined contracts
- Error responses: `400` invalid file type, `413` file too large, `422` parse failure, `404` ticker not found, `206` partial extraction

### 5.2 End-to-End Tests (Playwright)
- **Roster Analysis**: upload modal flow (drag & drop, staged file, confirm), loading overlay, KPI cards, filter + search behavior
- **Financial Data Pull**: 3-method selection (ticker, file upload, manual), loading overlay, auto-populated fields, extraction error modal + split view, EBITDA auto-calculation
- **Integrated Analysis**: prerequisite check (both datasets required), chart rendering, cross-chart filter application
- **Navigation**: tab switching, CTA button label per tab, company name persistence

---

## 6. Entry Criteria
- FE dev server runs without errors (`npm run dev`)
- BE dev server runs without errors (dotnet run or equivalent)
- At least one sample roster `.xlsx` file available for upload testing
- Backend API base URL confirmed and reachable from test environment

## 7. Exit Criteria
- All **P1** test cases pass
- No open **Critical** or **High** severity bugs
- E2E smoke suite (P1 cases) passes on Chromium

---

## 8. Test Data

| Asset | Description |
|-------|-------------|
| `sample_roster.xlsx` | Excel file with columns: **Employee ID**, Job Title, Job Function, Seniority, Country, Fully Loaded Cost. Max 15 MB. Formats accepted: `.xls`, `.xlsx` |
| `sample_10k.pdf` | Sample 10-K annual filing for a public company (≤ 15 MB). Formats accepted: `.xls`, `.xlsx`, `.pdf` |
| Manual financial data | Total Revenue: $100,000 / Operating Income: $77,698 / D&A: $5,000 / Expenses breakdown |
| Ticker test data | Ticker: `MSFT`, Exchange: `NASDAQ`, Year: `2024` (valid) · Ticker: `ZZZZ`, Exchange: `NYSE` (invalid — expect 404) |

---

## 9. Risks & Assumptions
- API contracts may evolve during the hackathon; test cases are written against spec v3.0 and will be updated accordingly.
- 10-K extraction via Anthropic API (backend-only); tests for that flow require mocking the AI response.
- Revenue breakdown sub-fields are dynamic (extracted from 10-K); tests use `financial-field-revenue-segment-{n}-input` pattern.
- Peer company data in the Revenue vs. Labor Spend scatter is TBD (spec TBD-03); those assertions are out of scope until confirmed.
- Authentication is TBD (spec TBD-10); auth-related test cases will be added once the decision is made.
