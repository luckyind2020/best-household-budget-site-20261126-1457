// Hearth Budget — UI logic: state, hash routing, rendering, and every control.
// State starts from the seed in data.js and persists edits to localStorage.

import {
  CATEGORIES, MONTHS, GOALS, UPCOMING_BILLS, HISTORY_6MO, DEMO_TODAY,
  HOUSEHOLD_NAME, monthSpent, monthTotalSpent, monthSaved, monthIncome,
} from "./data.js";
import { drawDonut, drawBars } from "./charts.js";

export const HEARTH_KEY = "hearth-budget-v1";

function loadState() {
  try {
    const raw = localStorage.getItem(HEARTH_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.months && parsed.goals) return parsed;
    }
  } catch (e) { /* fresh start on bad storage */ }
  return {
    months: JSON.parse(JSON.stringify(MONTHS)),
    goals: JSON.parse(JSON.stringify(GOALS)),
    month: "2026-11",
  };
}

function saveState(state) {
  try { localStorage.setItem(HEARTH_KEY, JSON.stringify(state)); } catch (e) { /* storage full/blocked */ }
}

export const state = loadState();

export function money(n) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function money0(n) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

function catById(id) {
  return CATEGORIES.find((c) => c.id === id) || { id, label: id, color: "#999" };
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function currentMonth() {
  return state.months[state.month];
}

function daysLeftInMonth() {
  const daysInMonth = new Date(DEMO_TODAY.year, DEMO_TODAY.month + 1, 0).getDate();
  return Math.max(0, daysInMonth - DEMO_TODAY.day);
}

const VIEWS = ["dashboard", "transactions", "budgets", "goals", "insights"];

export function currentView() {
  const hash = (location.hash || "#/dashboard").replace(/^#\/?/, "");
  return VIEWS.includes(hash) ? hash : "dashboard";
}

function navLink(view, label) {
  const active = currentView() === view ? ' aria-current="page" class="active"' : "";
  return `<a href="#/${view}"${active}>${label}</a>`;
}

export function renderChrome() {
  document.querySelector("header .household").textContent = HOUSEHOLD_NAME;
  document.getElementById("month-label").textContent = currentMonth().label;
  document.getElementById("nav").innerHTML =
    navLink("dashboard", "Dashboard") +
    navLink("transactions", "Transactions") +
    navLink("budgets", "Budgets") +
    navLink("goals", "Goals") +
    navLink("insights", "Insights");
}

export function renderDashboard() {
  const m = currentMonth();
  const income = monthIncome(m);
  const spent = monthTotalSpent(m);
  const saved = monthSaved(m);
  const left = income - spent - saved;
  const daysLeft = daysLeftInMonth();
  const slices = CATEGORIES.map((c) => ({ label: c.label, value: monthSpent(m, c.id), color: c.color }))
    .filter((s) => s.value > 0);
  const recent = [...m.transactions].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 6);
  const topCat = slices.slice().sort((a, b) => b.value - a.value)[0];
  const groceries = monthSpent(m, "groceries");
  const groceriesLimit = m.budgets.groceries || 1;
  const groceriesPace = groceries / groceriesLimit;
  const pacingNote = groceriesPace >= 1
    ? `Groceries are over budget at ${money(groceries)} of ${money(groceriesLimit)} — trim the last ${daysLeft} days.`
    : groceriesPace >= 0.9
      ? `Groceries are at ${(groceriesPace * 100).toFixed(0)}% of budget with ${daysLeft} days to go — nearly there, spend carefully.`
      : `Groceries are pacing well at ${(groceriesPace * 100).toFixed(0)}% of budget with ${daysLeft} days to go.`;

  document.getElementById("view").innerHTML = `
    <section class="cards">
      <div class="card stat"><span class="stat-label">Income</span><strong>${money(income)}</strong><span class="muted">${m.income.length} paychecks &amp; gigs</span></div>
      <div class="card stat"><span class="stat-label">Spent</span><strong>${money(spent)}</strong><span class="muted">${m.transactions.filter((t) => t.category !== "savings").length} expenses</span></div>
      <div class="card stat"><span class="stat-label">Saved</span><strong>${money(saved)}</strong><span class="muted">${((saved / income) * 100).toFixed(1)}% savings rate</span></div>
      <div class="card stat highlight"><span class="stat-label">Left to budget</span><strong>${money(left)}</strong><span class="muted">${daysLeft} days left in the month</span></div>
    </section>
    <section class="grid-2">
      <div class="card">
        <h2>Where the money went</h2>
        <canvas id="donut" width="300" height="300" role="img" aria-label="Donut chart of spending by category"></canvas>
        <ul class="legend">${slices.map((s) => `<li><span class="dot" style="background:${s.color}"></span>${esc(s.label)} — <strong>${money(s.value)}</strong></li>`).join("")}</ul>
      </div>
      <div class="card">
        <h2>Income vs spending — last 6 months</h2>
        <canvas id="bars" width="560" height="220" role="img" aria-label="Bar chart of income versus spending for the last six months"></canvas>
        <p class="legend-line"><span class="dot" style="background:#1e4d3b"></span> Income &nbsp; <span class="dot" style="background:#c96f4a"></span> Spent</p>
        <p>Biggest category this month: <strong>${esc(topCat ? topCat.label : "—")}</strong> at ${money(topCat ? topCat.value : 0)}. ${pacingNote}</p>
      </div>
    </section>
    <section class="grid-2">
      <div class="card">
        <h2>Recent transactions</h2>
        <ul class="tx-list">${recent.map(txRow).join("")}</ul>
        <p><a class="btn" href="#/transactions">See all transactions</a></p>
      </div>
      <div class="card">
        <h2>Upcoming bills</h2>
        <ul class="tx-list">${UPCOMING_BILLS.map((b) => `<li><span>${esc(b.desc)}<small>${b.date}</small></span><strong>${money(b.amount)}</strong></li>`).join("")}</ul>
        <p class="muted">December's mortgage lands on the 1st — ${money(1850)} is already set aside.</p>
      </div>
    </section>`;
  drawDonut(document.getElementById("donut"), slices);
  drawBars(document.getElementById("bars"), HISTORY_6MO);
}

function txRow(t) {
  const cat = catById(t.category);
  const label = t.category === "savings" ? "Savings" : cat.label;
  return `<li><span class="tx-cat" style="background:${t.category === "savings" ? "#2f7d5b" : cat.color}"></span>
    <span>${esc(t.desc)}<small>${t.date} · ${esc(label)}</small></span>
    <strong>${money(t.amount)}</strong></li>`;
}

export function renderTransactions() {
  const m = currentMonth();
  const filter = state.filter || "all";
  const query = (state.query || "").toLowerCase();
  const list = [...m.transactions]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .filter((t) => (filter === "all" ? true : t.category === filter))
    .filter((t) => !query || t.desc.toLowerCase().includes(query));
  const shown = list.filter((t) => t.category !== "savings" || filter === "savings");
  const total = shown.reduce((s, t) => s + t.amount, 0);

  document.getElementById("view").innerHTML = `
    <section class="card">
      <h2>Transactions — ${esc(m.label)}</h2>
      <div class="filters">
        <label>Category
          <select id="filter-cat">
            <option value="all">All categories</option>
            ${CATEGORIES.map((c) => `<option value="${c.id}"${filter === c.id ? " selected" : ""}>${c.label}</option>`).join("")}
            <option value="savings"${filter === "savings" ? " selected" : ""}>Savings</option>
          </select>
        </label>
        <label>Search
          <input id="filter-q" type="search" placeholder="e.g. Costco" value="${esc(state.query || "")}">
        </label>
        <span class="muted">${list.length} shown · expenses total ${money(total)}${filter === "all" && list.some((t) => t.category === "savings") ? " (savings transfers excluded)" : ""}</span>
      </div>
      <ul class="tx-list big">${list.map((t) => `
        <li><span class="tx-cat" style="background:${t.category === "savings" ? "#2f7d5b" : catById(t.category).color}"></span>
        <span>${esc(t.desc)}<small>${t.date} · ${esc(t.category === "savings" ? "Savings" : catById(t.category).label)}</small></span>
        <strong>${money(t.amount)}</strong>
        <button class="del" data-del="${t.id}" aria-label="Delete ${esc(t.desc)}">×</button></li>`).join("") || `<li class="muted">No transactions match.</li>`}</ul>
    </section>
    <section class="card">
      <h2>Add a transaction</h2>
      <form id="add-tx" class="form-grid">
        <label>Description<input name="desc" required maxlength="80" placeholder="e.g. Farmers market"></label>
        <label>Amount ($)<input name="amount" type="number" min="0.01" step="0.01" required placeholder="25.00"></label>
        <label>Date<input name="date" type="date" value="2026-11-27" required></label>
        <label>Category
          <select name="category">
            ${CATEGORIES.map((c) => `<option value="${c.id}">${c.label}</option>`).join("")}
            <option value="savings">Savings</option>
          </select>
        </label>
        <button class="btn primary" type="submit">Add transaction</button>
        <span id="add-msg" class="muted" role="status"></span>
      </form>
    </section>`;

  document.getElementById("filter-cat").addEventListener("change", (e) => {
    state.filter = e.target.value; render();
  });
  document.getElementById("filter-q").addEventListener("input", (e) => {
    state.query = e.target.value; renderTransactions();
  });
  document.querySelectorAll("[data-del]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-del");
      const idx = m.transactions.findIndex((t) => t.id === id);
      if (idx >= 0) { m.transactions.splice(idx, 1); saveState(state); render(); }
    });
  });
  document.getElementById("add-tx").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const amount = parseFloat(fd.get("amount"));
    if (!fd.get("desc") || !(amount > 0)) return;
    m.transactions.push({
      id: "t-user-" + Date.now(),
      date: fd.get("date") || "2026-11-27",
      desc: String(fd.get("desc")).slice(0, 80),
      category: fd.get("category"),
      amount: Math.round(amount * 100) / 100,
    });
    saveState(state);
    document.getElementById("add-msg").textContent = "Added — totals and charts updated.";
    render();
  });
}

