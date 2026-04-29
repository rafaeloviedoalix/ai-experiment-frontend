# Test Cases — Outside-In Due Diligence Tool
**Hackathon Team 3 | Date: 2026-04-29 | Spec ref: OI_Specs_v3_Vue_dotNET**

Priority legend: **P1** = Critical smoke | **P2** = Core functionality | **P3** = Edge cases

> `data-testid` values are the Playwright selectors defined in the spec. Listed in each TC for reference.

---

## Module 1 — Roster Analysis

### TC-001 · Empty state on first load
| | |
|---|---|
| **Priority** | P1 |
| **Type** | E2E |
| **Precondition** | App loaded, no roster uploaded, Roster Analysis tab active |
| **Steps** | 1. Open the application |
| **Expected** | Empty state visible: teal folder illustration + "Upload a roster to do your analysis" + "Upload roster" button (solid green, white text) |
| **data-testid** | `app-tab-roster`, `roster-upload-btn` |

---

### TC-002 · Upload modal opens from empty state and from CTA
| | |
|---|---|
| **Priority** | P1 |
| **Type** | E2E |
| **Precondition** | Empty state visible |
| **Steps** | 1. Click "Upload roster" button in empty state <br> 2. Verify modal opens <br> 3. Close modal <br> 4. Click top-right CTA "Upload roster" button <br> 5. Verify modal opens |
| **Expected** | Both buttons open the same upload modal with title "Upload roster", dashed drop zone, "Browse file" (outlined green), "Cancel", and disabled "Upload roster" confirm button |
| **data-testid** | `roster-upload-modal`, `roster-dropzone`, `roster-browse-file-btn`, `roster-upload-cancel-btn`, `roster-upload-confirm-btn`, `app-cta-btn` |

---

### TC-003 · Drag & drop valid .xlsx file — file staged
| | |
|---|---|
| **Priority** | P1 |
| **Type** | E2E |
| **User Story** | US-01, US-02 |
| **Precondition** | Upload modal open |
| **Steps** | 1. Drag a valid `.xlsx` file onto `roster-dropzone` |
| **Expected** | - `roster-staged-file-row` appears below drop zone <br> - `roster-staged-file-name` shows correct filename <br> - `roster-staged-file-size` shows size in KB/MB (2 decimal places) <br> - `roster-upload-confirm-btn` becomes enabled (solid green) |
| **data-testid** | `roster-dropzone`, `roster-staged-file-row`, `roster-staged-file-name`, `roster-staged-file-size`, `roster-upload-confirm-btn` |

---

### TC-004 · Delete staged file — confirm button disables
| | |
|---|---|
| **Priority** | P2 |
| **Type** | E2E |
| **User Story** | US-02 |
| **Precondition** | Valid file staged in upload modal |
| **Steps** | 1. Click `roster-staged-file-delete-btn` (trash icon) |
| **Expected** | - `roster-staged-file-row` disappears <br> - `roster-upload-confirm-btn` returns to disabled state <br> - Drop zone returns to empty state |
| **data-testid** | `roster-staged-file-delete-btn`, `roster-staged-file-row`, `roster-upload-confirm-btn` |

---

### TC-005 · Upload valid roster — loading overlay → loaded state
| | |
|---|---|
| **Priority** | P1 |
| **Type** | E2E |
| **User Story** | US-03 |
| **Precondition** | Valid `.xlsx` staged in modal; backend mocked to return 200 |
| **Steps** | 1. Click `roster-upload-confirm-btn` |
| **Expected** | - Modal closes <br> - `roster-loading-overlay` appears with text "Uploading roster..." <br> - On backend 200: overlay disappears, `roster-table-container` visible, filter bar + 5 KPI cards shown |
| **data-testid** | `roster-upload-confirm-btn`, `roster-loading-overlay`, `roster-loading-text`, `roster-table-container` |

---

