import { useContext, useState } from "react";
import { useNavigate, useSearchParams, NavLink } from "react-router-dom";
import AuthContext from "../../../context/auth/AuthContext";
import AuthSiderImg from "../../../assets/auth-side-bg.png";
import Stepper from "../Stepper";
import StepperControls from "../StepperControls";
import InputField from "../InputField";

const Register = ({ registerRole }) => {
  const { register, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";
  const [step, setStep] = useState(1);

  const baseForm = { role: registerRole, name: "", email: "", password: "", confirmPassword: "", phone: "", address: "" };
  const vendorFields = { shopName: "", gstNumber: "" };
  const initialFormState = registerRole === "vendor" ? { ...baseForm, ...vendorFields } : baseForm;

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

    if (!form.phone.trim() || !form.address.trim()) {
      setErrorMsg("Phone and Address are required.");
      return;
    }

    if (form.role === "vendor") {
      if (!form.shopName.trim() || !form.gstNumber.trim()) {
        setErrorMsg("Shop Name and GST Number are required for vendors.");
        return;
      }
    }

    const result = await register(form);
    if (result.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setErrorMsg(result.error || "Registration failed.");
    }
  };

  return (
    <section className="w-full bg-gray-200 min-h-screen lg:min-h-[80vh] flex items-center justify-between gap-10">
      <div className="w-full h-full lg:w-[45%] px-4 flex flex-col lg:justify-center items-center gap-2 lg:gap-4">
        <div className="w-full max-w-lg p-6">
          <h2 className="text-3xl lg:text-5xl font-bold">Register</h2>
          <p className="text-medium lg:text-lg font-semibold mt-2">
            Join us and discover exclusive deals tailored just for you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-lg p-6 space-y-4">
          {errorMsg && <p className="text-red-600 text-sm text-center">{errorMsg}</p>}

          <Stepper
            className="flex justify-between items-center text-sm font-medium text-gray-700 gap-3 md:gap-1 mb-4"
            currentStep={step}
            stepLabels={["Name & Email", "Password", "Basic Info"]}
          />

          {step === 1 && (
            <>
              <InputField
                label="Name"
                name="name"
                placeholder="John Doe"
                title="Enter your name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                placeholder="abc@example.com"
                title="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </>
          )}

          {step === 2 && (
            <>
              <InputField
                label="Password"
                name="password"
                type="password"
                placeholder="******"
                title="Enter a strong password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <InputField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="******"
                title="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </>
          )}

          {step === 3 && (
            <>
              <InputField
                label="Phone"
                name="phone"
                type="tel"
                placeholder="e.g., 9876543210"
                title="Enter your phone number"
                value={form.phone}
                onChange={handleChange}
                required
              />
              <InputField
                label="Address"
                name="address"
                placeholder="e.g., 221B Baker Street, India"
                title="Enter your address"
                value={form.address}
                onChange={handleChange}
                textarea
                required
              />
              {form.role === "vendor" && (
                <>
                  <InputField
                    label="Shop Name"
                    name="shopName"
                    placeholder="e.g., TechMart"
                    title="Enter your shop name"
                    value={form.shopName}
                    onChange={handleChange}
                    required
                  />
                  <InputField
                    label="GST Number"
                    name="gstNumber"
                    placeholder="e.g., 22AAAAA0000A1Z5"
                    title="Enter your 15-digit GST number"
                    value={form.gstNumber}
                    onChange={handleChange}
                    required
                  />
                </>
              )}
            </>
          )}

          <StepperControls
            currentStep={step}
            totalSteps={3}
            onNext={nextStep}
            onBack={prevStep}
            isLastStep={step === 3}
            showSubmit={
              form.address.trim() &&
              form.phone.trim() &&
              (registerRole !== "vendor" ||
                (form.shopName.trim() && form.gstNumber.trim()))
            }
            loading={loading}
            submitButton={['Register', 'Registering']}
          />

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
