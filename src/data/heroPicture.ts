/* ── Words of the hero's picture ────────────────────────── */
// The labels set beside the picture, and every word drawn on its two screens
// and in its notifications. The canvas code that draws them runs in the
// browser, so this file imports no other data: whatever it imports would be
// sent to every visitor with it.

export const build = {
  diagramLabel:
    "A small clay house on a foundation with pipes running under it and a lit bulb set into the foundation: the windows are lit, the front wall is a shop's order screen, and a phone in front shows a checkout with a payment notification",
  // The label gains its endings as the product comes alive: first when the
  // screen lights, then when the first payment arrives.
  idea: { label: "Your idea", liveEnding: ", live", payingEnding: " and taking payments" },
  plumbing: {
    name: "The plumbing",
    explanation: "The part behind the screens",
    // One per pipe, in the order they are laid.
    runs: ["Accounts and sign-in", "Payments", "Testing"],
    // The word each pipe's pulse carries up into the screen, in the same
    // order. Made up to read as code at a glance; taken from no real product.
    tokens: ["signIn()", "pay()", "test()"],
  },
  housing: { name: "The housing", parts: ["Working screens"] },
  launch: "Launch",
} as const;

/* ── What is drawn on the screens ── */
// Made up, and plainly so: order numbers and "Customer", no names, no brand.
// The amounts are small and in several currencies, because a product on the
// web sells anywhere. Counts and statuses only: nothing here trends upward.

export interface Notification {
  title: string;
  /** Written the way its currency is normally written: symbol first, no decimals. */
  amount: string;
  detail: string;
}

/** In the order they arrive. The first one stays; the others pass through under it. */
export const notifications: readonly Notification[] = [
  { title: "Payment received", amount: "$120", detail: "Order #1042" },
  { title: "New order", amount: "£64", detail: "Order #1043" },
  { title: "Payment received", amount: "€85", detail: "Order #1044" },
];

// The shop's own screen is kept in one currency, as a real one would be.
// The mix of currencies is in the notifications only.
export const dashboard = {
  title: "Orders",
  search: "Search orders",
  open: "Open",
  figures: [
    { label: "Orders today", value: "18" },
    { label: "Paid", value: "15" },
    { label: "Pending", value: "3" },
  ],
  listTitle: "Today",
  orders: [
    { id: "#1042", items: "2 items", amount: "$120", status: "Paid" },
    { id: "#1040", items: "1 item", amount: "$45", status: "Paid" },
    { id: "#1039", items: "3 items", amount: "$80", status: "Pending" },
  ],
  /** The status that takes the accent. */
  settled: "Paid",
  chartTitle: "Orders per day",
  days: ["M", "T", "W", "T", "F", "S", "S"],
  /** Orders, not money, and deliberately uneven: an ordinary week. */
  counts: [12, 17, 9, 15, 11, 18, 14],
  /** Which day is today: its bar takes the accent. */
  today: 5,
} as const;

// The checkout the phone shows. Its total is the amount the first
// notification confirms.
export const checkout = {
  title: "Order #1042",
  customer: "Customer",
  line: { label: "2 items", value: notifications[0].amount },
  totalLabel: "Total",
  total: notifications[0].amount,
  pay: `Pay ${notifications[0].amount}`,
} as const;