export function renderBudgets() {
  const m = currentMonth();
  const rows = CATEGORIES.map((c) => {
    const limit = m.budgets[c.id] || 0;
    const spent = monthSpent(m, c.id);
    const pct = limit > 0 ? Math.min(100, (spent / limit) * 100) : 0;
    const over = spent > limit;
    return `<li class="budget-row">
      <span class="tx-cat" style="background:${c.color}"></span>
      <span class="budget-name">${c.label}<small>${money(spent)} of ${money(limit)} · ${pct.toFixed(0)}%</small></span>
      <span class="bar"><span style="width:${pct}%;background:${over ? "#b3402a" : c.color}"></span></span>
      <label class="budget-edit">$<input type="number" min="0" step="10" value="${limit}" data-budget="${c.id}" aria-label="${c.label} monthly budget"></label>
      <span class="${over ? "over" : "muted"}">${over ? "Over by " + money(spent - limit) : money(limit - spent) + " left"}</span>
    </li>`;
  }).join("");
  const totalLimit = Object.values(m.budgets).reduce((s, v) => s + v, 0);
  const totalSpent = monthTotalSpent(m);

  document.getElementById("view").innerHTML = `
    <section class="card">
      <h2>Budgets — ${esc(m.label)}</h2>
      <p class="muted">Total budgeted ${money(totalLimit)} · spent ${money(totalSpent)} · ${money(totalLimit - totalSpent)} remaining overall. Edit any limit and the bars update at once.</p>
      <ul class="tx-list big">${rows}</ul>
    </section>`;
  document.querySelectorAll("[data-budget]").forEach((input) => {
    input.addEventListener("change", () => {
      const v = parseFloat(input.value);
      if (v >= 0) { m.budgets[input.getAttribute("data-budget")] = Math.round(v); saveState(state); render(); }
    });
  });
}