### TC-006 · KPI cards display correct totals (unfiltered)
| | |
|---|---|
| **Priority** | P1 |
| **Type** | E2E |
| **User Story** | US-05 |
| **Precondition** | Roster uploaded with known data (e.g., 10 employees, 2 countries) |
| **Steps** | 1. Upload `sample_roster.xlsx` <br> 2. Read KPI card values |
| **Expected** | - `roster-kpi-headcount-value` = total employee count <br> - `roster-kpi-countries-value` = count of distinct countries <br> - `roster-kpi-laborspend-value` = sum of all "Fully Loaded Cost" values |
| **data-testid** | `roster-kpi-headcount-value`, `roster-kpi-countries-value`, `roster-kpi-salary-value`, `roster-kpi-taxes-value`, `roster-kpi-laborspend-value` |

---

### TC-007 · Filters apply to table only — KPI cards stay unfiltered
| | |
|---|---|
| **Priority** | P1 |
| **Type** | E2E |
| **User Story** | US-04, US-05 |
| **Precondition** | Roster loaded with 200 employees across multiple functions |
| **Steps** | 1. Note `roster-kpi-headcount-value` (e.g. "200") <br> 2. Select a specific function in `roster-filter-function-select` <br> 3. Observe KPI card and table |
| **Expected** | - Table rows filtered to selected function only <br> - `roster-table-footer-total-rows` shows reduced count <br> - **`roster-kpi-headcount-value` still shows 200** (KPI cards always reflect full unfiltered dataset) |
| **data-testid** | `roster-filter-function-select`, `roster-kpi-headcount-value`, `roster-table-footer-total-rows` |

---

### TC-008 · Filter by Seniority
| | |
|---|---|
| **Priority** | P2 |
| **Type** | E2E |
| **Precondition** | Roster loaded with multiple seniority levels |
| **Steps** | 1. Open `roster-filter-seniority-select` <br> 2. Select "Manager" |
| **Expected** | Table shows only Manager-level employees; other filters unaffected |
| **data-testid** | `roster-filter-seniority-select`, `roster-table-body` |

---

### TC-009 · Filter by Country
| | |
|---|---|
| **Priority** | P2 |
| **Type** | E2E |
| **Precondition** | Roster loaded with employees in multiple countries |
| **Steps** | 1. Open `roster-filter-country-select` <br> 2. Select "Argentina" |
| **Expected** | Table shows only Argentina-based employees |
| **data-testid** | `roster-filter-country-select`, `roster-table-body` |

---

### TC-010 · Search bar filters table instantly
| | |
|---|---|
| **Priority** | P2 |
| **Type** | E2E |
| **User Story** | US-04 |
| **Precondition** | Roster loaded |
| **Steps** | 1. Type partial job title (e.g. "Financial") in `roster-search-input` |
| **Expected** | Table filters instantly (client-side); only matching Job Title rows visible; no page reload |
| **data-testid** | `roster-search-input`, `roster-table-body` |

---

### TC-011 · Cumulative AND filters
| | |
|---|---|
| **Priority** | P2 |
| **Type** | E2E |
| **Precondition** | Roster loaded with diverse data |
| **Steps** | 1. Select "Finance" in `roster-filter-function-select` <br> 2. Select "Manager" in `roster-filter-seniority-select` |
| **Expected** | Table shows only rows that are Finance AND Manager (AND logic) |
| **data-testid** | `roster-filter-function-select`, `roster-filter-seniority-select`, `roster-table-body` |

---

### TC-012 · Upload invalid file type — 400 error banner
| | |
|---|---|
| **Priority** | P2 |
| **Type** | E2E |
| **User Story** | US-07 |
| **Precondition** | Upload modal open |
| **Steps** | 1. Drop a `.pdf` file onto `roster-dropzone` |
| **Expected** | - `roster-upload-error-banner` appears (orange) with plain-language error <br> - No file staged; confirm button remains disabled <br> - Backend contract: `400 { "error": "INVALID_FILE_TYPE" }` |
| **data-testid** | `roster-dropzone`, `roster-upload-error-banner`, `roster-upload-confirm-btn` |

