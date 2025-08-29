import { useContext, useState } from "react";
import { useNavigate, useSearchParams, NavLink } from "react-router-dom";
import AuthContext from "../../../context/auth/AuthContext";
import AuthSiderImg from "../../../assets/auth-side-bg.png";
import Stepper from "../Stepper";
import StepperControls from "../StepperControls";
import InputField from "../InputField";
import { registerFields } from "./data/registerFields";

const Register = ({ registerRole }) => {
  const { register, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || (registerRole === "vendor" ? "/vendor" : "/");

  const [step, setStep] = useState(1);

  const baseForm = {
    role: registerRole, name: "", email: "", password: "", confirmPassword: "", phone: "",
    address: {
      name: "", phone: "", line1: "", line2: "", locality: "", city: "", state: "", country: "India", pincode: "",
      geoLocation: { lat: "", lng: "" }
    },
  };
  const vendorFields = { shopName: "", gstNumber: "" };
  const initialFormState =
    registerRole === "vendor" ? { ...baseForm, ...vendorFields } : baseForm;

  const [form, setForm] = useState(initialFormState);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.geoLocation.")) {
      const key = name.split(".")[2];
      setForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          geoLocation: {
            ...prev.address.geoLocation,
            [key]: value,
          },
        },
      }));
    } else if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [key]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const nextStep = () => {
    setErrorMsg("");
    if (step === 1) {
      if (!form.name.trim() || !form.email.trim()) {
        setErrorMsg("Name and Email are required.");
        return;
      }
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email.trim())) {
        setErrorMsg("Please enter a valid email address.");
        return;
      }
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
    // ✅ Step 3: Address validation
    if (step === 3) {
      const { line1, city, state, country, pincode } = form.address;

      if (!line1.trim() || !city.trim() || !state.trim() || !country.trim() || !pincode.trim()) {
        setErrorMsg("Please fill in all required address fields.");
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const { line1, city, state, country, pincode } = form.address;

    if (!form.phone.trim() || !line1.trim() || !city.trim() || !state.trim() || !country.trim() || !pincode.trim()) {
      setErrorMsg("Please fill in all required address fields.");
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

  const isNextDisabled = () => {
    if (step === 1) {
      return !form.name.trim() || !form.email.trim();
    }
    if (step === 2) {
      return (
        !form.password.trim() ||
        !form.confirmPassword.trim() ||
        form.password !== form.confirmPassword
      );
    }
    if (step === 3) {
      return (
        !form.address.line1.trim() ||
        !form.address.city.trim() ||
        !form.address.state.trim() ||
        !form.address.country.trim() ||
        !form.address.pincode.trim()
      );
    }
    if (step === 4) {
      if (!form.phone.trim()) return true;
      if (
        registerRole === "vendor" &&
        (!form.shopName.trim() || !form.gstNumber.trim())
      ) {
        return true;
      }
      return false;
    }
    return false;
  };

  return (
    <section className="w-full bg-white min-h-screen lg:min-h-[80vh] flex items-center justify-between gap-10">
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
            stepLabels={["Name & Email", "Password", "Address", "Basic Info"]}
          />

          <div className={step === 3 ? "grid grid-cols-2 gap-4" : "space-y-4"}>
            {registerFields[step]
              .filter((field) => !field.role || field.role === registerRole)
              .map((field, idx) => (
                <div key={idx} className={field.colSpan === 1 ? "" : "col-span-2"}>
                  <InputField
                    label={`${field.label}${field.required ? " *" : ""}`}
                    name={field.name}
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    title={field.title}
                    required={field.required}
                    value={
                      field.name.startsWith("address.")
                        ? field.name.split(".")[2] === "lat" || field.name.split(".")[2] === "lng"
                          ? form.address.geoLocation[field.name.split(".")[2]]
                          : form.address[field.name.split(".")[1]]
                        : form[field.name]
                    }
                    onChange={handleChange}
                  />
                  {step === 2 && field.name === "password" && (
                    <p className="text-xs mt-1 text-gray-700">
                      Must include letters, numbers & symbols for better security.
                    </p>
                  )}
                </div>
              ))}
          </div>

          <StepperControls
            currentStep={step}
            onNext={nextStep}
            onBack={prevStep}
            isLastStep={step === 4}
            nextDisabled={isNextDisabled()}
            showSubmit={
              step === 4 &&
              form.phone.trim() &&
              (registerRole !== "vendor" || (form.shopName.trim() && form.gstNumber.trim()))
            }
            loading={loading}
            submitButton={["Register", "Registering"]}
            onSubmitClick={handleSubmit}
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
          className={`w-[840px] rounded-3xl ${step === 3 ? "h-[860px]" : "h-[740px]"}`}
        />
      </div>
    </section>
  );
};

export default Register;