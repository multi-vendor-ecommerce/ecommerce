import React, { useState } from "react";

const emailTemplatesDummy = {
  orderConfirmation: {
    to: "Customer",
    subject: "Your order has been confirmed!",
    body: "Hi {{userName}},\n\nThank you for your order {{orderId}}. We are processing it now.",
    enabled: true,
  },
  passwordReset: {
    to: "Customer",
    subject: "Reset your password",
    body: "Hi {{userName}},\n\nClick the link below to reset your password.",
    enabled: true,
  },
};

export default function EmailTemplateEditor() {
  const [selectedType, setSelectedType] = useState("orderConfirmation");
  const [form, setForm] = useState(emailTemplatesDummy[selectedType]);

  const handleSelectChange = (e) => {
    const type = e.target.value;
    setSelectedType(type);
    setForm(emailTemplatesDummy[type]);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSave = () => {
    console.log("Saved Template:", { type: selectedType, ...form });
    alert("Template saved successfully!");
  };

  return (
    <section className="bg-gray-100 min-h-screen w-full p-6 shadow-md">
      <h2 className="text-2xl font-bold mb-6">Email Template Editor</h2>

      <div className="bg-white shadow-md shadow-blue-500 rounded-xl p-6">
        <label className="block font-medium text-gray-700 mb-2">
          Select Email Type:
        </label>
        <select
          value={selectedType}
          onChange={handleSelectChange}
          className="border border-gray-300 rounded px-3 py-2 mb-6 w-full"
        >
          {Object.keys(emailTemplatesDummy).map((key) => (
            <option key={key} value={key}>
              {key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
            </option>
          ))}
        </select>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">To</label>
            <select
              name="to"
              value={form.to}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value="Customer">Customer</option>
              <option value="Vendor">Vendor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Subject</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 mt-4">
          <label className="text-sm font-medium text-gray-600">Body</label>
          <textarea
            name="body"
            rows="6"
            value={form.body}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
          <small className="text-gray-500 mt-1">
            You can use placeholders like <code>{'{userName}'}</code>, <code>{'{orderId}'}</code>
          </small>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            name="enabled"
            checked={form.enabled}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <label className="text-sm font-medium text-gray-700">
            Enable Auto-send
          </label>
        </div>

        <button
          onClick={handleSave}
          className="mt-6 border-2 border-blue-500 hover:bg-blue-600 text-black font-semibold hover:text-white shadow-md hover:shadow-gray-400 px-6 py-2 rounded-lg transition cursor-pointer"
        >
          Save Template
        </button>
      </div>
    </section>
  );
}
