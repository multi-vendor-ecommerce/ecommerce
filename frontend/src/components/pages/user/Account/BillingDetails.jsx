// BillingDetails.jsx
import React, { useState } from "react";

export default function BillingDetails() {
  const [billing, setBilling] = useState({
    cardNumber: "",
    expiry: "",
    name: "",
  });

  const handleChange = (e) => {
    setBilling({ ...billing, [e.target.name]: e.target.value });
  };

  return (
    <form className="space-y-4">
      <h2 className="text-xl font-semibold">Billing Information</h2>
      <input name="name" value={billing.name} onChange={handleChange} className="input" placeholder="Cardholder Name" />
      <input name="cardNumber" value={billing.cardNumber} onChange={handleChange} className="input" placeholder="Card Number" />
      <input name="expiry" value={billing.expiry} onChange={handleChange} className="input" placeholder="Expiry Date (MM/YY)" />
      <button type="button" className="btn-primary">Save Billing Info</button>
    </form>
  );
}