export function renderGoals() {
  document.getElementById("view").innerHTML = `
    <section class="card">
      <h2>Savings goals</h2>
      <p class="muted">Tap a button to log a contribution — progress updates immediately and is saved on this device.</p>
      <ul class="goal-list">${state.goals.map((g) => {
        const pct = Math.min(100, (g.saved / g.target) * 100);
        return `<li class="goal">
          <div class="goal-head"><strong>${esc(g.name)}</strong><span>${money(g.saved)} of ${money(g.target)}</span></div>
          <span class="bar big"><span style="width:${pct}%;background:#2f7d5b"></span></span>
          <p class="muted">${esc(g.note)} · ${pct.toFixed(0)}% there · ${money(g.target - g.saved)} to go</p>
          <div class="goal-btns">
            <button class="btn" data-goal="${g.id}" data-amt="25">+ $25</button>
            <button class="btn" data-goal="${g.id}" data-amt="50">+ $50</button>
            <button class="btn" data-goal="${g.id}" data-amt="100">+ $100</button>
          </div>
        </li>`;
      }).join("")}</ul>
    </section>`;
  document.querySelectorAll("[data-goal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const g = state.goals.find((x) => x.id === btn.getAttribute("data-goal"));
      if (g) { g.saved += parseFloat(btn.getAttribute("data-amt")); saveState(state); render(); }
    });
  });
}

