import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Building,
  User,
  Check,
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
import type { AuthStep } from "@/types";

const fadeIn = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

export default function BrandRegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, verificationId, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );

  const [step, setStep] = useState<AuthStep>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [brandName, setBrandName] = useState("");
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/brand/onboarding", { replace: true });
    }
  }, [isAuthenticated, navigate]);

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

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("91") && cleaned.length <= 12) return `+${cleaned}`;
    if (cleaned.length === 10) return `+91${cleaned}`;
    return phone.startsWith("+") ? phone : `+${phone}`;
  };

  const handleSendOtp = async () => {
    dispatch(clearError());
    const formatted = formatPhoneNumber(phoneNumber);
    const result = await dispatch(requestOtp(formatted));
    if (requestOtp.fulfilled.match(result)) {
      setStep("otp");
      setCountdown(30);
    }
  };

  const handleVerifyOtp = async () => {
    dispatch(clearError());
    const otpString = otp.join("");
    if (otpString.length !== 4 || !verificationId) return;

    const formatted = formatPhoneNumber(phoneNumber);
    const result = await dispatch(
      verifyOtp({
        phoneNumber: formatted,
        otp: otpString,
        verificationId,
      }),
    );

    if (verifyOtp.fulfilled.match(result)) {
      if (result.payload.is_registered) {
        // Already registered — redirect to login
        navigate("/brand/login", { replace: true });
      } else {
        setStep("signup");
      }
    }
  };

  const handleSignup = async () => {
    dispatch(clearError());
    const formatted = formatPhoneNumber(phoneNumber);
    const result = await dispatch(
      signupUser({
        phoneNumber: formatted,
        role: "brand_admin",
        username: brandName || undefined,
      }),
    );
    if (signupUser.fulfilled.match(result)) {
      setStep("success");
      setTimeout(() => navigate("/brand/onboarding", { replace: true }), 1500);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    const formatted = formatPhoneNumber(phoneNumber);
    const result = await dispatch(requestOtp(formatted));
    if (requestOtp.fulfilled.match(result)) {
      setOtp(["", "", "", ""]);
      setCountdown(30);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200/60 shadow-xl shadow-emerald-100/50 p-8"
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md shadow-emerald-200">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-semibold text-gray-900">
                Register Brand
              </span>
              <p className="text-xs text-gray-400">Get started on Vividly</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === "phone" && (
              <motion.div key="phone" {...fadeIn}>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  List Your Brand
                </h1>
                <p className="text-gray-500 mb-6">
                  Start reaching local customers today
                </p>

                {/* Benefits */}
                <div className="space-y-2 mb-6">
                  {[
                    "Free brand profile & product catalog",
                    "City-based visibility to shoppers",
                    "Direct WhatsApp inquiries",
                  ].map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span className="text-sm text-gray-600">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Phone Number
                    </Label>
                    <div className="relative mt-1.5">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter 10-digit number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
                      {error}
                    </p>
                  )}

                  <Button
                    onClick={handleSendOtp}
                    disabled={
                      phoneNumber.replace(/\D/g, "").length < 10 || isLoading
                    }
                    className="w-full bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white h-12 cursor-pointer"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

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

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Verify Your Number
                </h1>
                <p className="text-gray-500 mb-8">
                  Code sent to{" "}
                  <span className="font-medium text-gray-700">
                    {formatPhoneNumber(phoneNumber)}
                  </span>
                </p>

                <div className="space-y-6">
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
                    className="w-full bg-linear-to-r from-emerald-500 to-teal-500 text-white h-12 cursor-pointer"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Verify & Continue
                  </Button>

                  <div className="text-center">
                    <button
                      onClick={handleResendOtp}
                      disabled={countdown > 0}
                      className="text-sm text-emerald-600 hover:text-emerald-700 disabled:text-gray-400"
                    >
                      {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === "signup" && (
              <motion.div key="signup" {...fadeIn}>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Set Up Your Brand
                </h1>
                <p className="text-gray-500 mb-8">
                  Enter your brand name to create your account
                </p>

                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="brandName"
                      className="text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Brand Name
                    </Label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="brandName"
                        placeholder="Your brand name"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                        className="pl-10 h-12"
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
                    className="w-full bg-linear-to-r from-emerald-500 to-teal-500 text-white h-12 cursor-pointer"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Create Brand Account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div key="success" {...fadeIn}>
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-emerald-500"
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Brand Registered!
                  </h2>
                  <p className="text-gray-500">Taking you to onboarding…</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/brand/login"
            className="text-violet-600 hover:text-violet-700 font-medium"
          >
            Brand Login
          </Link>
        </p>
      </div>
    </div>
  );
}