---

### TC-013 · Upload file exceeding 15 MB — 413 error
| | |
|---|---|
| **Priority** | P2 |
| **Type** | E2E |
| **User Story** | US-01 |
| **Precondition** | Upload modal open |
| **Steps** | 1. Drop a `.xlsx` file larger than 15 MB onto `roster-dropzone` |
| **Expected** | - `roster-upload-error-banner` shows file size error message <br> - Backend contract: `413 { "error": "FILE_TOO_LARGE" }` |
| **data-testid** | `roster-upload-error-banner` |

---

### TC-014 · Upload roster missing required columns — 422 parse error
| | |
|---|---|
| **Priority** | P3 |
| **Type** | E2E |
| **Precondition** | Upload modal open |
| **Steps** | 1. Upload an Excel file missing the "Fully Loaded Cost" column |
| **Expected** | - Loading overlay disappears <br> - Upload modal reopens with `roster-upload-error-banner` <br> - Error message references missing column(s) <br> - Backend contract: `422 { "error": "PARSE_ERROR", "message": "Verify columns: Employee ID, Job Title, Job Function, Seniority, Country, Fully Loaded Cost." }` |
| **data-testid** | `roster-upload-modal`, `roster-upload-error-banner` |

---

### TC-015 · Replace existing roster
| | |
|---|---|
| **Priority** | P2 |
| **Type** | E2E |
| **User Story** | US-06 |
| **Precondition** | Roster already loaded |
| **Steps** | 1. Click `app-cta-btn` ("Upload roster") <br> 2. Upload a different valid file |
| **Expected** | New roster data replaces the old; KPI cards and table update; page does not reload |
| **data-testid** | `app-cta-btn`, `roster-kpi-headcount-value`, `roster-table-container` |

---

## Module 2 — Financial Data Pull

### TC-016 · Method selection screen on first visit
| | |
|---|---|
| **Priority** | P1 |
| **Type** | E2E |
| **User Story** | US-08 |
| **Precondition** | No financial data loaded; navigate to Financial Data Pull tab |
| **Steps** | 1. Click `app-tab-financial` |
| **Expected** | `financial-method-selection-container` visible with 3 cards: "Search by ticker", "Upload 10-K file", "Enter data manually" |
| **data-testid** | `app-tab-financial`, `financial-method-selection-container`, `financial-method-ticker-card`, `financial-method-upload-card`, `financial-method-manual-card` |

---

### TC-017 · Search by ticker — modal validation and submit
| | |
|---|---|
| **Priority** | P1 |
| **Type** | E2E |
| **User Story** | US-09 |
| **Precondition** | `financial-ticker-modal` open (clicked "Search by ticker" card) |
| **Steps** | 1. Verify `financial-ticker-submit-btn` is disabled <br> 2. Fill `financial-ticker-year-select`, `financial-ticker-symbol-input` (e.g. "MSFT"), `financial-ticker-exchange-input` (e.g. "NASDAQ") <br> 3. Click `financial-ticker-submit-btn` |
| **Expected** | - Button disabled until all 3 fields filled <br> - On submit: `financial-loading-overlay` appears with "Pulling 10-K..." text |
| **data-testid** | `financial-ticker-modal`, `financial-ticker-year-select`, `financial-ticker-symbol-input`, `financial-ticker-exchange-input`, `financial-ticker-submit-btn`, `financial-loading-overlay`, `financial-loading-text` |

---

### TC-018 · Ticker search success — fields auto-populated + imported badge
| | |
|---|---|
| **Priority** | P1 |
| **Type** | E2E |
| **User Story** | US-09 |
| **Precondition** | `financial-loading-overlay` shown after valid ticker submit; backend mocked to return 200 |
| **Steps** | 1. Backend returns 200 with financial data |
| **Expected** | - Overlay disappears <br> - `financial-field-total-revenue-input` shows extracted value <br> - `financial-imported-badge` visible ("Imported from: 10-K FY{YYYY}") <br> - All editable fields populated; EBITDA (calculated) auto-computed |
| **data-testid** | `financial-field-total-revenue-input`, `financial-imported-badge`, `financial-field-ebitda-calculated-display` |

