import { useContext, useState } from "react";
import { useNavigate, useSearchParams, NavLink } from "react-router-dom";
import AuthContext from "../../../context/auth/AuthContext";
import AuthSiderImg from "../../../assets/auth-side-bg.png";
import InputField from "../InputField";

const Login = ({ loginRole }) => {
  const { login, loading, requestOtp, verifyOtp } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirectPath = searchParams.get("redirect") || "/";
  const [form, setForm] = useState({ email: "", password: "", otp: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleAndNavigate = (role) => {
    if (loginRole !== role) {
      setErrorMsg("Invalid role. Please login through the correct portal.");
      return false;
    }

    if (role === "admin") navigate("/admin");
    else if (role === "vendor") navigate("/vendor");
    else navigate(redirectPath, { replace: true });

    return true;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const result = await login(form.email, form.password);
    if (result.success) handleRoleAndNavigate(result.role);
    else setErrorMsg(result.error || "Login failed");
  };

  const handleRequestOtp = async () => {
    setErrorMsg("");
    if (!form.email) {
      setErrorMsg("Please enter your email to get OTP.");
      return;
    }

    const result = await requestOtp(form.email);
    if (result.success) {
      setOtpRequested(true);
      setErrorMsg("OTP sent! Check your email (expires in 5 minutes).");
    } else {
      setErrorMsg(result.error || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!form.otp) {
      setErrorMsg("Please enter the OTP");
      return;
    }

    const result = await verifyOtp(form.email, form.otp);
    if (result.success) handleRoleAndNavigate(result.role);
    else setErrorMsg(result.error || "OTP verification failed");
  };

  const formValid = isOtpLogin
    ? form.email.trim() && form.otp.trim()
    : form.email.trim() && form.password.trim();

  return (
    <section className="w-full bg-gray-200 min-h-screen lg:min-h-[80vh] flex items-center justify-between gap-10">
      <div className="w-full h-full lg:w-[45%] px-4 flex flex-col lg:justify-center items-center gap-2 lg:gap-4">
        <div className="w-full max-w-lg p-6">
          <h2 className="text-3xl lg:text-5xl font-bold">Welcome back!</h2>
          <p className="text-medium lg:text-lg font-semibold mt-2">Please enter your credentials to login.</p>
        </div>

        <div className="w-full max-w-lg">
          <form
            onSubmit={isOtpLogin ? handleVerifyOtp : handleLoginSubmit}
            className="w-full p-6 space-y-4"
          >
            {errorMsg && (
              <p className="text-red-600 text-sm text-center">{errorMsg}</p>
            )}

            <InputField
              name="email"
              label="Email"
              type="email"
              placeholder="abc@example.com"
              title="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={otpRequested}
            />

            {!isOtpLogin && (
              <InputField
                name="password"
                label="Password"
                type="password"
                placeholder="******"
                title="Enter a strong password"
                value={form.password}
                onChange={handleChange}
                required
              />
            )}

            {isOtpLogin && otpRequested && (
              <InputField
                name="otp"
                label="Enter OTP"
                type="text"
                placeholder="******"
                title="Enter the OTP"
                value={form.otp}
                onChange={handleChange}
                required
              />
            )}

            {!isOtpLogin && (
              <button
                type="submit"
                disabled={loading || !formValid}
                className={`w-full bg-blue-600 text-white py-3.5 text-[16px] md:text-lg rounded-xl mt-5 transition ${(!formValid || loading) ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700 cursor-pointer"}`}
              >
                {loading ? <div className="font-semibold">Logging in...</div> : <div className="font-semibold">Login</div>}
              </button>
            )}

            {isOtpLogin && !otpRequested && (
              <button
                type="button"
                disabled={loading || !form.email.trim()}
                onClick={handleRequestOtp}
                className={`w-full bg-green-600 text-white py-3.5 rounded-xl mt-5 transition ${(!form.email.trim() || loading) ? "opacity-60 cursor-not-allowed" : "hover:bg-green-700 cursor-pointer"}`}
              >
                {loading ? <div className="font-semibold">Sending OTP...</div> : <div className="font-semibold">Send OTP</div>}
              </button>
            )}

            {isOtpLogin && otpRequested && (
              <button
                type="submit"
                disabled={loading || !formValid}
                className={`w-full bg-blue-600 text-white py-3.5 rounded-xl mt-5 transition ${(!formValid || loading) ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700 cursor-pointer"}`}
              >
                {loading ? <div className="font-semibold">Verifying OTP...</div> : <div className="font-semibold">Verify OTP & Login</div>}
              </button>
            )}

            <div className="text-center mt-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="border-t border-gray-200 flex-1 mt-0.5"></div>
                <p className="text-gray-900 font-medium">OR</p>
                <div className="border-t border-gray-200 flex-1 mt-0.5"></div>
              </div>

              <div className="flex flex-col md:flex-row gap-3 justify-center items-center space-x-4 mt-5">
                <button
                  type="button"
                  onClick={() => {
                    setIsOtpLogin(!isOtpLogin);
                    setErrorMsg("");
                    setOtpRequested(false);
                    setForm({ email: "", password: "", otp: "" });
                  }}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  {isOtpLogin ? <div>Login with Password</div> : <div>Login by OTP</div>}
                </button>

                {loginRole !== "admin" && (
                  <div className="flex items-center">
                    <span className="text-gray-700">
                      Don't have an Account?{" "}
                      <NavLink
                        to={loginRole === "vendor" ? "/register/vendor" : "/register/user"}
                        className="text-blue-600 hover:underline"
                      >
                        Register
                      </NavLink>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="w-[55%] h-full hidden lg:flex justify-center items-center p-10">
        <img
          src={AuthSiderImg}
          alt="Login Illustration"
          className="w-[840px] h-[740px] rounded-3xl"
        />
      </div>
    </section>
  );
};

export default Login;