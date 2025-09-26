import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import PersonContext from "../../../../context/person/PersonContext";
import AuthContext from "../../../../context/auth/AuthContext";
import { toTitleCase } from "../../../../utils/titleCase";

const Tobbar = () => {
  const { person } = useContext(PersonContext);
  const { authTokens } = useContext(AuthContext);
  const token = localStorage.getItem("customerToken") || authTokens?.customer;
  const navigate = useNavigate();

  const displayName = person?.name
    ? toTitleCase(person.name.split(" ")[0])
    : person?.email
    ? person.email.split("@")[0]
    : "User";

  return (
    <div className="w-full bg-[#2E7D32] text-white text-sm px-4 py-2 flex justify-between items-center">
      {/* Show Become a Seller if NOT vendor */}
      {(!person || person?.role === "customer") && (
        <Link
          to="/register/vendor"
          onClick={(e) => {
            if (!token) {
              e.preventDefault();
              navigate("/login/vendor");
            }
          }}
          className="font-semibold hover:underline"
        >
          Become a Seller
        </Link>
      )}

      {/* Show Welcome if logged in */}
      {token && (
        <span className="font-medium">Welcome, {displayName}</span>
      )}
    </div>
  );
};

export default Tobbar;