---

### TC-019 · Ticker not found — 404 error shown
| | |
|---|---|
| **Priority** | P2 |
| **Type** | E2E |
| **User Story** | US-09 |
| **Precondition** | `financial-ticker-modal` open |
| **Steps** | 1. Enter a non-existent ticker (e.g. "ZZZZ") <br> 2. Click `financial-ticker-submit-btn` |
| **Expected** | Overlay disappears; inline or banner error shown to user; method selection remains accessible |

---

### TC-020 · Upload 10-K PDF — extraction fails (206) → error modal → split view
| | |
|---|---|
| **Priority** | P2 |
| **Type** | E2E |
| **User Story** | US-10, US-11 |
| **Precondition** | `financial-upload-modal` open; backend mocked to return 206 |
| **Steps** | 1. Select year in `financial-upload-year-select` <br> 2. Drop a PDF onto `financial-upload-dropzone` <br> 3. Click `financial-upload-submit-btn` <br> 4. Backend returns 206 (partial extraction) |
| **Expected** | `financial-extraction-error-modal` appears with warning text about partial extraction; two buttons: "Cancel" and "Continue" |
| **data-testid** | `financial-upload-modal`, `financial-upload-year-select`, `financial-upload-dropzone`, `financial-upload-submit-btn`, `financial-extraction-error-modal`, `financial-extraction-error-banner`, `financial-extraction-error-continue-btn`, `financial-extraction-error-cancel-btn` |

---

### TC-021 · Continue from extraction error → split view (preview + empty fields)
| | |
|---|---|
| **Priority** | P2 |
| **Type** | E2E |
| **User Story** | US-11 |
| **Precondition** | `financial-extraction-error-modal` visible |
| **Steps** | 1. Click `financial-extraction-error-continue-btn` |
| **Expected** | - `financial-preview-panel` visible on left with embedded document (`financial-preview-document`) <br> - All financial fields empty and editable on right |
| **data-testid** | `financial-preview-panel`, `financial-preview-panel-title`, `financial-preview-document` |

---

### TC-022 · Enter data manually — year-only modal → form
| | |
|---|---|
| **Priority** | P2 |
| **Type** | E2E |
| **Precondition** | Method selection visible |
| **Steps** | 1. Click `financial-method-manual-card` <br> 2. Select year in `financial-manual-year-select` <br> 3. Click `financial-manual-continue-btn` |
| **Expected** | Full-width form opens; all fields empty and editable; `financial-imported-badge` NOT visible |
| **data-testid** | `financial-manual-modal`, `financial-manual-year-select`, `financial-manual-continue-btn` |

---

### TC-023 · Manual entry of Total Revenue field
| | |
|---|---|
| **Priority** | P1 |
| **Type** | E2E |
| **Precondition** | Financial form open (any method) |
| **Steps** | 1. Click `financial-field-total-revenue-input` <br> 2. Enter `100000` <br> 3. Tab away |
| **Expected** | Value saved and displayed; no page reload |
| **data-testid** | `financial-field-total-revenue-input` |

---

### TC-024 · EBITDA auto-calculates from Operating Income + D&A
| | |
|---|---|
| **Priority** | P1 |
| **Type** | E2E |
| **User Story** | US-13 |
| **Precondition** | Financial form open |
| **Steps** | 1. Enter `80000` in `financial-field-operating-income-input` <br> 2. Enter `5000` in `financial-field-depreciation-input` |
| **Expected** | `financial-field-ebitda-calculated-display` immediately shows `85000` (no submit needed) |
| **data-testid** | `financial-field-operating-income-input`, `financial-field-depreciation-input`, `financial-field-ebitda-calculated-display` |

