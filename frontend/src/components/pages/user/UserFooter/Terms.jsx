import React from "react";

const Terms = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-green-800 mb-2">Terms & Conditions</h1>
        <p className="text-green-700 max-w-xl mx-auto">
          Please read these terms and conditions carefully before using our services.
        </p>
      </div>

      {/* Terms Content */}
      <div className="space-y-8 md:space-y-12 text-green-700">
        <div>
          <h2 className="text-2xl font-semibold text-green-800 mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using our website and services, you agree to be bound by these terms and conditions.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-green-800 mb-2">2. User Responsibilities</h2>
          <p>
            Users must provide accurate information and not misuse the services for unlawful purposes.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-green-800 mb-2">3. Intellectual Property</h2>
          <p>
            All content, logos, and materials on this site are protected by intellectual property laws.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-green-800 mb-2">4. Limitation of Liability</h2>
          <p>
            We are not liable for any direct or indirect damages arising from the use of our services.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-green-800 mb-2">5. Changes to Terms</h2>
          <p>
            We may update these terms from time to time. Continued use of our services constitutes acceptance of the updated terms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
