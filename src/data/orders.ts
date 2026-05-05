export const orders = [
  {
    id: "GZ-240518",
    status: "In Transit",
    date: "May 5, 2026",
    total: 172,
    trackingNumber: "GZX992401",
    items: [
      { productId: "hd-002", name: "Night Circuit Hoodie", price: 88, quantity: 1, size: "L" },
      { productId: "ts-003", name: "Afterglow Print Tee", price: 46, quantity: 1, size: "M" },
      { productId: "vs-005", name: "Driftline Vest", price: 38, quantity: 1, size: "M" },
    ],
    shippingAddress: "44 Mercer Street, Brooklyn, NY 11249",
  },
  {
    id: "GZ-240411",
    status: "Delivered",
    date: "April 11, 2026",
    total: 134,
    trackingNumber: "GZX992155",
    items: [
      { productId: "hd-001", name: "Cloudframe Hoodie", price: 84, quantity: 1, size: "XL" },
      { productId: "ts-001", name: "Static Drift Tee", price: 50, quantity: 1, size: "L" },
    ],
    shippingAddress: "44 Mercer Street, Brooklyn, NY 11249",
  },
];
