import React from "react";
import { Link } from "react-router-dom";
import BackButton from "./layout/BackButton";

const NotFoundPage = ({ destination }) => {
  return (
    <section className="min-h-[95vh] bg-gray-100 p-6">
      <BackButton />

      <div className="md:min-h-[70vh] flex flex-col items-center justify-center text-center mt-10 md:mt-0">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Page not found</p>
        <Link
          to={destination || "/"}
          className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition"
        >
          Go to Homepage
        </Link>
      </div>
    </section>
  );
};

export default NotFoundPage;
