import React, { useState } from "react";
import { faqCategories } from "./Help/helpData";
import FaqCategory from "./Help/FaqCategory";

const FAQ = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [search, setSearch] = useState("");

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-green-800 mb-2">Frequently Asked Questions</h1>
        <p className="text-green-700 max-w-xl mx-auto">
          Find answers to common questions about our products and services.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6 max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Search for questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="md:w-1/4">
          <div className="sticky top-20">
            <h2 className="text-2xl font-bold text-green-800 mb-6">Categories</h2>
            <ul className="space-y-3">
              {faqCategories.map((cat, idx) => (
                <li key={idx}>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-md font-medium ${
                      selectedCategory === idx
                        ? "bg-green-600 text-white"
                        : "text-green-800 hover:bg-green-100"
                    } transition`}
                    onClick={() => setSelectedCategory(idx)}
                  >
                    {cat.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="md:w-3/4 md:pl-10">
          <FaqCategory category={faqCategories[selectedCategory]} search={search} />
        </main>
      </div>
    </div>
  );
};

export default FAQ;
