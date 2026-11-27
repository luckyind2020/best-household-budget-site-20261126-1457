// Hearth Budget — seed data for the Marlowe household.
// All figures are demo data for November 2026 (and October 2026 for comparison).
// The app stores edits in localStorage under HEARTH_KEY; this file only seeds it.

export const DEMO_TODAY = { year: 2026, month: 10, day: 27 }; // 27 Nov 2026 (month is 0-based)
export const HOUSEHOLD_NAME = "The Marlowe Household";
export const CURRENCY = "USD";

export const CATEGORIES = [
  { id: "housing", label: "Housing", color: "#1e4d3b" },
  { id: "groceries", label: "Groceries", color: "#2f7d5b" },
  { id: "dining", label: "Dining Out", color: "#c96f4a" },
  { id: "transport", label: "Transport", color: "#4a7fb5" },
  { id: "utilities", label: "Utilities", color: "#8a6fb8" },
  { id: "entertainment", label: "Entertainment", color: "#c9a13b" },
  { id: "kids", label: "Kids", color: "#d97b9c" },
  { id: "health", label: "Health", color: "#4aa8a0" },
  { id: "shopping", label: "Shopping", color: "#7a6a58" },
];

export const MONTHS = {
  "2026-11": {
    label: "November 2026",
    income: [
      { id: "inc-1101a", date: "2026-11-01", desc: "Salary — Dana Marlowe", amount: 3400 },
      { id: "inc-1101b", date: "2026-11-01", desc: "Salary — Alex Marlowe", amount: 2500 },
      { id: "inc-1114", date: "2026-11-14", desc: "Freelance design work", amount: 950 },
    ],
    transactions: [
      { id: "t-1101", date: "2026-11-01", desc: "Mortgage payment", category: "housing", amount: 1850.0 },
      { id: "t-1101b", date: "2026-11-01", desc: "Streaming subscriptions", category: "entertainment", amount: 15.99 },
      { id: "t-1102", date: "2026-11-02", desc: "Whole Foods Market", category: "groceries", amount: 142.6 },
      { id: "t-1102b", date: "2026-11-02", desc: "Transfer to emergency fund", category: "savings", amount: 1200.0 },
      { id: "t-1103", date: "2026-11-03", desc: "Olive Garden dinner", category: "dining", amount: 48.2 },
      { id: "t-1104", date: "2026-11-04", desc: "Shell — gas", category: "transport", amount: 58.0 },
      { id: "t-1105", date: "2026-11-05", desc: "Internet bill", category: "utilities", amount: 89.0 },
      { id: "t-1106", date: "2026-11-06", desc: "Trader Joe's", category: "groceries", amount: 86.4 },
      { id: "t-1106b", date: "2026-11-06", desc: "CVS pharmacy", category: "health", amount: 35.0 },
      { id: "t-1107", date: "2026-11-07", desc: "School lunch account", category: "kids", amount: 95.0 },
      { id: "t-1108", date: "2026-11-08", desc: "Electric bill", category: "utilities", amount: 128.4 },
      { id: "t-1109", date: "2026-11-09", desc: "Sushi lunch", category: "dining", amount: 62.4 },
      { id: "t-1110", date: "2026-11-10", desc: "Car insurance", category: "transport", amount: 120.0 },
      { id: "t-1111", date: "2026-11-11", desc: "Water bill", category: "utilities", amount: 64.2 },
      { id: "t-1112", date: "2026-11-12", desc: "Costco run", category: "groceries", amount: 118.25 },
      { id: "t-1112b", date: "2026-11-12", desc: "Kids' winter clothes", category: "shopping", amount: 78.9 },
      { id: "t-1113", date: "2026-11-13", desc: "Swim lessons", category: "kids", amount: 60.0 },
      { id: "t-1114b", date: "2026-11-14", desc: "Movie night", category: "entertainment", amount: 42.0 },
      { id: "t-1115", date: "2026-11-15", desc: "Pizza night", category: "dining", amount: 35.75 },
      { id: "t-1116", date: "2026-11-16", desc: "Shell — gas", category: "transport", amount: 42.5 },
      { id: "t-1117", date: "2026-11-17", desc: "Dentist copay", category: "health", amount: 120.0 },
      { id: "t-1118", date: "2026-11-18", desc: "Trader Joe's", category: "groceries", amount: 94.1 },
      { id: "t-1119", date: "2026-11-19", desc: "School book fair", category: "kids", amount: 45.0 },
      { id: "t-1120", date: "2026-11-20", desc: "Parking downtown", category: "transport", amount: 38.0 },
      { id: "t-1121", date: "2026-11-21", desc: "Burger joint", category: "dining", amount: 54.9 },
      { id: "t-1122", date: "2026-11-22", desc: "Home goods store", category: "shopping", amount: 112.4 },
      { id: "t-1123", date: "2026-11-23", desc: "Whole Foods Market", category: "groceries", amount: 67.8 },
      { id: "t-1124", date: "2026-11-24", desc: "Concert tickets", category: "entertainment", amount: 28.5 },
      { id: "t-1126", date: "2026-11-26", desc: "Thanksgiving takeout", category: "dining", amount: 41.3 },
      { id: "t-1127", date: "2026-11-27", desc: "Costco run", category: "groceries", amount: 121.55 },
    ],
    budgets: {
      housing: 1850, groceries: 700, dining: 300, transport: 320,
      utilities: 260, entertainment: 180, kids: 250, health: 200, shopping: 350,
    },
  },
  "2026-10": {
    label: "October 2026",
    income: [
      { id: "inc-1001a", date: "2026-10-01", desc: "Salary — Dana Marlowe", amount: 3400 },
      { id: "inc-1001b", date: "2026-10-01", desc: "Salary — Alex Marlowe", amount: 2500 },
      { id: "inc-1016", date: "2026-10-16", desc: "Freelance design work", amount: 700 },
    ],
    transactions: [
      { id: "t-1001", date: "2026-10-01", desc: "Mortgage payment", category: "housing", amount: 1850.0 },
      { id: "t-1003", date: "2026-10-03", desc: "Whole Foods Market", category: "groceries", amount: 158.2 },
      { id: "t-1007", date: "2026-10-07", desc: "Electric bill", category: "utilities", amount: 141.1 },
      { id: "t-1010", date: "2026-10-10", desc: "Car insurance", category: "transport", amount: 120.0 },
      { id: "t-1012", date: "2026-10-12", desc: "Costco run", category: "groceries", amount: 132.9 },
      { id: "t-1014", date: "2026-10-14", desc: "Dinner with friends", category: "dining", amount: 88.4 },
      { id: "t-1018", date: "2026-10-18", desc: "Trader Joe's", category: "groceries", amount: 97.3 },
      { id: "t-1021", date: "2026-10-21", desc: "Kids' soccer fees", category: "kids", amount: 110.0 },
      { id: "t-1024", date: "2026-10-24", desc: "Pharmacy + clinic", category: "health", amount: 96.5 },
      { id: "t-1026", date: "2026-10-26", desc: "Whole Foods Market", category: "groceries", amount: 121.4 },
      { id: "t-1028", date: "2026-10-28", desc: "Movie + popcorn", category: "entertainment", amount: 56.0 },
      { id: "t-1030", date: "2026-10-30", desc: "Halloween costumes", category: "shopping", amount: 84.2 },
    ],
    budgets: {
      housing: 1850, groceries: 700, dining: 300, transport: 320,
      utilities: 260, entertainment: 180, kids: 250, health: 200, shopping: 350,
    },
  },
};

