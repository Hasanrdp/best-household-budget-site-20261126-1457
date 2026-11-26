// Seed data for the Marlowe household budget, November 2026.
// Every figure on the site is derived from these rows: category spending is
// summed from the transactions, so the dashboard, budgets and reports can
// never disagree with each other.

export const HOUSEHOLD = {
  name: 'The Marlowe Household',
  members: 'Maya & Daniel Marlowe, with June (9) and Theo (6)',
  month: 'November 2026',
  monthLabel: 'November 2026',
  currency: 'USD',
};

export const INCOME = [
  { source: 'Maya — product designer salary', amount: 4600 },
  { source: 'Daniel — high-school teacher salary', amount: 3150 },
  { source: 'Weekend market stall', amount: 380 },
];

export const CATEGORIES = [
  { id: 'housing', name: 'Housing', budget: 2350, color: '#1e5631', note: 'Mortgage, insurance, upkeep' },
  { id: 'groceries', name: 'Groceries', budget: 780, color: '#2f7d4f', note: 'Weekly shop and market' },
  { id: 'dining', name: 'Dining out', budget: 320, color: '#b45309', note: 'Restaurants and takeaway' },
  { id: 'transport', name: 'Transport', budget: 460, color: '#2563eb', note: 'Fuel, bus passes, parking' },
  { id: 'utilities', name: 'Utilities', budget: 430, color: '#7c3aed', note: 'Power, water, internet, phones' },
  { id: 'kids', name: 'Kids & school', budget: 540, color: '#db2777', note: 'Lunches, lessons, clubs' },
  { id: 'health', name: 'Health', budget: 260, color: '#0891b2', note: 'Pharmacy, dentist, gym' },
  { id: 'entertainment', name: 'Entertainment', budget: 180, color: '#ca8a04', note: 'Cinema, streaming, games' },
  { id: 'clothing', name: 'Clothing', budget: 150, color: '#4d7c0f', note: 'Shoes and seasonal clothes' },
  { id: 'home', name: 'Home & garden', budget: 120, color: '#92400e', note: 'Repairs and plants' },
  { id: 'misc', name: 'Everything else', budget: 220, color: '#64748b', note: 'Gifts, haircuts, odds and ends' },
];

export const SAVINGS_PLAN = 1400;

