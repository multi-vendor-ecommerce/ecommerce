import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import AuthContext from "../../context/auth/AuthContext";

const Login = () => {
  const { login, loading, requestOtp, verifyOtp } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "", otp: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle regular login (email + password)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const result = await login(form.email, form.password);

    if (result.success) {
      const role = result.role;
      if (role === "admin") navigate("/admin");
      else if (role === "vendor") navigate("/vendor");
      else navigate("/");
    } else {
      setErrorMsg(result.error || "Login failed");
    }
  };

  // Handle OTP request (send OTP)
  const handleRequestOtp = async () => {
    setErrorMsg("");
    if (!form.email) {
      setErrorMsg("Please enter your email to get OTP.");
      return;
    }
    const result = await requestOtp(form.email);
    if (result.success) {
      setOtpRequested(true);
      setErrorMsg("OTP sent! Please check your email.");
    } else {
      setErrorMsg(result.error || "Failed to send OTP");
    }
  };

  // Handle OTP verification login
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!form.otp) {
      setErrorMsg("Please enter the OTP");
      return;
    }

    const result = await verifyOtp(form.email, form.otp);

    if (result.success) {
      const role = result.role;
      if (role === "admin") navigate("/admin");
      else if (role === "vendor") navigate("/vendor");
      else navigate("/");
    } else {
      setErrorMsg(result.error || "OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <form
        onSubmit={isOtpLogin ? handleVerifyOtp : handleLoginSubmit}
        className="w-full max-w-sm bg-white rounded-xl shadow p-6 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Login</h2>

        {errorMsg && (
          <p className="text-red-600 text-sm text-center">{errorMsg}</p>
        )}

        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
            disabled={otpRequested} // disable email change after requesting OTP
          />
        </div>

        {!isOtpLogin && (
          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        )}

        {isOtpLogin && otpRequested && (
          <div>
            <label htmlFor="otp" className="block mb-1 font-medium">
              Enter OTP
            </label>
            <input
              type="text"
              name="otp"
              value={form.otp}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        )}

        {!isOtpLogin && (
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        )}

        {isOtpLogin && !otpRequested && (
          <button
            type="button"
            disabled={loading}
            onClick={handleRequestOtp}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        )}

        {isOtpLogin && otpRequested && (
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Verifying OTP..." : "Verify OTP & Login"}
          </button>
        )}

        <div className="text-center text-sm text-gray-600 mt-4">
          <p>OR</p>
          <div className="flex justify-center space-x-4 mt-2">
            <button
              type="button"
              onClick={() => {
                setIsOtpLogin(!isOtpLogin);
                setErrorMsg("");
                setOtpRequested(false);
                setForm({ email: "", password: "", otp: "" });
              }}
              className="text-blue-600 hover:underline"
            >
              {isOtpLogin ? "Login with Password" : "Login by OTP"}
            </button>

            <NavLink to="/register" className="text-blue-600 hover:underline">
              Don't have an Account?
            </NavLink>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
