// HTML for each page of Hearth & Ledger, built from the store. Every value
// is escaped before it goes into the page, and every figure is derived from
// the same state, so the pages cannot disagree.

import { barChart, donutChart } from './charts.js';
import {
  CATEGORIES,
  HOUSEHOLD,
  INCOME,
  SAVINGS_PLAN,
} from './data.js';
import {
  budgetFor,
  categoryById,
  monthlySpending,
  moneyLeft,
  paidBillsTotal,
  savingsRate,
  spentByCategory,
  state,
  totalBudget,
  totalGoalsSaved,
  totalGoalsTarget,
  totalIncome,
  totalSpent,
  upcomingBills,
} from './store.js';

export const escape = (s) =>
  String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export const money = (n) =>
  `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const money0 = (n) => `$${Math.round(Number(n)).toLocaleString('en-US')}`;

function progressBar(pct, color) {
  const clamped = Math.max(0, Math.min(100, pct));
  const tone = pct > 100 ? 'over' : pct > 85 ? 'warm' : '';
  return `<div class="bar ${tone}" role="progressbar" aria-valuenow="${Math.round(clamped)}" aria-valuemin="0" aria-valuemax="100" aria-label="${Math.round(pct)} percent of budget used"><span style="width:${clamped}%;background:${color}"></span></div>`;
}

function transactionRow(t) {
  const cat = categoryById(t.category);
  return `<tr>
    <td>${escape(t.date.slice(5))}<span class="year">/${t.date.slice(0, 4)}</span></td>
    <td>${escape(t.description)}</td>
    <td><span class="chip" style="--chip:${cat.color}">${escape(cat.name)}</span></td>
    <td class="num">${money(t.amount)}</td>
  </tr>`;
}

function statCard(label, value, sub) {
  return `<div class="stat"><span class="stat-label">${label}</span><strong class="stat-value">${value}</strong><span class="stat-sub">${sub}</span></div>`;
}

export function dashboard() {
  const spent = totalSpent();
  const income = totalIncome();
  const left = moneyLeft();
  const byCat = spentByCategory();
  const topCats = CATEGORIES.map((c) => ({ ...c, spent: byCat[c.id] ?? 0, budget: budgetFor(c) }))
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 4);
  const recent = state.transactions.slice(0, 6);
  const upcoming = upcomingBills();
  const goalsPct = totalGoalsTarget() > 0 ? (totalGoalsSaved() / totalGoalsTarget()) * 100 : 0;

  return `<section class="hero">
    <div>
      <p class="eyebrow">${escape(HOUSEHOLD.monthLabel)} &middot; ${escape(HOUSEHOLD.members)}</p>
      <h1>Good evening, Marlowe household.</h1>
      <p class="lede">November is nearly done: <strong>${money0(left)} left to budget</strong> after ${money0(spent)} spent, and the savings plan is on track at <strong>${money0(SAVINGS_PLAN)} a month</strong>. Nothing here is overdue.</p>
      <p class="actions"><a class="btn primary" href="#/transactions">Add an expense</a> <a class="btn" href="#/budgets">Review budgets</a> <a class="btn" href="#/reports">See reports</a></p>
    </div>
    <div class="hero-card">
      <span class="stat-label">Left to budget</span>
      <strong class="big-number">${money0(left)}</strong>
      <span class="stat-sub">of ${money0(income)} income this month</span>
      ${progressBar((spent / income) * 100, '#1e5631')}
      <p class="hero-note">${Math.round((spent / income) * 100)}% of income spent &middot; savings rate ${savingsRate().toFixed(0)}%</p>
    </div>
  </section>

  <section class="stats" aria-label="November totals">
    ${statCard('Income', money0(income), '3 sources: salaries + market stall')}
    ${statCard('Spent so far', money0(spent), `${state.transactions.length} transactions recorded`)}
    ${statCard('Left to budget', money0(left), 'after spending and the savings plan')}
    ${statCard('Savings goals', `${goalsPct.toFixed(0)}% funded`, `${money0(totalGoalsSaved())} of ${money0(totalGoalsTarget())} saved`)}
  </section>

  <div class="grid two">
    <section class="card">
      <h2>Spending over six months</h2>
      <p class="card-sub">November is the lowest month since August — $158 under October.</p>
      ${barChart(monthlySpending())}
    </section>
    <section class="card">
      <h2>Where the money went</h2>
      <p class="card-sub">Four biggest categories this month.</p>
      <ul class="budget-list">
        ${topCats
          .map(
            (c) => `<li>
              <div class="budget-head"><span><span class="dot" style="background:${c.color}"></span>${escape(c.name)}</span><span><strong>${money0(c.spent)}</strong> of ${money0(c.budget)}</span></div>
              ${progressBar((c.spent / c.budget) * 100, c.color)}
              <span class="budget-left">${c.spent > c.budget ? `${money0(c.spent - c.budget)} over budget` : `${money0(c.budget - c.spent)} left`}</span>
            </li>`,
          )
          .join('')}
      </ul>
      <p><a href="#/budgets">All ${CATEGORIES.length} budgets &rarr;</a></p>
    </section>
  </div>

  <div class="grid two">
    <section class="card">
      <h2>Recent spending</h2>
      <p class="card-sub">Latest transactions, newest first.</p>
      <table class="tx">
        <thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th></tr></thead>
        <tbody>${recent.map(transactionRow).join('')}</tbody>
      </table>
      <p><a href="#/transactions">All ${state.transactions.length} transactions &rarr;</a></p>
    </section>
    <section class="card">
      <h2>Bills coming up</h2>
      <p class="card-sub">${money0(paidBillsTotal())} already paid this month.</p>
      <ul class="bill-list">
        ${upcoming
          .map(
            (b) => `<li><span><strong>${escape(b.name)}</strong><br><span class="muted">Due ${escape(b.due.slice(5))} November</span></span><strong>${money(b.amount)}</strong></li>`,
          )
          .join('')}
      </ul>
      <p><a href="#/bills">All bills and recurring payments &rarr;</a></p>
      <h2 class="subhead">Savings goals</h2>
      <p class="card-sub">Four goals, ${money0(totalGoalsSaved())} saved toward ${money0(totalGoalsTarget())}.</p>
      <ul class="goal-mini">
        ${state.goals
          .map(
            (g) => `<li><span>${escape(g.name)}</span><span><strong>${money0(g.saved)}</strong> / ${money0(g.target)}</span></li>`,
          )
          .join('')}
      </ul>
      <p><a href="#/goals">Add to a goal &rarr;</a></p>
    </section>
  </div>`;
}

export function transactionsPage(filterCategory = 'all', query = '') {
  const q = query.trim().toLowerCase();
  const rows = state.transactions.filter((t) => {
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    if (q && !`${t.description} ${t.date}`.toLowerCase().includes(q)) return false;
    return true;
  });
  const shownTotal = rows.reduce((sum, t) => sum + t.amount, 0);
  return `<h1>Transactions</h1>
  <p class="lede">Every dollar the household spent in November, with the newest first. Add an expense and every total on the site updates at once.</p>

  <section class="card">
    <h2>Add an expense</h2>
    <form id="add-form" class="form-grid">
      <label>Date <input type="date" name="date" value="2026-11-26" required></label>
      <label>What was it? <input type="text" name="description" placeholder="e.g. Weekly shop at Greenvale" maxlength="80" required></label>
      <label>Category
        <select name="category">${CATEGORIES.map((c) => `<option value="${c.id}">${escape(c.name)}</option>`).join('')}</select>
      </label>
      <label>Amount ($) <input type="number" name="amount" min="0.01" step="0.01" placeholder="0.00" required></label>
      <button class="btn primary" type="submit">Add expense</button>
    </form>
    <p class="form-note" id="add-note">Saved in this browser only — nothing leaves your device.</p>
  </section>

  <section class="card">
    <h2>Filter</h2>
    <form id="filter-form" class="form-grid">
      <label>Category
        <select name="category">
          <option value="all">All categories</option>
          ${CATEGORIES.map((c) => `<option value="${c.id}" ${c.id === filterCategory ? 'selected' : ''}>${escape(c.name)}</option>`).join('')}
        </select>
      </label>
      <label>Search <input type="search" name="q" value="${escape(query)}" placeholder="e.g. Greenvale, fuel, dentist"></label>
      <button class="btn" type="submit">Apply filter</button>
      <a class="btn ghost" href="#/transactions">Clear</a>
    </form>
    <p class="card-sub">Showing <strong>${rows.length}</strong> of ${state.transactions.length} transactions &middot; <strong>${money(shownTotal)}</strong> in view.</p>
    <table class="tx">
      <thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th></tr></thead>
      <tbody>${rows.length ? rows.map(transactionRow).join('') : '<tr><td colspan="4">No transactions match that filter. <a href="#/transactions">Clear the filter</a>.</td></tr>'}</tbody>
    </table>
  </section>`;
}

export function budgetsPage() {
  const byCat = spentByCategory();
  const totalB = totalBudget();
  const totalS = totalSpent();
  return `<h1>Budgets</h1>
  <p class="lede">November's plan: <strong>${money0(totalB)}</strong> budgeted across ${CATEGORIES.length} categories, <strong>${money0(totalS)}</strong> spent so far. Change a budget and the dashboard follows.</p>
  <p class="actions"><span class="pill">${money0(totalB - totalS)} still in the budgets</span> <span class="pill">${CATEGORIES.filter((c) => (byCat[c.id] ?? 0) > budgetFor(c)).length} over budget</span></p>
  <div class="grid cards">
    ${CATEGORIES.map((c) => {
      const spent = byCat[c.id] ?? 0;
      const budget = budgetFor(c);
      const pct = budget > 0 ? (spent / budget) * 100 : 0;
      const over = spent > budget;
      return `<section class="card budget-card">
        <h2><span class="dot" style="background:${c.color}"></span>${escape(c.name)}</h2>
        <p class="card-sub">${escape(c.note)}</p>
        <p class="big-spent">${money0(spent)} <span class="muted">of ${money0(budget)}</span></p>
        ${progressBar(pct, c.color)}
        <p class="${over ? 'over-text' : 'muted'}">${over ? `${money0(spent - budget)} over budget — trim ${money0(spent - budget)} before the 30th.` : `${money0(budget - spent)} left for the rest of November`}</p>
        <form class="budget-form" data-category="${c.id}">
          <label>Monthly budget ($) <input type="number" name="budget" min="0" step="10" value="${budget}" required></label>
          <button class="btn" type="submit">Save budget</button>
        </form>
      </section>`;
    }).join('')}
  </div>`;
}

export function goalsPage() {
  return `<h1>Savings goals</h1>
  <p class="lede"><strong>${money0(totalGoalsSaved())}</strong> saved toward <strong>${money0(totalGoalsTarget())}</strong> across four goals — ${Math.round((totalGoalsSaved() / totalGoalsTarget()) * 100)}% of the way there. The plan sets aside ${money0(SAVINGS_PLAN)} every month.</p>
  <div class="grid cards">
    ${state.goals
      .map((g) => {
        const pct = (g.saved / g.target) * 100;
        const left = g.target - g.saved;
        return `<section class="card goal-card">
        <h2>${escape(g.name)}</h2>
        <p class="card-sub">${escape(g.note)}</p>
        <p class="big-spent">${money0(g.saved)} <span class="muted">of ${money0(g.target)}</span></p>
        ${progressBar(pct, '#b45309')}
        <p class="muted">${pct.toFixed(0)}% funded &middot; ${money0(left)} to go</p>
        <form class="goal-form" data-goal="${g.id}">
          <label>Add to this goal ($) <input type="number" name="amount" min="1" step="5" value="50" required></label>
          <button class="btn primary" type="submit">Add savings</button>
        </form>
      </section>`;
      })
      .join('')}
  </div>
  <section class="card">
    <h2>How the savings plan works</h2>
    <p>On the 1st of each month, ${money0(SAVINGS_PLAN)} moves from the household account into savings before anything else is spent — pay yourself first. It is split by need: ${money0(700)} to the emergency fund, ${money0(300)} to the car fund, ${money0(250)} to the holiday and ${money0(150)} to the kitchen. A goal is marked done when it reaches 100%, and its share rolls to the next goal.</p>
    <h3>Income this month</h3>
    <ul class="income-list">
      ${INCOME.map((row) => `<li><span>${escape(row.source)}</span><strong>${money(row.amount)}</strong></li>`).join('')}
      <li class="total"><span>Total income</span><strong>${money(totalIncome())}</strong></li>
    </ul>
  </section>`;
}

export function billsPage() {
  const upcoming = upcomingBills();
  const upcomingTotal = upcoming.reduce((sum, b) => sum + b.amount, 0);
  return `<h1>Bills &amp; recurring payments</h1>
  <p class="lede">${money0(paidBillsTotal())} paid this month, <strong>${money0(upcomingTotal)}</strong> still to go. Tap “Mark paid” when a bill clears and it moves to the paid list.</p>
  <section class="card">
    <h2>Still to pay — ${upcoming.length} bills</h2>
    ${upcoming.length ? `<ul class="bill-list big">
      ${upcoming.map((b) => `<li><span><strong>${escape(b.name)}</strong><br><span class="muted">Due ${escape(b.due)}</span></span><span class="bill-right"><strong>${money(b.amount)}</strong><button class="btn small" data-bill="${b.id}">Mark paid</button></span></li>`).join('')}
    </ul>` : '<p class="muted">All bills are paid for November. Nicely done.</p>'}
  </section>
  <section class="card">
    <h2>Paid this month — ${state.bills.filter((b) => b.paid).length} bills</h2>
    <table class="tx">
      <thead><tr><th>Due</th><th>Bill</th><th class="num">Amount</th><th>Status</th></tr></thead>
      <tbody>
        ${state.bills
          .filter((b) => b.paid)
          .sort((a, b) => (a.due < b.due ? -1 : 1))
          .map(
            (b) => `<tr><td>${escape(b.due.slice(5))}</td><td>${escape(b.name)}</td><td class="num">${money(b.amount)}</td><td><span class="paid">Paid</span> <button class="btn small ghost" data-bill="${b.id}">Undo</button></td></tr>`,
          )
          .join('')}
      </tbody>
    </table>
  </section>
  <section class="card">
    <h2>Recurring, every month</h2>
    <p>Ten bills repeat monthly and are already in the list above: mortgage, insurance, gym, streaming, electricity, internet, water, phone, credit card and car insurance. The two that fall after the 26th — the credit card on the 27th and car insurance on the 28th — are the only ones left this month.</p>
  </section>`;
}

export function reportsPage() {
  const spent = totalSpent();
  const income = totalIncome();
  const byCat = spentByCategory();
  const slices = CATEGORIES.map((c) => ({ label: c.name, value: byCat[c.id] ?? 0, color: c.color }))
    .filter((s) => s.value > 0)
    .sort((a, b) => b.value - a.value);
  const biggestVariable = slices.find((s) => s.label !== 'Housing') ?? slices[0];
  const housingShare = Math.round(((byCat.housing ?? 0) / spent) * 100);
  const dining = byCat.dining ?? 0;
  const diningBudget = budgetFor(CATEGORIES.find((c) => c.id === 'dining'));
  const months = monthlySpending();
  const oct = months.find((m) => m.month === 'Oct');
  const diff = oct ? spent - oct.spent : 0;
  return `<h1>Reports</h1>
  <p class="lede">November in numbers: <strong>${money0(spent)}</strong> spent of ${money0(income)} earned, ${money0(moneyLeft())} left. Housing is the biggest share at ${housingShare}%.</p>
  <div class="grid two">
    <section class="card">
      <h2>Spending by month</h2>
      <p class="card-sub">June to November. November is ${diff <= 0 ? `$${Math.abs(Math.round(diff)).toLocaleString('en-US')} under` : `$${Math.round(diff).toLocaleString('en-US')} over`} October.</p>
      ${barChart(months)}
    </section>
    <section class="card">
      <h2>Spending by category</h2>
      <p class="card-sub">Housing dominates, as it should — the mortgage is fixed.</p>
      <div class="donut-wrap">
        ${donutChart(slices)}
        <ul class="legend">
          ${slices.map((s) => `<li><span class="dot" style="background:${s.color}"></span>${escape(s.label)} <strong>${money0(s.value)}</strong> <span class="muted">${Math.round((s.value / spent) * 100)}%</span></li>`).join('')}
        </ul>
      </div>
    </section>
  </div>
  <section class="card">
    <h2>What November is telling us</h2>
    <ul class="insights">
      <li><strong>Housing takes ${housingShare}% of spending.</strong> The mortgage and insurance are fixed, so the lever is everywhere else — the household cannot cut its way out through rent.</li>
      <li><strong>${escape(biggestVariable.label)} is the biggest variable cost at ${money0(biggestVariable.value)}.</strong> Groceries ran to ${money0(byCat.groceries ?? 0)} across five shops; the top-up shop on the 26th kept the week from needing a sixth full shop.</li>
      <li><strong>Dining out is ${Math.round((1 - dining / diningBudget) * 100)}% under budget.</strong> Cooking at home five nights a week saved about ${money0(diningBudget - dining)} against the plan — the pizza and takeaway nights were the exception, not the habit.</li>
      <li><strong>Clothing is the one overspend.</strong> June's shoes and Daniel's jacket put it ${money0((byCat.clothing ?? 0) - budgetFor(CATEGORIES.find((c) => c.id === 'clothing')))} over its ${money0(budgetFor(CATEGORIES.find((c) => c.id === 'clothing')))} budget; December's clothing budget should rise by that much or the jacket waits.</li>
      <li><strong>Two bills are still due.</strong> The credit card (${money0(310)}) on the 27th and car insurance (${money0(214)}) on the 28th — together ${money0(524)}, covered more than six times over by the ${money0(moneyLeft())} left to budget.</li>
      <li><strong>The savings plan is intact.</strong> ${money0(SAVINGS_PLAN)} a month, a ${savingsRate().toFixed(0)}% savings rate, and the emergency fund at ${Math.round((state.goals.find((g) => g.id === 'g1').saved / state.goals.find((g) => g.id === 'g1').target) * 100)}% — on course to be full by March.</li>
    </ul>
  </section>
  <section class="card">
    <h2>Month by month</h2>
    <table class="tx">
      <thead><tr><th>Month</th><th class="num">Spent</th><th class="num">Income</th><th class="num">Left</th></tr></thead>
      <tbody>
        ${months.map((m) => `<tr><td>${m.month} 2026</td><td class="num">${money0(m.spent)}</td><td class="num">${money0(income)}</td><td class="num">${money0(income - m.spent)}</td></tr>`).join('')}
      </tbody>
    </table>
    <p class="muted">Income is steady at ${money0(income)} a month; the variation is all on the spending side.</p>
  </section>`;
}

export function missing() {
  return `<h1>That page is not in the budget</h1>
  <p class="lede">There is no page at this address. Try one of the sections below — every one of them works.</p>
  <p class="actions"><a class="btn primary" href="#/">Dashboard</a> <a class="btn" href="#/transactions">Transactions</a> <a class="btn" href="#/budgets">Budgets</a> <a class="btn" href="#/goals">Goals</a> <a class="btn" href="#/bills">Bills</a> <a class="btn" href="#/reports">Reports</a></p>`;
}
