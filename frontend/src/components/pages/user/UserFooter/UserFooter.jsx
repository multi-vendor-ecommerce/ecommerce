import React from "react";

export default function UserFooter() {
  return (
    <footer className="bg-user-dark text-white mt-10">
      <div className="container mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
        {/* Column 1 */}
        <div>
          <h4 className="font-semibold mb-3 text-user-secondary">About</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Contact Us</a></li>
            <li><a href="#" className="hover:underline">About Us</a></li>
            <li><a href="#" className="hover:underline">Careers</a></li>
            <li><a href="#" className="hover:underline">Stories</a></li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h4 className="font-semibold mb-3 text-user-secondary">Help</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Payments</a></li>
            <li><a href="#" className="hover:underline">Shipping</a></li>
            <li><a href="#" className="hover:underline">Cancellation</a></li>
            <li><a href="#" className="hover:underline">Returns</a></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h4 className="font-semibold mb-3 text-user-secondary">Policy</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Return Policy</a></li>
            <li><a href="#" className="hover:underline">Terms of Use</a></li>
            <li><a href="#" className="hover:underline">Security</a></li>
            <li><a href="#" className="hover:underline">Privacy</a></li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h4 className="font-semibold mb-3 text-user-secondary">Connect</h4>
          <ul className="space-y-2">
            <li>Email: support@classyshop.com</li>
            <li>Phone: +91 9876543210</li>
            <li>Address: Delhi, India</li>
            <li><a href="#" className="hover:underline">Instagram</a></li>
          </ul>
        </div>
      </div>

      <div className="bg-black bg-opacity-20 text-center text-sm py-4">
        © {new Date().getFullYear()} CLASSYSHOP. All rights reserved.
      </div>
    </footer>
  );
}
