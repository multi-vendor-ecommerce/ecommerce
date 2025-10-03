import React from "react";

const Privacy = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-green-800 mb-2">Privacy Policy</h1>
        <p className="text-green-700 max-w-xl mx-auto">
          Your privacy is important to us. Please read how we collect, use, and protect your information.
        </p>
      </div>

      {/* Privacy Policy Content */}
      <div className="space-y-8 md:space-y-12 text-green-700">
        <div>
          <h2 className="text-2xl font-semibold text-green-800 mb-2">1. Information We Collect</h2>
          <p>
            We may collect personal information such as name, email address, and other data when you interact with our services.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-green-800 mb-2">2. How We Use Information</h2>
          <p>
            Your information is used to provide, maintain, and improve our services, respond to inquiries, and send updates.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-green-800 mb-2">3. Data Security</h2>
          <p>
            We implement reasonable security measures to protect your data from unauthorized access or disclosure.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-green-800 mb-2">4. Sharing of Information</h2>
          <p>
            We do not sell your personal information. We may share data with trusted partners to provide our services.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-green-800 mb-2">5. Changes to Privacy Policy</h2>
          <p>
            We may update this policy occasionally. Continued use of our services constitutes acceptance of the updated policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
