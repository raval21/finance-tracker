import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return alert("All fields are required");
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);

      navigate("/home");

    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h2 className="text-3xl font-bold text-center mb-6 text-black">
          Welcome Back 
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>

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
            className="w-full bg-blue-600 text-white p-3 rounded-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex justify-between mt-4 text-sm">
          <Link to="/signup">Signup</Link>
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>

      </div>
    </div>
  );
}

export default Login;