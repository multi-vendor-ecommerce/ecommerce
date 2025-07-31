import { useContext, useState } from "react";
import { useNavigate, useSearchParams, NavLink } from "react-router-dom";
import AuthContext from "../../../context/auth/AuthContext";
import AuthSiderImg from "../../../assets/auth-side-bg.png";

const UserRegister = () => {
  const { register, loading } = useContext(AuthContext); // register method from context
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: ""
  });

  const [showMore, setShowMore] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (form.password !== form.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    const result = await register(form);

    if (result.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setErrorMsg(result.error || "Registration failed");
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

          {/* Optional Fields */}
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setShowMore(!showMore)}
              className="text-blue-600 font-medium hover:underline"
            >
              {showMore ? "Hide Optional Fields" : "Add Phone & Address (optional)"}
            </button>
          </div>

          {showMore && (
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
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 transition"
          >
            <div className="font-semibold">
              {loading ? "Registering..." : "Register"}
            </div>
          </button>

          <div className="text-center mt-4">
            <p className="text-gray-700">
              Already have an account?{" "}
              <NavLink
                to={`/login?redirect=${redirectPath}`}
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

export default UserRegister;