---

### TC-025 · EBITDA field is read-only
| | |
|---|---|
| **Priority** | P1 |
| **Type** | E2E |
| **User Story** | US-13 |
| **Precondition** | Financial form open |
| **Steps** | 1. Try to click and type into `financial-field-ebitda-calculated-display` |
| **Expected** | Field is not editable (disabled/read-only); value only changes via Operating Income or D&A inputs |
| **data-testid** | `financial-field-ebitda-calculated-display` |

---

### TC-026 · Edit auto-extracted field
| | |
|---|---|
| **Priority** | P2 |
| **Type** | E2E |
| **User Story** | US-12 |
| **Precondition** | Financial data auto-extracted (ticker or file, backend 200) |
| **Steps** | 1. Click into `financial-field-total-revenue-input` <br> 2. Clear and enter new value |
| **Expected** | Field accepts new value; EBITDA recalculates if Operating Income or D&A changed |
| **data-testid** | `financial-field-total-revenue-input` |

---

### TC-027 · Re-import modal when data already loaded
| | |
|---|---|
| **Priority** | P2 |
| **Type** | E2E |
| **User Story** | US-14 |
| **Precondition** | Financial data already loaded |
| **Steps** | 1. Click `app-cta-btn` ("Upload 10-K") from loaded state |
| **Expected** | `financial-reimport-modal` appears with 3 radio options (ticker, upload, manual); Cancel + Continue |
| **data-testid** | `financial-reimport-modal`, `financial-reimport-ticker-radio`, `financial-reimport-upload-radio`, `financial-reimport-manual-radio`, `financial-reimport-continue-btn`, `financial-reimport-cancel-btn` |

---

### TC-028 · Financial data persists when switching tabs
| | |
|---|---|
| **Priority** | P2 |
| **Type** | E2E |
| **Precondition** | Financial data entered manually |
| **Steps** | 1. Enter values in revenue and EBITDA inputs <br> 2. Switch to Roster Analysis tab <br> 3. Switch back to Financial Data Pull |
| **Expected** | All entered values retained (Pinia store) |
| **data-testid** | `app-tab-roster`, `app-tab-financial`, `financial-field-total-revenue-input` |

---

## Module 3 — Integrated Analysis

### TC-029 · Prerequisites check — missing roster
| | |
|---|---|
| **Priority** | P1 |
| **Type** | E2E |
| **Precondition** | No roster uploaded; financial data entered |
| **Steps** | 1. Click `app-tab-integrated` |
| **Expected** | Inline message indicating roster data is missing; link/button to navigate to Roster Analysis tab |
| **data-testid** | `app-tab-integrated` |

---

### TC-030 · Prerequisites check — missing financial data
| | |
|---|---|
| **Priority** | P1 |
| **Type** | E2E |
| **Precondition** | Roster uploaded; no financial data |
| **Steps** | 1. Click `app-tab-integrated` |
| **Expected** | Inline message indicating financial data is missing; link to Financial Data Pull tab |

---

### TC-031 · All charts render when both datasets loaded
| | |
|---|---|
| **Priority** | P1 |
| **Type** | E2E |
| **User Story** | US-15, US-16, US-17 |
| **Precondition** | Roster uploaded AND financial data entered; navigate to Integrated Analysis |
| **Steps** | 1. Click `app-tab-integrated` |
| **Expected** | - 4 headcount pyramids visible: `integrated-pyramid-customer-service`, `integrated-pyramid-go-to-market`, `integrated-pyramid-rd`, `integrated-pyramid-ga` <br> - `integrated-composition-chart` visible <br> - `integrated-revlabor-chart` visible |
| **data-testid** | `integrated-pyramid-section`, `integrated-pyramid-customer-service`, `integrated-pyramid-go-to-market`, `integrated-pyramid-rd`, `integrated-pyramid-ga`, `integrated-composition-chart`, `integrated-revlabor-chart` |

---

