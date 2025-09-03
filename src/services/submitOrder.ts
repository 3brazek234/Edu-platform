export type OrderPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  studentAge: string;
  preferredTime?: string;
  goals: string;
  paymentMethod: "card" | "paypal";
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  billingAddress?: string;
  agreeTerms: boolean;
  agreeNewsletter?: boolean;
  packageId?: string;
  packageName?: string;
  subjectId?: string;
  subjectName?: string;
};

const ENDPOINT = "http://gos-test.local/wp-json/gos/order/submit";

export async function submitOrder(payload: OrderPayload) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Order submit failed: ${res.status} ${res.statusText} ${text}`);
  }

  const json = await res.json().catch(() => null);
  console.log("Order submitted", { data: json });
  return json;
}
