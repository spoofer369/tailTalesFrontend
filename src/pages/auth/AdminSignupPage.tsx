import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  Info,
  AlertCircle,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OtpInput } from "@/components/ui/OtpInput";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  requestOtp,
  verifyOtp,
  signupUser,
  clearError,
  resetAuthState,
} from "@/store/slices/authSlice";
import type { AuthStep } from "@/interface";

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
};

export default function AdminSignupPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    isLoading,
    error,
    verificationId,
    isAuthenticated,
    isRegistered,
    user,
  } = useAppSelector((s) => s.auth);

  const [step, setStep] = useState<AuthStep>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [countdown, setCountdown] = useState(0);
  const [phoneError, setPhoneError] = useState("");

  // Guard: redirect if already logged in (runs once on mount)
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "super_admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (
        ["brand_admin", "brand_manager", "brand_staff"].includes(user.role)
      ) {
        navigate("/brand/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup auth state on unmount
  useEffect(
    () => () => {
      dispatch(resetAuthState());
    },
    [dispatch],
  );

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const validatePhone = (p: string) => {
    const d = p.replace(/\D/g, "");
    if (d.length !== 10) {
      setPhoneError("Please enter a valid 10-digit mobile number");
      return false;
    }
    if (!/^[6-9]/.test(d)) {
      setPhoneError("Number must start with 6, 7, 8, or 9");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const fmt = () => `+91${phoneNumber.replace(/\D/g, "")}`;

  // Step 1 — Send OTP
  const handleSendOtp = async () => {
    dispatch(clearError());
    if (!validatePhone(phoneNumber)) return;
    const r = await dispatch(requestOtp(fmt()));
    if (requestOtp.fulfilled.match(r)) {
      setStep("otp");
      setCountdown(30);
    }
  };

  // Step 2 — Verify OTP
  const handleVerifyOtp = async () => {
    dispatch(clearError());
    const otpStr = otp.join("");
    if (otpStr.length !== 4 || !verificationId) return;

    const r = await dispatch(
      verifyOtp({
        phoneNumber: fmt(),
        otp: otpStr,
        verificationId,
      }),
    );

    if (verifyOtp.fulfilled.match(r)) {
      if (r.payload.is_registered) {
        // Phone already registered — nudge to login
        setStep("phone");
        setOtp(["", "", "", ""]);
      } else {
        // Phone verified, not registered — show signup form
        setStep("signup");
      }
    }
  };

  // Step 3 — Create super_admin account
  const handleSignup = async () => {
    dispatch(clearError());
    const result = await dispatch(
      signupUser({
        phoneNumber: fmt(),
        role: "super_admin",
        username: username || undefined,
      }),
    );
    if (signupUser.fulfilled.match(result)) {
      setStep("success");
      setTimeout(() => navigate("/admin/dashboard", { replace: true }), 1500);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    const r = await dispatch(requestOtp(fmt()));
    if (requestOtp.fulfilled.match(r)) {
      setOtp(["", "", "", ""]);
      setCountdown(30);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      {/* Back link */}
      <div className="w-full max-w-sm mb-6">
        <Link
          to="/admin/login"
          className="inline-flex items-center text-sm text-gray-400 hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Login
        </Link>
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-gray-800 rounded-2xl border border-gray-700 shadow-lg p-8"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-violet-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-violet-500/20">
            <UserPlus className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Admin Signup</h1>
          <p className="text-sm text-gray-400 mt-1">
            Create a super admin account
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* ── Phone Step ── */}
          {step === "phone" && (
            <motion.div key="phone" {...fadeIn}>
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-300 mb-1.5"
                  >
                    Mobile Number
                  </Label>
                  <div className="flex mt-1.5">
                    <div className="flex items-center justify-center px-3 bg-gray-700 border border-r-0 border-gray-600 rounded-l-lg text-sm font-medium text-gray-400">
                      +91
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter 10-digit number"
                      value={phoneNumber}
                      onChange={(e) => {
                        const v = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);
                        setPhoneNumber(v);
                        if (phoneError) setPhoneError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                      className="rounded-l-none h-11 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                      maxLength={10}
                    />
                  </div>
                  {phoneError && (
                    <p className="flex items-center gap-1 text-xs text-red-400 mt-1.5">
                      <AlertCircle className="w-3 h-3" />
                      {phoneError}
                    </p>
                  )}
                </div>

                {/* Show "already registered" nudge */}
                {isRegistered === true && (
                  <p className="text-sm text-amber-400 bg-amber-950/50 border border-amber-900/50 p-3 rounded-lg">
                    This phone number is already registered.{" "}
                    <Link
                      to="/admin/login"
                      className="underline font-medium hover:text-amber-300"
                    >
                      Login instead
                    </Link>
                  </p>
                )}

                {error && (
                  <p className="text-sm text-red-400 bg-red-950/50 border border-red-900/50 p-3 rounded-lg">
                    {error}
                  </p>
                )}

                <Button
                  onClick={handleSendOtp}
                  disabled={phoneNumber.length < 10 || isLoading}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white h-11 cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Send OTP
                </Button>
              </div>

              <div className="text-center mt-5">
                <p className="text-sm text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/admin/login"
                    className="text-violet-400 hover:text-violet-300 font-medium"
                  >
                    Login
                  </Link>
                </p>
              </div>

              <div className="flex items-center gap-2 mt-5 p-3 bg-violet-950/30 rounded-lg border border-violet-800/30">
                <Info className="w-4 h-4 text-violet-400 shrink-0" />
                <p className="text-xs text-violet-300">
                  We'll send a one-time password to verify your number
                </p>
              </div>
            </motion.div>
          )}

          {/* ── OTP Step ── */}
          {step === "otp" && (
            <motion.div key="otp" {...fadeIn}>
              <button
                onClick={() => {
                  setStep("phone");
                  dispatch(clearError());
                }}
                className="text-sm text-gray-400 hover:text-gray-300 flex items-center mb-4 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Change number
              </button>
              <p className="text-sm text-gray-400 text-center mb-6">
                Enter the 4-digit code sent to{" "}
                <span className="font-medium text-gray-200">
                  +91 {phoneNumber}
                </span>
              </p>
              <div className="space-y-5">
                <div className="[&_input]:bg-gray-700 [&_input]:border-gray-600 [&_input]:text-white [&_input]:focus:border-violet-500 [&_input]:focus:ring-violet-500/20">
                  <OtpInput
                    value={otp}
                    onChange={(n) => {
                      setOtp(n);
                      if (n.every((d) => d !== ""))
                        setTimeout(() => handleVerifyOtp(), 100);
                    }}
                    disabled={isLoading}
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-400 bg-red-950/50 p-3 rounded-lg text-center">
                    {error}
                  </p>
                )}
                <Button
                  onClick={handleVerifyOtp}
                  disabled={otp.join("").length !== 4 || isLoading}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white h-11 cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Verify OTP
                </Button>
                <div className="text-center">
                  <button
                    onClick={handleResendOtp}
                    disabled={countdown > 0}
                    className="text-sm text-violet-400 hover:text-violet-300 disabled:text-gray-600 cursor-pointer"
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Signup Step (username) ── */}
          {step === "signup" && (
            <motion.div key="signup" {...fadeIn}>
              <p className="text-sm text-gray-400 text-center mb-6">
                Phone verified! Choose a username to complete registration.
              </p>
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="username"
                    className="text-sm font-medium text-gray-300 mb-1.5"
                  >
                    Username{" "}
                    <span className="text-gray-500 font-normal">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="e.g. admin_john"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                    className="mt-1.5 h-11 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                    maxLength={50}
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-400 bg-red-950/50 border border-red-900/50 p-3 rounded-lg">
                    {error}
                  </p>
                )}
                <Button
                  onClick={handleSignup}
                  disabled={isLoading}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white h-11 cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Create Admin Account
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── Success Step ── */}
          {step === "success" && (
            <motion.div key="success" {...fadeIn}>
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-7 h-7 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-white mb-1">
                  Account Created
                </h2>
                <p className="text-sm text-gray-400">
                  Loading admin panel…
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
