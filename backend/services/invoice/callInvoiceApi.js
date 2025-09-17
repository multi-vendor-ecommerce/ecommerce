import fetch from "node-fetch";

export async function callInvoiceApi(payload) {
  const response = await fetch("https://invoice-generator.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.INVOICE_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Invoice API failed: ${response.status} ${response.statusText} | ${text}`);
  }

  return await response.arrayBuffer();
}