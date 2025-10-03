import React, { useState } from "react";
import { faqCategories } from "./helpData";
import FaqCategory from "./FaqCategory";
import { Link } from "react-router-dom";

export default function Help() {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [search, setSearch] = useState("");

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-800 mb-2">Help Center</h1>
        <p className="text-green-700 max-w-xl mx-auto">
          Find answers to your questions or contact our support team for assistance.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6 max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Search for help (e.g., orders, returns, account)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {/* Categories Tabs for mobile */}
      <div className="flex overflow-x-auto space-x-3 mb-6 px-2 md:hidden">
        {faqCategories.map((cat, idx) => (
          <button
            key={idx}
            className={`flex-shrink-0 px-4 py-2 rounded-md font-medium ${selectedCategory === idx
              ? "bg-green-600 text-white"
              : "bg-green-100 text-green-800 hover:bg-green-200"
              }`}
            onClick={() => setSelectedCategory(idx)}
          >
            {cat.title}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row  sm:p-10">
        {/* Sidebar for desktop */}
        <aside className="hidden md:block md:w-1/4 ">
          <div className="sticky top-20">
            <h2 className="text-2xl font-bold text-green-800 p-4">Help Topics</h2>
            <ul className="space-y-3">
              {faqCategories.map((cat, idx) => (
                <li key={idx}>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-md font-medium ${selectedCategory === idx
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

        {/* Main content */}
        <main className="md:w-3/4 md:pl-10">
          <FaqCategory category={faqCategories[selectedCategory]} search={search} />

          <div className="mt-12  rounded-md">
            <h3 className="text-xl font-semibold mb-2 text-green-800">Still need help?</h3>
            <p className="text-green-700 mb-4">
              Contact our support team anytime and we will assist you.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
            >
              Contact Support
            </Link>
          </div>
        </main>
      </div>

    </div>
  );
}
