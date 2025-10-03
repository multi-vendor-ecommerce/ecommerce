import React from "react";

const Returns = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-green-800 mb-2">Return Policy</h1>
        <p className="text-green-700 max-w-xl mx-auto">
          Learn about our easy and hassle-free return process.
        </p>
      </div>

      {/* Return Steps / Info */}
      <div className="space-y-8 md:space-y-12">
        {/* Step 1 */}
        <div className="bg-green-50 p-6 rounded-lg shadow-md hover:shadow-lg hover:shadow-green-400/50 transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-green-800 mb-3">Step 1: Request a Return</h2>
          <p className="text-green-700">
            Contact our support team or fill out the return form to initiate a return request. 
            Provide your order number and reason for return.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-green-50 p-6 rounded-lg shadow-md hover:shadow-lg hover:shadow-green-400/50 transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-green-800 mb-3">Step 2: Prepare the Item</h2>
          <p className="text-green-700">
            Make sure the item is unused and in its original packaging. Include all tags and accessories.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-green-50 p-6 rounded-lg shadow-md hover:shadow-lg hover:shadow-green-400/50 transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-green-800 mb-3">Step 3: Ship the Item</h2>
          <p className="text-green-700">
            Send the item back to our return center using the shipping label provided. Keep the tracking number for reference.
          </p>
        </div>

        {/* Step 4 */}
        <div className="bg-green-50 p-6 rounded-lg shadow-md hover:shadow-lg hover:shadow-green-400/50 transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-green-800 mb-3">Step 4: Refund / Replacement</h2>
          <p className="text-green-700">
            Once we receive and inspect the item, we will process your refund or replacement within 3–5 business days.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Returns;
