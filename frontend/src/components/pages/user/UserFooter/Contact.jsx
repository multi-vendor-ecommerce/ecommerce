import React, { useState } from "react";
import InputField from "../../../common/InputField";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-green-800 mb-2">Contact Us</h1>
        <p className="text-green-700 max-w-xl mx-auto">
          Have questions? Fill out the form below and we’ll get back to you soon.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Form */}
        <div className="md:w-2/3 bg-green-50 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Name"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <InputField
              label="Message"
              name="message"
              placeholder="Write your message..."
              value={formData.message}
              onChange={handleChange}
              required
              richtext={true} // use Quill for message
            />

            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="md:w-1/3 space-y-6">
          {[
            { title: "Email Us", value: "support@noahplanet.com" },
            { title: "Call Us", value: "+91 12345 67890" },
            { title: "Address", value: "123 NoahPlanet Street, New Delhi, India" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-green-50 p-6 rounded-lg shadow-md hover:shadow-lg hover:shadow-green-400/50 transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold text-green-800 mb-3">{item.title}</h2>
              <p className="text-green-700">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
