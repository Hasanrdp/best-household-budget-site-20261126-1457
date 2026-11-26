// State for Hearth & Ledger: loads the seed data, keeps the household's own
// edits in localStorage, and derives every total the pages show, so a number
// can never be typed in two places and drift apart.

import {
  BILLS,
  CATEGORIES,
  GOALS,
  INCOME,
  MONTHLY_INCOME,
  MONTHLY_SPENDING,
  SAVINGS_PLAN,
  TRANSACTIONS,
} from './data.js';

const STORAGE_KEY = 'hearth-and-ledger-v1';

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

const stored = loadStored();

export const state = {
  transactions: Array.isArray(stored?.transactions) ? stored.transactions : TRANSACTIONS.slice(),
  goals: Array.isArray(stored?.goals) ? stored.goals : GOALS.map((g) => ({ ...g })),
  bills: Array.isArray(stored?.bills) ? stored.bills : BILLS.map((b) => ({ ...b })),
  budgets: stored?.budgets && typeof stored.budgets === 'object' ? stored.budgets : {},
};

export function saveState() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        transactions: state.transactions,
        goals: state.goals,
        bills: state.bills,
        budgets: state.budgets,
      }),
    );
  } catch {
    // Private browsing or a full store: the site still works for the session.
  }
}

export function resetDemo() {
  localStorage.removeItem(STORAGE_KEY);
  state.transactions = TRANSACTIONS.slice();
  state.goals = GOALS.map((g) => ({ ...g }));
  state.bills = BILLS.map((b) => ({ ...b }));
  state.budgets = {};
}

export function totalIncome() {
  return INCOME.reduce((sum, row) => sum + row.amount, 0);
}

export function budgetFor(category) {
  const custom = state.budgets[category.id];
  return typeof custom === 'number' && custom >= 0 ? custom : category.budget;
}

export function totalBudget() {
  return CATEGORIES.reduce((sum, c) => sum + budgetFor(c), 0);
}

export function spentByCategory() {
  const spent = {};
  for (const c of CATEGORIES) spent[c.id] = 0;
  for (const t of state.transactions) {
    if (spent[t.category] === undefined) spent[t.category] = 0;
    spent[t.category] += t.amount;
  }
  return spent;
}

export function totalSpent() {
  return state.transactions.reduce((sum, t) => sum + t.amount, 0);
}

export function moneyLeft() {
  return totalIncome() - totalSpent();
}

export function savingsRate() {
  const income = totalIncome();
  return income > 0 ? (SAVINGS_PLAN / income) * 100 : 0;
}

export function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id) ?? { id, name: id, color: '#64748b' };
}

export function monthlySpending() {
  // November's bar always reflects the live transactions, not a stale figure.
  return MONTHLY_SPENDING.map((row) =>
    row.month === 'Nov' ? { month: 'Nov', spent: Math.round(totalSpent()) } : row,
  );
}

export function monthlyIncome() {
  return MONTHLY_INCOME;
}

export function addTransaction({ date, description, category, amount }) {
  const clean = {
    id: `u${Date.now().toString(36)}`,
    date,
    description: description.trim(),
    category,
    amount: Math.round(amount * 100) / 100,
  };
  state.transactions.push(clean);
  state.transactions.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  saveState();
  return clean;
}

export function setBudget(categoryId, amount) {
  state.budgets[categoryId] = Math.max(0, Math.round(amount));
  saveState();
}

export function contributeToGoal(goalId, amount) {
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal) return null;
  goal.saved = Math.min(goal.target, Math.round((goal.saved + amount) * 100) / 100);
  saveState();
  return goal;
}

export function toggleBillPaid(billId) {
  const bill = state.bills.find((b) => b.id === billId);
  if (!bill) return null;
  bill.paid = !bill.paid;
  saveState();
  return bill;
}

export function upcomingBills() {
  return state.bills.filter((b) => !b.paid).sort((a, b) => (a.due < b.due ? -1 : 1));
}

export function paidBillsTotal() {
  return state.bills.filter((b) => b.paid).reduce((sum, b) => sum + b.amount, 0);
}

export function totalGoalsSaved() {
  return state.goals.reduce((sum, g) => sum + g.saved, 0);
}

export function totalGoalsTarget() {
  return state.goals.reduce((sum, g) => sum + g.target, 0);
}
