# best-household-budget-site-20261126-1457

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/Hasanrdp/best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/Hasanrdp/best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

Hearth & Ledger — a household budget site for the Marlowe household (Maya & Daniel, with June, 9, and Theo, 6), November 2026. Six working sections, all reachable from the navigation: a dashboard with income, spending, savings rate and a six-month chart; transactions with a filter and a working add-expense form; editable budgets for eleven categories; four savings goals you can add to; bills with mark-paid toggles; and reports with a monthly chart, a category donut and plain-language insights. Every figure is derived from one set of seeded data, so the pages can never disagree, and every edit is kept in the browser's local storage — nothing leaves the device.

## The site

Plain static files under `app/`, no build step and no network request:

- `app/index.html` — the shell: header, navigation, footer
- `app/style.css` — the whole look: cream paper, deep green, amber accents
- `app/data.js` — the household's seeded data: income, 11 categories, 35 November transactions, 4 savings goals, 10 bills, 6 months of spending
- `app/store.js` — state, localStorage, and every derived total
- `app/charts.js` — hand-drawn SVG bar chart and donut, no library
- `app/views.js` — HTML for the six pages
- `app/main.js` — hash router and the forms that make the site work

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — and shrink the window to a phone's width to see the mobile layout. Or open `app/index.html` directly from any static server.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's vendored `vendor/makefun-frontend.ts`.

## Screenshots

Four real renders of the site running in Chromium, under `screenshots/`:

1. `1-dashboard.jpg` — dashboard, desktop 1280×800
2. `2-budgets.jpg` — budgets, desktop 1280×800
3. `3-reports.jpg` — reports, desktop 1280×800
4. `4-dashboard-phone.jpg` — dashboard, phone 390×844

---

<sub>Entered on [make.fun](https://make.fun/?ref=asjct23w&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
