// FaqCategory.jsx
import React, { useState } from "react";

export default function FaqCategory({ category, search }) {
  const [activeFaq, setActiveFaq] = useState(null);

  const handleFaqClick = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Filter FAQs based on search
  const filteredFaqs = category.faqs.filter((faq) =>
    faq.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {filteredFaqs.length === 0 && (
        <p className="text-green-700">No FAQs found for your search.</p>
      )}
      {filteredFaqs.map((faq, idx) => (
        <div key={idx} className="border-b border-green-200">
          <button
            className="w-full flex justify-between items-center py-3 text-green-800 font-medium hover:text-green-900 transition"
            onClick={() => handleFaqClick(idx)}
          >
            {faq.question}
            <span className="text-lg">{activeFaq === idx ? "−" : "+"}</span>
          </button>
          {activeFaq === idx && (
            <div className="text-green-700 py-2">{faq.answer}</div>
          )}
        </div>
      ))}
    </div>
  );
}
