import emailjs from "@emailjs/browser";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;
const ORDER_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_ORDER_TEMPLATE_ID!;

// Initialize EmailJS once
let initialized = false;
function init() {
  if (!initialized && typeof window !== "undefined") {
    emailjs.init({ publicKey: PUBLIC_KEY });
    initialized = true;
  }
}

export interface OrderEmailParams {
  to_name: string;
  to_email: string;
  order_id: string;
  order_date: string;
  items_summary: string;   // e.g. "Static Drift Tee x1 (M), Cloudframe Hoodie x2 (L)"
  order_total: string;     // e.g. "₹2,499"
  shipping_address: string;
  delivery_method: string;
  payment_id: string;
}

export async function sendOrderConfirmationEmail(params: OrderEmailParams): Promise<void> {
  init();
  try {
    await emailjs.send(SERVICE_ID, ORDER_TEMPLATE_ID, {
      to_name: params.to_name,
      to_email: params.to_email,
      order_id: params.order_id,
      order_date: params.order_date,
      items_summary: params.items_summary,
      order_total: params.order_total,
      shipping_address: params.shipping_address,
      delivery_method: params.delivery_method,
      payment_id: params.payment_id,
    });
    console.log("Order confirmation email sent.");
  } catch (err) {
    // Non-critical — don't block order flow if email fails
    console.error("EmailJS error:", err);
  }
}
