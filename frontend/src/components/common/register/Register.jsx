import { useContext, useState } from "react";
import { useNavigate, useSearchParams, NavLink } from "react-router-dom";
import AuthContext from "../../../context/auth/AuthContext";
import AuthSiderImg from "../../../assets/auth-side-bg.png";
import { FiCheckCircle } from 'react-icons/fi';

const Register = ({ registerRole }) => {
  const { register, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";
  const [step, setStep] = useState(1);

  const baseForm = { role: registerRole, name: "", email: "", password: "", confirmPassword: "", phone: "", address: "" };

  const vendorFields = { shopName: "", gstNumber: "" };

  const initialFormState = registerRole === "vendor"
    ? { ...baseForm, ...vendorFields }
    : baseForm;

  const [form, setForm] = useState(initialFormState);

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    setErrorMsg("");

    if (step === 1 && (!form.name.trim() || !form.email.trim())) {
      setErrorMsg("Name and Email are required.");
      return;
    }

    if (step === 2) {
      if (!form.password.trim() || !form.confirmPassword.trim()) {
        setErrorMsg("Please enter and confirm your password.");
        return;
      }
      if (form.password !== form.confirmPassword) {
        setErrorMsg("Passwords do not match.");
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Common validation for final step
    if (!form.phone.trim() || !form.address.trim()) {
      setErrorMsg("Phone and Address are required.");
      return;
    }

    // Additional validation for vendors
    if (form.role === "vendor") {
      if (!form.shopName.trim() || !form.gstNumber.trim()) {
        setErrorMsg("Shop Name and GST Number are required for vendors.");
        return;
      }
    }

    // Submit if all good
    const result = await register(form);

    if (result.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setErrorMsg(result.error || "Registration failed.");
    }
  };

  return (
    <section className="w-full bg-gray-200 min-h-screen lg:min-h-[80vh] flex items-center justify-between gap-10">
      {/* Left Side Form */}
      <div className="w-full h-full lg:w-[45%] px-4 flex flex-col lg:justify-center items-center gap-2 lg:gap-4">
        <div className="w-full max-w-lg p-6">
          <h2 className="text-3xl lg:text-5xl font-bold">Register</h2>
          <p className="text-medium lg:text-lg font-semibold mt-2">
            Join us and discover exclusive deals tailored just for you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-lg p-6 space-y-4">
          {errorMsg && (
            <p className="text-red-600 text-sm text-center">{errorMsg}</p>
          )}

          {/* Stepper Display */}
          <div className="flex justify-between items-center text-sm font-medium text-gray-700 mb-4">
            <div className={`flex items-center gap-2 ${step === 1 ? "text-blue-600 font-semibold" : ""}`}>
              <FiCheckCircle size={18} />
              Step 1
            </div>
            <div className={`flex items-center gap-2 ${step === 2 ? "text-blue-600 font-semibold" : ""}`}>
              <FiCheckCircle size={18} />
              Step 2
            </div>
            <div className={`flex items-center gap-2 ${step === 3 ? "text-blue-600 font-semibold" : ""}`}>
              <FiCheckCircle size={18} />
              Step 3
            </div>
          </div>

          {/* Common Field */}
          {step === 1 && (
            <>
              <div>
                <label className="block mb-2 font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-gray-300 rounded-xl px-3 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-gray-300 rounded-xl px-3 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block mb-2 font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full bg-gray-300 rounded-xl px-3 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-gray-300 rounded-xl px-3 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <label className="block mb-2 font-medium">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full bg-gray-300 rounded-xl px-3 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Address</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-gray-300 rounded-xl px-3 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {form.role === "vendor" && (
                <>
                  <div>
                    <label className="block mb-2 font-medium">Shop Name</label>
                    <input
                      type="text"
                      name="shopName"
                      value={form.shopName}
                      onChange={handleChange}
                      className="w-full bg-gray-300 rounded-xl px-3 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">GST Number</label>
                    <input
                      type="text"
                      name="gstNumber"
                      value={form.gstNumber}
                      onChange={handleChange}
                      className="w-full bg-gray-300 rounded-xl px-3 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4 pt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="w-full bg-gray-400 text-white py-3.5 rounded-xl hover:bg-gray-500 transition"
              >
                Back
              </button>
            )}
            {step < 3 && (
              <button
                type="button"
                onClick={nextStep}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 transition"
              >
                Next
              </button>
            )}
            {step === 3 &&
              form.address.trim() &&
              form.phone.trim() &&
              (registerRole !== "vendor" ||
                (form.shopName.trim() && form.gstNumber.trim())) && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 transition"
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              )}
          </div>

          <div className="text-center mt-4">
            <p className="text-gray-700">
              Already have an account?{" "}
              <NavLink
                to={registerRole === "vendor" ? "/login/vendor" : "/login/user"}
                className="text-blue-600 hover:underline"
              >
                Login
              </NavLink>
            </p>
          </div>
        </form>
      </div>

      {/* Right Side Image */}
      <div className="w-[55%] h-full hidden lg:flex justify-center items-center p-10">
        <img
          src={AuthSiderImg}
          alt="Register Illustration"
          className="w-[840px] h-[740px] rounded-3xl"
        />
      </div>
    </section>
  );
};

export default Register;
