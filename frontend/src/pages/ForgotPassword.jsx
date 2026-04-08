import { useState } from "react";
import API from "../services/api";

function ForgotPassword() {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // STEP 1 → Send OTP
  const sendOTP = async () => {
    if (!email || !email.includes("@")) {
      return alert("Enter valid email");
    }

    setLoading(true);

    try {
      await API.post("/auth/forgot-password", { email });
      alert("OTP sent (check console/email)");
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.msg || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 → Verify OTP
  const verifyOTP = async () => {
    if (!otp) return alert("Enter OTP");

    setLoading(true);

    try {
      await API.post("/auth/verify-forgot-otp", { email, otp });
      alert("OTP Verified");
      setStep(3);
    } catch (err) {
      alert(err.response?.data?.msg || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3 → Reset Password
  const resetPassword = async () => {
    if (!password) return alert("Enter new password");

    setLoading(true);

    try {
      await API.post("/auth/reset-password", {
        email,
        password,
      });

      alert("Password reset successful");
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.msg || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-400 to-pink-500">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6">
          🔐 Forgot Password
        </h2>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
            />

            <button
              onClick={sendOTP}
              className="w-full bg-red-500 text-white p-3 rounded-lg"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
            />

            <button
              onClick={verifyOTP}
              className="w-full bg-blue-500 text-white p-3 rounded-lg"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="Enter new password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
            />

            <button
              onClick={resetPassword}
              className="w-full bg-green-500 text-white p-3 rounded-lg"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default ForgotPassword;