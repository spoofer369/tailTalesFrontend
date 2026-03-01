import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Mail,
  User,
  Info,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OtpInput } from "@/components/ui/OtpInput";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  requestOtp,
  verifyOtp,
  loginUser,
  signupUser,
  clearError,
  resetAuthState,
} from "@/store/slices/authSlice";
import type { AuthStep } from "@/types";

type LoginMethod = "phone" | "email";

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
};

export default function ConsumerAuthPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    isLoading,
    error,
    verificationId,
    isRegistered,
    isAuthenticated,
    user,
  } = useAppSelector((state) => state.auth);

  const [step, setStep] = useState<AuthStep>("phone");
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [username, setUsername] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [phoneError, setPhoneError] = useState("");

  // Redirect if already authenticated — role-aware
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "super_admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (
        ["brand_admin", "brand_manager", "brand_staff"].includes(user.role)
      ) {
        navigate("/brand/dashboard", { replace: true });
      } else {
        navigate("/explore", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    return () => {
      dispatch(resetAuthState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validatePhone = (phone: string): boolean => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      setPhoneError("Please enter a valid 10-digit mobile number");
      return false;
    }
    if (!/^[6-9]/.test(digits)) {
      setPhoneError("Number must start with 6, 7, 8, or 9");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handleSendOtp = async () => {
    dispatch(clearError());
    if (!validatePhone(phoneNumber)) return;

    const digits = phoneNumber.replace(/\D/g, "");
    const formatted = `+91${digits}`;
    const result = await dispatch(requestOtp(formatted));
    if (requestOtp.fulfilled.match(result)) {
      setStep("otp");
      setCountdown(30);
    }
  };

  const handleVerifyOtp = async () => {
    dispatch(clearError());
    const otpString = otp.join("");
    if (otpString.length !== 4) return;

    const digits = phoneNumber.replace(/\D/g, "");
    const formatted = `+91${digits}`;
    const result = await dispatch(
      verifyOtp({
        phoneNumber: formatted,
        otp: otpString,
        verificationId: verificationId!,
      }),
    );

    if (verifyOtp.fulfilled.match(result)) {
      if (result.payload.is_registered) {
        const loginResult = await dispatch(
          loginUser({
            phoneNumber: formatted,
            otp: otpString,
            verificationId: verificationId!,
          }),
        );
        if (loginUser.fulfilled.match(loginResult)) {
          setStep("success");
          setTimeout(() => navigate("/explore", { replace: true }), 1500);
        }
      } else {
        setStep("signup");
      }
    }
  };

  const handleSignup = async () => {
    dispatch(clearError());
    const digits = phoneNumber.replace(/\D/g, "");
    const formatted = `+91${digits}`;
    const result = await dispatch(
      signupUser({
        phoneNumber: formatted,
        role: "customer",
        username: username || undefined,
      }),
    );
    if (signupUser.fulfilled.match(result)) {
      setStep("success");
      setTimeout(() => navigate("/explore", { replace: true }), 1500);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    const digits = phoneNumber.replace(/\D/g, "");
    const formatted = `+91${digits}`;
    const result = await dispatch(requestOtp(formatted));
    if (requestOtp.fulfilled.match(result)) {
      setOtp(["", "", "", ""]);
      setCountdown(30);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Back link */}
      <div className="w-full max-w-sm mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-lg p-8"
      >
        {/* Icon & Title */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-violet-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-violet-200">
            <Phone className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Login</h1>
        </div>

        <AnimatePresence mode="wait">
          {/* ── Phone Step ── */}
          {step === "phone" && (
            <motion.div key="phone" {...fadeIn}>
              {/* Phone / Email Tabs */}
              <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                <button
                  onClick={() => setLoginMethod("phone")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
                    loginMethod === "phone"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  Phone
                </button>
                <button
                  onClick={() => setLoginMethod("email")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
                    loginMethod === "email"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  Email
                </button>
              </div>

              {loginMethod === "phone" ? (
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Mobile Number
                    </Label>
                    <div className="flex mt-1.5">
                      <div className="flex items-center justify-center px-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg text-sm font-medium text-gray-600">
                        +91
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter 10-digit number"
                        value={phoneNumber}
                        onChange={(e) => {
                          const val = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10);
                          setPhoneNumber(val);
                          if (phoneError) setPhoneError("");
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                        className="rounded-l-none h-11"
                        maxLength={10}
                      />
                    </div>
                    {phoneError && (
                      <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5">
                        <AlertCircle className="w-3 h-3" />
                        {phoneError}
                      </p>
                    )}
                  </div>

                  {error && (
                    <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
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
              ) : (
                /* Email tab - coming soon */
                <div className="text-center py-8">
                  <Mail className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-medium">
                    Email login coming soon
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Use phone number to login for now
                  </p>
                </div>
              )}

              {/* Bottom Links */}
              <div className="text-center mt-5">
                <p className="text-sm text-gray-500">
                  Are you a brand?{" "}
                  <Link
                    to="/brand/login"
                    className="text-violet-600 hover:text-violet-700 font-medium"
                  >
                    Brand Login
                  </Link>
                </p>
              </div>

              {/* Info text */}
              {loginMethod === "phone" && (
                <div className="flex items-center gap-2 mt-5 p-3 bg-violet-50 rounded-lg border border-violet-100">
                  <Info className="w-4 h-4 text-violet-500 shrink-0" />
                  <p className="text-xs text-violet-600">
                    We'll send you a one-time password to verify your number
                  </p>
                </div>
              )}
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
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Change number
              </button>

              <p className="text-sm text-gray-500 text-center mb-6">
                Enter the 4-digit code sent to{" "}
                <span className="font-medium text-gray-700">
                  +91 {phoneNumber}
                </span>
              </p>

              <div className="space-y-5">
                <OtpInput
                  value={otp}
                  onChange={(newOtp) => {
                    setOtp(newOtp);
                    if (newOtp.every((d) => d !== "")) {
                      setTimeout(() => handleVerifyOtp(), 100);
                    }
                  }}
                  disabled={isLoading}
                />

                {error && (
                  <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg text-center">
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
                    className="text-sm text-violet-600 hover:text-violet-700 disabled:text-gray-400 transition-colors"
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Signup Step ── */}
          {step === "signup" && (
            <motion.div key="signup" {...fadeIn}>
              <p className="text-sm text-gray-500 text-center mb-6">
                You're new here! Create an account to continue.
              </p>

              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="username"
                    className="text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Username (optional)
                  </Label>
                  <div className="relative mt-1.5">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="username"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
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
                  Create Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── Success Step ── */}
          {step === "success" && (
            <motion.div key="success" {...fadeIn}>
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-7 h-7 text-emerald-500"
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
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  {isRegistered ? "Welcome Back!" : "Account Created!"}
                </h2>
                <p className="text-sm text-gray-500">Redirecting…</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