export const HISTORY_6MO = [
  { month: "Jun", income: 6400, spent: 4100 },
  { month: "Jul", income: 6600, spent: 4350 },
  { month: "Aug", income: 6500, spent: 3980 },
  { month: "Sep", income: 6850, spent: 4210 },
  { month: "Oct", income: 6600, spent: 4120 },
  { month: "Nov", income: 6850, spent: 3896 },
];

export const GOALS = [
  { id: "g-emergency", name: "Emergency fund", target: 8000, saved: 5400, note: "6 months of essentials" },
  { id: "g-vacation", name: "Family vacation", target: 2500, saved: 1150, note: "Beach trip next summer" },
  { id: "g-car", name: "New car down payment", target: 6000, saved: 2300, note: "Replace the 2012 sedan" },
];

export const UPCOMING_BILLS = [
  { date: "2026-12-01", desc: "Mortgage payment", amount: 1850.0 },
  { date: "2026-12-05", desc: "Internet bill", amount: 89.0 },
  { date: "2026-12-08", desc: "Electric bill (est.)", amount: 130.0 },
  { date: "2026-12-15", desc: "Car insurance", amount: 120.0 },
];

export function monthSpent(month, categoryId) {
  return month.transactions
    .filter((t) => t.category === categoryId)
    .reduce((s, t) => s + t.amount, 0);
}

export function monthTotalSpent(month) {
  return month.transactions
    .filter((t) => t.category !== "savings")
    .reduce((s, t) => s + t.amount, 0);
}

export function monthSaved(month) {
  return month.transactions
    .filter((t) => t.category === "savings")
    .reduce((s, t) => s + t.amount, 0);
}

export function monthIncome(month) {
  return month.income.reduce((s, i) => s + i.amount, 0);
}
