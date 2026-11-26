// Router and interactions for Hearth & Ledger. Hash routes, one per section,
// and the forms that make the site work: adding an expense, changing a
// budget, adding to a savings goal, marking a bill paid.
//
//   #/                Dashboard
//   #/transactions    Transactions, with filter and add-expense form
//   #/budgets         Budgets, one card per category, editable
//   #/goals           Savings goals, with add-savings forms
//   #/bills           Bills and recurring payments
//   #/reports         Reports: monthly chart, category donut, insights
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import {
  budgetsPage,
  billsPage,
  dashboard,
  goalsPage,
  missing,
  reportsPage,
  transactionsPage,
} from './views.js';
import {
  addTransaction,
  contributeToGoal,
  resetDemo,
  setBudget,
  toggleBillPaid,
} from './store.js';

const app = document.getElementById('app');
const nav = document.getElementById('nav');

const ROUTES = [
  { path: '', label: 'Dashboard' },
  { path: 'transactions', label: 'Transactions' },
  { path: 'budgets', label: 'Budgets' },
  { path: 'goals', label: 'Goals' },
  { path: 'bills', label: 'Bills' },
  { path: 'reports', label: 'Reports' },
];

function navHtml(active) {
  return ROUTES.map(
    (r) =>
      `<a href="#/${r.path}" ${r.path === active ? 'aria-current="page"' : ''}>${r.label}</a>`,
  ).join('');
}

function parseHash() {
  const hash = location.hash || '#/';
  const [path, queryString] = hash.slice(2).split('?');
  const params = new URLSearchParams(queryString ?? '');
  return { path: path ?? '', params };
}

function bindPage(route, params) {
  const addForm = document.getElementById('add-form');
  if (addForm) {
    addForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(addForm);
      const amount = Number(data.get('amount'));
      const description = String(data.get('description') ?? '');
      const date = String(data.get('date') ?? '2026-11-26');
      const category = String(data.get('category') ?? 'misc');
      const note = document.getElementById('add-note');
      if (!description.trim() || !(amount > 0) || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        if (note) note.textContent = 'Fill in the date, what it was and an amount over $0.';
        return;
      }
      addTransaction({ date, description, category, amount });
      render();
      const fresh = document.getElementById('add-note');
      if (fresh) fresh.textContent = `Added ${description.trim()} — $${amount.toFixed(2)}. Totals updated everywhere.`;
    });
  }

  const filterForm = document.getElementById('filter-form');
  if (filterForm) {
    filterForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(filterForm);
      const category = String(data.get('category') ?? 'all');
      const q = String(data.get('q') ?? '').trim();
      const next = new URLSearchParams();
      if (category !== 'all') next.set('category', category);
      if (q) next.set('q', q);
      location.hash = `#/transactions${next.toString() ? `?${next}` : ''}`;
    });
  }

  for (const form of document.querySelectorAll('.budget-form')) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const category = form.dataset.category ?? '';
      const amount = Number(new FormData(form).get('budget'));
      if (category && amount >= 0) {
        setBudget(category, amount);
        render();
      }
    });
  }

  for (const form of document.querySelectorAll('.goal-form')) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const goalId = form.dataset.goal ?? '';
      const amount = Number(new FormData(form).get('amount'));
      if (goalId && amount > 0) {
        contributeToGoal(goalId, amount);
        render();
      }
    });
  }

  for (const button of document.querySelectorAll('[data-bill]')) {
    button.addEventListener('click', () => {
      toggleBillPaid(button.dataset.bill ?? '');
      render();
    });
  }

  const resetButton = document.getElementById('reset-demo');
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      resetDemo();
      render();
    });
  }
}

function render() {
  window.__shotReady = false;
  const { path, params } = parseHash();
  let html;
  let title;
  if (path === '' || path === '/') {
    html = dashboard();
    title = 'Hearth & Ledger — The Marlowe Household Budget';
  } else if (path === 'transactions') {
    html = transactionsPage(params.get('category') ?? 'all', params.get('q') ?? '');
    title = 'Transactions | Hearth & Ledger';
  } else if (path === 'budgets') {
    html = budgetsPage();
    title = 'Budgets | Hearth & Ledger';
  } else if (path === 'goals') {
    html = goalsPage();
    title = 'Savings goals | Hearth & Ledger';
  } else if (path === 'bills') {
    html = billsPage();
    title = 'Bills | Hearth & Ledger';
  } else if (path === 'reports') {
    html = reportsPage();
    title = 'Reports | Hearth & Ledger';
  } else {
    html = missing();
    title = 'Not found | Hearth & Ledger';
  }
  nav.innerHTML = navHtml(path.replace(/^\//, ''));
  document.title = title;
  app.innerHTML = html;
  bindPage(path, params);
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();
