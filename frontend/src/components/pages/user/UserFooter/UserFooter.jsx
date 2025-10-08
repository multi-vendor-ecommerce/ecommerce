import { footerLinks } from "./footerData";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom"; // <-- Import Link

const socialIcons = {
  facebook: <FaFacebookF />,
  twitter: <FaTwitter />,
  instagram: <FaInstagram />,
  youtube: <FaYoutube />,
};

export default function UserFooter() {
  return (
    <footer className="bg-green-50 text-gray-800 mt-auto">
      <div className="container mx-auto py-12 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* About */}
        <div>
          <img
            src={footerLinks.about.logo}
            alt="NoahPlanet Logo"
            className="w-24 sm:w-28 md:w-40 object-contain mb-3"
          />
          <p className="text-sm">{footerLinks.about.description}</p>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Customer Support</h3>
          <ul className="text-sm space-y-2">
            {footerLinks.customerSupport.map((item, i) => (
              <li key={i}>
                {/* Internal link converted to Link */}
                <Link
                  to={item.url}
                  className="hover:text-green-900 transition-colors duration-200"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Vendors */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Vendors</h3>
          <ul className="text-sm space-y-2">
            {footerLinks.vendors.map((item, i) => (
              <li key={i}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-900 transition-colors duration-200"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-3 text-xl">
            {footerLinks.social.map((item, i) => (
              <a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-900 transition-colors"
              >
                {socialIcons[item.name]}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-green-50 text-gray-600 py-4 text-center text-sm">
        <p className="flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-3">
          <span>{footerLinks.copyright}</span>
          {footerLinks.legal.map((item, i) => (
            <span key={i}>
              <Link
                to={item.url}
                className="underline hover:text-gray-900 transition-colors duration-200"
              >
                {item.label}
              </Link>
              {i < footerLinks.legal.length - 1 ? " | " : ""}
            </span>
          ))}
        </p>
      </div>
    </footer>
  );
}