export const TRANSACTIONS = [
  { id: 't01', date: '2026-11-01', description: 'Mortgage — Marlowe home loan', category: 'housing', amount: 2150.0 },
  { id: 't02', date: '2026-11-02', description: 'Greenvale Supermarket — weekly shop', category: 'groceries', amount: 142.6 },
  { id: 't03', date: '2026-11-03', description: 'Home insurance — annual premium share', category: 'housing', amount: 96.0 },
  { id: 't04', date: '2026-11-03', description: 'Piano lessons — June, November', category: 'kids', amount: 160.0 },
  { id: 't05', date: '2026-11-04', description: 'Fuel — Shell, Daniel’s commute', category: 'transport', amount: 52.0 },
  { id: 't06', date: '2026-11-05', description: 'Gym — family membership', category: 'health', amount: 58.0 },
  { id: 't07', date: '2026-11-06', description: 'Pharmacy — Theo’s inhaler refill', category: 'health', amount: 38.9 },
  { id: 't08', date: '2026-11-07', description: 'Farmers’ market — vegetables and eggs', category: 'groceries', amount: 98.4 },
  { id: 't09', date: '2026-11-08', description: 'Pizza night — Lucca’s, family dinner', category: 'dining', amount: 48.5 },
  { id: 't10', date: '2026-11-09', description: 'Streaming — movies and music', category: 'entertainment', amount: 32.0 },
  { id: 't11', date: '2026-11-10', description: 'Greenvale Supermarket — weekly shop', category: 'groceries', amount: 176.25 },
  { id: 't12', date: '2026-11-11', description: 'Bus passes — Maya and Daniel', category: 'transport', amount: 96.0 },
  { id: 't13', date: '2026-11-12', description: 'Electricity — October usage', category: 'utilities', amount: 148.2 },
  { id: 't14', date: '2026-11-12', description: 'School lunches — June and Theo', category: 'kids', amount: 120.0 },
  { id: 't15', date: '2026-11-13', description: 'Dentist — Daniel’s check-up', category: 'health', amount: 120.0 },
  { id: 't16', date: '2026-11-14', description: 'Cinema — family Saturday film', category: 'entertainment', amount: 34.0 },
  { id: 't17', date: '2026-11-15', description: 'Internet — fibre, November', category: 'utilities', amount: 79.0 },
  { id: 't18', date: '2026-11-16', description: 'Greenvale Supermarket — weekly shop', category: 'groceries', amount: 87.9 },
  { id: 't19', date: '2026-11-17', description: 'Fuel — Shell, Maya’s commute', category: 'transport', amount: 48.75 },
  { id: 't20', date: '2026-11-18', description: 'Water — quarterly bill', category: 'utilities', amount: 64.35 },
  { id: 't21', date: '2026-11-19', description: 'Soccer club fees — Theo, winter term', category: 'kids', amount: 85.0 },
  { id: 't22', date: '2026-11-20', description: 'Kids’ shoes — June, size 3', category: 'clothing', amount: 64.95 },
  { id: 't23', date: '2026-11-21', description: 'Greenvale Supermarket — weekly shop', category: 'groceries', amount: 121.35 },
  { id: 't24', date: '2026-11-21', description: 'Takeaway — Thai, Friday night', category: 'dining', amount: 62.4 },
  { id: 't25', date: '2026-11-22', description: 'Board game — family game night', category: 'entertainment', amount: 28.99 },
  { id: 't26', date: '2026-11-22', description: 'Birthday gift — Grandma Rose', category: 'misc', amount: 45.0 },
  { id: 't27', date: '2026-11-23', description: 'Phone — two lines, November', category: 'utilities', amount: 112.0 },
  { id: 't28', date: '2026-11-23', description: 'School books — June’s reading list', category: 'kids', amount: 42.5 },
  { id: 't29', date: '2026-11-24', description: 'Winter jacket — Daniel', category: 'clothing', amount: 89.0 },
  { id: 't30', date: '2026-11-24', description: 'Light bulbs and plants — hallway', category: 'home', amount: 43.35 },
  { id: 't31', date: '2026-11-25', description: 'Haircuts — Maya and Theo', category: 'misc', amount: 38.0 },
  { id: 't32', date: '2026-11-25', description: 'Café lunch — Maya and a colleague', category: 'dining', amount: 36.75 },
  { id: 't33', date: '2026-11-26', description: 'Greenvale Supermarket — top-up shop', category: 'groceries', amount: 64.2 },
  { id: 't34', date: '2026-11-26', description: 'Parking — hospital visit', category: 'transport', amount: 18.5 },
  { id: 't35', date: '2026-11-26', description: 'Sushi takeaway — Wednesday treat', category: 'dining', amount: 28.9 },
];

export const GOALS = [
  { id: 'g1', name: 'Emergency fund', target: 12000, saved: 8450, note: 'Six months of essentials, for the unexpected.' },
  { id: 'g2', name: 'Family holiday — Bali', target: 3200, saved: 1150, note: 'Flights and a week by the sea, next July.' },
  { id: 'g3', name: 'New car fund', target: 9500, saved: 4300, note: 'Replace the 2011 hatchback before next winter.' },
  { id: 'g4', name: 'Kitchen refresh', target: 2400, saved: 960, note: 'Paint, new taps and a sturdier table.' },
];

export const BILLS = [
  { id: 'b01', name: 'Mortgage — Marlowe home loan', amount: 2150.0, due: '2026-11-01', paid: true },
  { id: 'b02', name: 'Home insurance', amount: 96.0, due: '2026-11-03', paid: true },
  { id: 'b03', name: 'Gym — family membership', amount: 58.0, due: '2026-11-05', paid: true },
  { id: 'b04', name: 'Streaming — movies and music', amount: 32.0, due: '2026-11-09', paid: true },
  { id: 'b05', name: 'Electricity', amount: 148.2, due: '2026-11-12', paid: true },
  { id: 'b06', name: 'Internet — fibre', amount: 79.0, due: '2026-11-15', paid: true },
  { id: 'b07', name: 'Water', amount: 64.35, due: '2026-11-18', paid: true },
  { id: 'b08', name: 'Phone — two lines', amount: 112.0, due: '2026-11-23', paid: true },
  { id: 'b09', name: 'Credit card — October balance', amount: 310.0, due: '2026-11-27', paid: false },
  { id: 'b10', name: 'Car insurance', amount: 214.0, due: '2026-11-28', paid: false },
];

export const MONTHLY_SPENDING = [
  { month: 'Jun', spent: 4980 },
  { month: 'Jul', spent: 5240 },
  { month: 'Aug', spent: 4610 },
  { month: 'Sep', spent: 5120 },
  { month: 'Oct', spent: 4890 },
  { month: 'Nov', spent: 4732 },
];

export const MONTHLY_INCOME = 8130;
