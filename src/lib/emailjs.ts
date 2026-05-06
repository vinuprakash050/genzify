import emailjs from "@emailjs/browser";

const SERVICE_ID   = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const PUBLIC_KEY   = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;
const TEMPLATE_ID  = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ORDER_CONFIRM!; // single reusable template

let initialized = false;
function init() {
  if (!initialized && typeof window !== "undefined") {
    emailjs.init({ publicKey: PUBLIC_KEY });
    initialized = true;
  }
}

async function send(params: Record<string, string>) {
  init();
  console.log("[EmailJS] Attempting to send email:", {
    serviceId: SERVICE_ID,
    templateId: TEMPLATE_ID,
    to: params.to_email,
    subject: params.email_subject,
  });
  try {
    const result = await emailjs.send(SERVICE_ID, TEMPLATE_ID, params);
    console.log("[EmailJS] ✅ Email sent successfully:", result);
  } catch (err: any) {
    console.error("[EmailJS] ❌ Failed to send email:", err?.text || err?.message || err);
  }
}

// ── Order Confirmation ────────────────────────────────────────────────────────
export async function sendOrderConfirmationEmail(p: {
  to_name: string; to_email: string;
  order_id: string; order_date: string;
  items_summary: string; order_total: string;
  shipping_address: string; delivery_method: string;
  payment_id: string;
}) {
  await send({
    to_name: p.to_name,
    to_email: p.to_email,
    email_subject: "Order Confirmed — " + p.order_id + " | Genzify",
    email_title: "Order Confirmed 🎉",
    email_body: `Hi ${p.to_name}, your order has been placed successfully!\n\nOrder ID: ${p.order_id}\nDate: ${p.order_date}\nItems: ${p.items_summary}\nTotal: ${p.order_total}\nShipping to: ${p.shipping_address}\nDelivery: ${p.delivery_method}\nPayment ID: ${p.payment_id}\n\nWe'll notify you when your order ships.`,
    cta_label: "View Orders",
    cta_url: "https://genzifyy.netlify.app/account/orders",
  });
}

// ── Order Shipped ─────────────────────────────────────────────────────────────
export async function sendOrderShippedEmail(p: {
  to_name: string; to_email: string;
  order_id: string; tracking_number: string;
  shipping_address: string; delivery_method: string;
}) {
  await send({
    to_name: p.to_name,
    to_email: p.to_email,
    email_subject: "Your Order Has Shipped — " + p.order_id + " | Genzify",
    email_title: "Your Order is On the Way 🚚",
    email_body: `Hi ${p.to_name}, great news — your order ${p.order_id} has been shipped!\n\nTracking Number: ${p.tracking_number}\nShipping to: ${p.shipping_address}\nDelivery Method: ${p.delivery_method}\n\nYou can track your order using the tracking number above.`,
    cta_label: "Track Order",
    cta_url: "https://genzifyy.netlify.app/account/orders",
  });
}

// ── Order Delivered ───────────────────────────────────────────────────────────
export async function sendOrderDeliveredEmail(p: {
  to_name: string; to_email: string;
  order_id: string; order_total: string;
}) {
  await send({
    to_name: p.to_name,
    to_email: p.to_email,
    email_subject: "Order Delivered — " + p.order_id + " | Genzify",
    email_title: "Your Order Has Been Delivered ✅",
    email_body: `Hi ${p.to_name}, your order ${p.order_id} has been delivered!\n\nOrder Total: ${p.order_total}\n\nWe hope you love your new pieces. If you have any issues, please contact us.`,
    cta_label: "Shop Again",
    cta_url: "https://genzifyy.netlify.app/products",
  });
}

// ── Order Cancelled ───────────────────────────────────────────────────────────
export async function sendOrderCancelledEmail(p: {
  to_name: string; to_email: string;
  order_id: string; order_total: string;
  cancel_reason?: string;
}) {
  await send({
    to_name: p.to_name,
    to_email: p.to_email,
    email_subject: "Order Cancelled — " + p.order_id + " | Genzify",
    email_title: "Your Order Has Been Cancelled",
    email_body: `Hi ${p.to_name}, your order ${p.order_id} has been cancelled.\n\nOrder Total: ${p.order_total}\nReason: ${p.cancel_reason || "Cancelled by request"}\n\nIf you have any questions, please contact our support team.`,
    cta_label: "Contact Support",
    cta_url: "https://genzifyy.netlify.app/contact",
  });
}

// ── Order Refunded ────────────────────────────────────────────────────────────
export async function sendOrderRefundedEmail(p: {
  to_name: string; to_email: string;
  order_id: string; order_total: string;
  payment_id: string;
}) {
  await send({
    to_name: p.to_name,
    to_email: p.to_email,
    email_subject: "Refund Processed — " + p.order_id + " | Genzify",
    email_title: "Your Refund Has Been Processed 💸",
    email_body: `Hi ${p.to_name}, your refund for order ${p.order_id} has been processed.\n\nRefund Amount: ${p.order_total}\nOriginal Payment ID: ${p.payment_id}\n\nThe amount will reflect in your account within 5-7 business days depending on your bank.`,
    cta_label: "View Orders",
    cta_url: "https://genzifyy.netlify.app/account/orders",
  });
}
