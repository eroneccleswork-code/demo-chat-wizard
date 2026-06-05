## Goal
Rebuild `/invoca` as a 1:1 visual clone of the real Invoca Healthcare dashboard shown in the 5 screenshots, then drive every industry-specific label/number from AI based on the company website/industry from the setup form.

## What "1:1" means here
I'll match the reference exactly for:
- Header (Invoca logotype + bubble mark, DEMO NETWORK badge, Network dropdown, search, star/bell/help/avatar)
- Left sidebar (Dashboards / Call Review NEW / Advertisers / Campaigns / Publishers / Promo Numbers / Reports / Integrations / Signal / Score / Labs / Settings) with the exact icons, spacing, active green left-border
- 3 KPI tiles up top (Avg call duration `3:49`, Conversion `50%`, Inquiry Type `21%`)
- `CALL TRENDING` — stacked bar chart, 28 daily bars, exact blue/green/red palette and legend
- 6-panel marketing block laid out as 3 columns × 4 rows of cards:
  - Row 1 — Source: horizontal bar chart (Calls), horizontal % bar chart (Appointments), table (Calls + Appointments%)
  - Row 2 — Medium: same trio
  - Row 3 — Campaign: same trio (truncated long labels with `…`)
  - Row 4 — Search Terms: same trio
  - Same 5-color sequence (blue/green/red/teal/purple), same rounded bars, same numeric labels inside bars
- `LINES OF BUSINESS` table (Line / Call Count / New % / Existing % / Appt Scheduled %)
- `DIVISIONS` table (same columns)
- Page chrome: white background, light gray panel borders, exact font weights and sizes

## What swaps per industry (AI-generated)
A single edge function `industry-dashboard` calls Lovable AI Gateway with the setup form's company name + industry + scraped website context, and returns structured JSON:

```
{
  networkName: "Invoca for {Industry} 2.0",
  inquiryTypes: [3 stacked-bar categories],      // e.g. Scheduling / Billing / Insurance
  inquiryKpi: { label, percent },                // 3rd KPI tile
  searchTerms: [5 industry queries + call counts + appt %],
  campaigns: [3 campaign names + counts + %],
  linesOfBusiness: [3 rows],
  divisions: [5 rows]
}
```
Fixed (never swapped): Source labels (Paid Search/Organic/Direct Mail/Email/Social Media) and Medium labels (cpc/organic/Post Card/SFMC/Facebook) — those are generic marketing taxonomies, not industry-specific.

Numbers (call counts, %s) for KPIs, Call Trending, and bar charts are deterministically seeded from company name so they stay stable across reloads but differ per company.

## Files
- New `src/pages/invoca/InvocaDashboard.tsx` — full pixel-perfect rebuild composed of small section components
- New `src/components/invoca/sections/` — `KpiRow.tsx`, `CallTrending.tsx`, `MarketingTrio.tsx` (reused 4×), `LinesOfBusiness.tsx`, `Divisions.tsx`
- New `src/lib/invoca-industry.ts` — types + `useIndustryDashboard(company, industry)` hook (calls edge fn, caches in sessionStorage)
- New `supabase/functions/industry-dashboard/index.ts` — Lovable AI Gateway call, JSON tool-calling for the schema above
- Keep `InvocaShell.tsx` but tighten header/sidebar to match screenshots exactly (logo wordmark sizing, badge two-line, Network green label, sidebar icon spacing, NEW chip on Call Review)

## Out of scope for this pass
- Tooltips/hovers on charts (visual only)
- Functional date picker, save, share, download
- Other Invoca pages (Call Report, Call Review, Integrations) — they already exist and can be polished in a follow-up

## Quality check
After build I'll screenshot `/invoca` in the preview and diff it against the 5 reference images, then iterate on any visible deltas before handing back.

Approve and I'll build it.