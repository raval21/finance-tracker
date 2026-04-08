import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!form.username || !form.email || !form.password) {
      return alert("All fields are required");
    }

    if (!form.email.includes("@")) {
      return alert("Enter valid email");
    }

    if (form.password.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    setLoading(true);

    try {
      await API.post("/auth/signup", form);

      alert("Signup successful. Enter OTP.");

      // ✅ Redirect with email
      navigate("/verify-otp", { state: { email: form.email } });

    } catch (err) {
      alert(err.response?.data?.msg || "Signup failed");
    } finally {
      setLoading(false); // ✅ FIXED (important)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h2 className="text-3xl font-bold text-center mb-6 text-black">
          Create Account 🚀
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>

          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <button
            disabled={loading}
            className="w-full bg-green-600 text-white p-3 rounded-lg"
          >
            {loading ? "Creating..." : "Signup"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account? <Link to="/">Login</Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;