export function renderInsights() {
  const m = currentMonth();
  const prev = state.months["2026-10"];
  const income = monthIncome(m);
  const spent = monthTotalSpent(m);
  const saved = monthSaved(m);
  const top = CATEGORIES.map((c) => ({ label: c.label, spent: monthSpent(m, c.id) }))
    .sort((a, b) => b.spent - a.spent)[0];
  const prevSpent = prev ? monthTotalSpent(prev) : 0;
  const delta = prevSpent ? ((spent - prevSpent) / prevSpent) * 100 : 0;
  const daysLeft = daysLeftInMonth();
  const dailyBudget = daysLeft > 0 ? (income - spent - saved) / daysLeft : 0;
  const groceries = monthSpent(m, "groceries");
  const groceriesPace = groceries / m.budgets.groceries;

  document.getElementById("view").innerHTML = `
    <section class="card">
      <h2>Insights — ${esc(m.label)}</h2>
      <ul class="insight-list">
        <li><strong>Savings rate is ${((saved / income) * 100).toFixed(1)}%.</strong> ${money(saved)} of ${money(income)} went to savings. The usual healthy target is 20% — one more ${money(170)} transfer this month gets you there.</li>
        <li><strong>${esc(top.label)} is the biggest spend</strong> at ${money(top.spent)}. Housing is fixed, so the lever is groceries and dining out.</li>
        <li><strong>Spending is ${delta <= 0 ? "down" : "up"} ${Math.abs(delta).toFixed(1)}% vs October</strong> (${money(prevSpent)} → ${money(spent)}). Groceries are at ${(groceriesPace * 100).toFixed(0)}% of budget with ${daysLeft} days left — ${groceriesPace < 0.95 ? "on track" : "watch it"}.</li>
        <li><strong>Daily allowance: ${money(dailyBudget)} a day</strong> for the remaining ${daysLeft} days if you want to end the month exactly on plan.</li>
        <li><strong>Utilities ran over budget</strong> (${money(monthSpent(m, "utilities"))} vs ${money(m.budgets.utilities)}). The electric bill was ${money(128.4)} — check the thermostat schedule before December.</li>
      </ul>
    </section>
    <section class="card">
      <h2>How this site works</h2>
      <p>Everything runs in your browser — no account, no uploads. Add or delete transactions, edit budgets, and fund goals; your changes save on this device. Switch months above to compare November with October.</p>
    </section>`;
}

export function render() {
  renderChrome();
  const view = currentView();
  if (view === "transactions") renderTransactions();
  else if (view === "budgets") renderBudgets();
  else if (view === "goals") renderGoals();
  else if (view === "insights") renderInsights();
  else renderDashboard();
  window.scrollTo(0, 0);
}

export function initApp() {
  document.getElementById("month-prev").addEventListener("click", () => {
    state.month = state.month === "2026-11" ? "2026-10" : "2026-11";
    saveState(state); render();
  });
  document.getElementById("month-next").addEventListener("click", () => {
    state.month = state.month === "2026-10" ? "2026-11" : "2026-10";
    saveState(state); render();
  });
  document.getElementById("reset-demo").addEventListener("click", () => {
    localStorage.removeItem(HEARTH_KEY);
    location.hash = "#/dashboard";
    location.reload();
  });
  window.addEventListener("hashchange", render);
  render();
}