### TC-032 · Headcount pyramid shows seniority levels with percentages
| | |
|---|---|
| **Priority** | P1 |
| **Type** | E2E |
| **User Story** | US-15 |
| **Precondition** | Both datasets loaded; Integrated Analysis active |
| **Steps** | 1. Inspect each pyramid chart |
| **Expected** | Each pyramid shows bars for VP+, Head, Director, Manager, Other with percentage labels; bars are coloured (not grayscale) |
| **data-testid** | `integrated-pyramid-customer-service` |

---

### TC-033 · Target company marker visible in Revenue vs. Labor Spend chart
| | |
|---|---|
| **Priority** | P1 |
| **Type** | E2E |
| **User Story** | US-17 |
| **Precondition** | Both datasets loaded; Integrated Analysis active |
| **Steps** | 1. Scroll to Revenue vs. Labor Spend section |
| **Expected** | `integrated-revlabor-target-marker` visible as a filled diamond; axes labelled with $M units |
| **data-testid** | `integrated-revlabor-chart`, `integrated-revlabor-target-marker` |

---

### TC-034 · Filters apply to all 3 charts simultaneously
| | |
|---|---|
| **Priority** | P2 |
| **Type** | E2E |
| **User Story** | US-18 |
| **Precondition** | Both datasets loaded; Integrated Analysis active |
| **Steps** | 1. Select a function in `integrated-filter-function-select` <br> 2. Click `integrated-apply-filters-btn` |
| **Expected** | All 3 chart sections update to reflect filtered data |
| **data-testid** | `integrated-filter-function-select`, `integrated-apply-filters-btn`, `integrated-pyramid-section`, `integrated-composition-chart`, `integrated-revlabor-chart` |

---

## Module 4 — Navigation & Global Layout

### TC-035 · Tab navigation works
| | |
|---|---|
| **Priority** | P1 |
| **Type** | E2E |
| **Precondition** | App loaded |
| **Steps** | 1. Click `app-tab-financial` <br> 2. Click `app-tab-integrated` <br> 3. Click `app-tab-roster` |
| **Expected** | Each tab renders its view without errors; active tab has green underline + green text |
| **data-testid** | `app-tab-bar`, `app-tab-roster`, `app-tab-financial`, `app-tab-integrated` |

---

### TC-036 · Navbar elements always present
| | |
|---|---|
| **Priority** | P2 |
| **Type** | E2E |
| **Precondition** | App loaded |
| **Steps** | 1. Navigate through all 3 tabs |
| **Expected** | On every tab: `app-navbar-logo` ("AP" green square), `app-navbar-project-name`, `app-navbar-bell-btn`, `app-navbar-help-btn`, `app-navbar-avatar` all visible |
| **data-testid** | `app-navbar`, `app-navbar-logo`, `app-navbar-project-name`, `app-navbar-bell-btn`, `app-navbar-help-btn`, `app-navbar-avatar` |

---

### TC-037 · Company alias name is editable and persists across tabs
| | |
|---|---|
| **Priority** | P2 |
| **Type** | E2E |
| **Precondition** | Default name "Company alias name" shown |
| **Steps** | 1. Click `app-company-name-heading` <br> 2. Type "Acme Corp" <br> 3. Confirm/blur <br> 4. Switch tabs and return |
| **Expected** | "Acme Corp" persists across all tabs (Pinia store) |
| **data-testid** | `app-company-name-heading` |

---

### TC-038 · CTA button label changes per active tab
| | |
|---|---|
| **Priority** | P2 |
| **Type** | E2E |
| **Precondition** | App loaded |
| **Steps** | 1. Go to Roster Analysis — read `app-cta-btn` label <br> 2. Go to Financial Data Pull — read label <br> 3. Go to Integrated Analysis — read label |
| **Expected** | Roster Analysis → "Upload roster" | Financial Data Pull → "Upload 10-K" | Integrated Analysis → "Upload 10-K" |
| **data-testid** | `app-cta-btn` |

---

