import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";

function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Auto-fill email from signup
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    // ✅ Validation
    if (!email || !otp) {
      return alert("All fields required");
    }

    if (otp.length < 4) {
      return alert("Invalid OTP");
    }

    setLoading(true);

    try {
      await API.post("/auth/verify-otp", { email, otp });

      alert("Account verified successfully!");

      navigate("/"); // redirect to login

    } catch (err) {
      alert(err.response?.data?.msg || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-500">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center">
          🔐 Verify OTP
        </h2>

        {/* EMAIL (READONLY) */}
        <input
          type="email"
          value={email}
          readOnly
          className="w-full p-3 border rounded-lg mb-4 bg-gray-100"
        />

        {/* OTP INPUT */}
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
        />

        {/* BUTTON */}
        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-green-600 text-white p-3 rounded-lg"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

      </div>
    </div>
  );
}

export default VerifyOTP;