## Module 5 — API / Backend (.NET 8)

### TC-039 · POST /api/roster/upload — valid .xlsx file
| | |
|---|---|
| **Priority** | P1 |
| **Type** | Integration |
| **Steps** | Send multipart POST to `/api/roster/upload` with valid `.xlsx` containing required columns |
| **Expected** | `200 OK` — `{ employees: [...], summary: { headcount, countries, totalSalary, totalTaxes, totalLaborSpend } }` |

---

### TC-040 · POST /api/roster/upload — invalid file type
| | |
|---|---|
| **Priority** | P2 |
| **Type** | Integration |
| **Steps** | POST `.pdf` file to `/api/roster/upload` |
| **Expected** | `400 Bad Request` — `{ "error": "INVALID_FILE_TYPE", "message": "Only .xls and .xlsx files are accepted." }` |

---

### TC-041 · POST /api/roster/upload — file exceeds 15 MB
| | |
|---|---|
| **Priority** | P2 |
| **Type** | Integration |
| **Steps** | POST `.xlsx` larger than 15 MB |
| **Expected** | `413 Payload Too Large` — `{ "error": "FILE_TOO_LARGE" }` |

---

### TC-042 · POST /api/roster/upload — missing required column
| | |
|---|---|
| **Priority** | P2 |
| **Type** | Integration |
| **Steps** | POST `.xlsx` missing "Fully Loaded Cost" column |
| **Expected** | `422 Unprocessable Entity` — `{ "error": "PARSE_ERROR", "message": "...Verify columns: Employee ID, Job Title, Job Function, Seniority, Country, Fully Loaded Cost." }` |

---

### TC-043 · POST /api/roster/upload — Salary/Taxes auto-split from Fully Loaded Cost
| | |
|---|---|
| **Priority** | P2 |
| **Type** | Integration |
| **Steps** | POST file with "Fully Loaded Cost" only (no separate Salary/Taxes columns) |
| **Expected** | `200 OK`; each employee: `salary = Fully Loaded Cost × 0.80`, `taxes = Fully Loaded Cost × 0.20` |

---

### TC-044 · POST /api/financial/ticker — valid ticker
| | |
|---|---|
| **Priority** | P1 |
| **Type** | Integration |
| **Steps** | POST `{ "year": "2024", "ticker": "MSFT", "exchange": "NASDAQ" }` to `/api/financial/ticker` |
| **Expected** | `200 OK` with `fiscalYear`, `totalRevenue`, `operatingIncome`, `depreciationAmortization`, `ebitdaCalculated`, expense fields, and `revenueSegments` array |

---

### TC-045 · POST /api/financial/ticker — ticker not found
| | |
|---|---|
| **Priority** | P2 |
| **Type** | Integration |
| **Steps** | POST `{ "year": "2024", "ticker": "ZZZZ", "exchange": "NYSE" }` |
| **Expected** | `404 Not Found` — `{ "error": "NOT_FOUND", "message": "No 10-K found for ticker ZZZZ..." }` |

---

### TC-046 · POST /api/financial/upload — PDF with partial extraction (206)
| | |
|---|---|
| **Priority** | P2 |
| **Type** | Integration |
| **Steps** | POST multipart with year + PDF that cannot be fully parsed |
| **Expected** | `206 Partial Content` — `{ "error": "EXTRACTION_PARTIAL", "previewUrl": "...", ...partial fields... }` |

---

### TC-047 · EBITDA calculation — frontend unit test
| | |
|---|---|
| **Priority** | P1 |
| **Type** | Unit |
| **Steps** | In computed EBITDA logic: set `operatingIncome = 77698`, `depreciation = 5000` |
| **Expected** | `ebitdaCalculated = 82698` (Operating income + D&A) |

---

### TC-048 · GET /health
| | |
|---|---|
| **Priority** | P1 |
| **Type** | Integration |
| **Steps** | `GET /health` |
| **Expected** | `200 OK` — `{ "status": "healthy" }` |
