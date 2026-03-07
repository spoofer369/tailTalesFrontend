import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Building } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  updateBrandInfo,
  updateContact,
  updateAddress,
  createBrand,
  clearBrandError,
  resetBrandRegistration,
  nextStep,
  prevStep,
} from "@/store/slices/brandSlice";
import StepIndicator from "@/components/brand/StepIndicator";
import BrandInfoStep from "@/components/brand/BrandInfoStep";
import ContactStep from "@/components/brand/ContactStep";
import AddressStep from "@/components/brand/AddressStep";

const fadeIn = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

export default function BrandRegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    currentStep,
    brandInfo,
    contact,
    address,
    isSubmitting,
    error: brandError,
    createdBrand,
  } = useAppSelector((state) => state.brandRegistration);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(resetBrandRegistration());
    };
  }, [dispatch]);

  // Redirect after brand created
  useEffect(() => {
    if (createdBrand) {
      setTimeout(() => navigate("/brand/login", { replace: true }), 2000);
    }
  }, [createdBrand, navigate]);

  // ── Navigation Handlers ──

  const handleNext = () => {
    dispatch(nextStep());
  };

  const handlePrev = () => {
    dispatch(prevStep());
  };

  const handleCompleteRegistration = () => {
    dispatch(clearBrandError());
    dispatch(createBrand());
  };

  // ── Computed ──
  const completedSteps = Array.from(
    { length: currentStep - 1 },
    (_, i) => i + 1,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50/60 via-white to-purple-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Top navigation */}
        {currentStep === 1 && !createdBrand && (
          <Link
            to="/brand/login"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Login
          </Link>
        )}
        {currentStep > 1 && !createdBrand && (
          <button
            onClick={handlePrev}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Previous Step
          </button>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200/60 shadow-xl shadow-violet-100/50 p-8"
        >
          {/* Header */}
          {!createdBrand && (
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-200">
                  <Building className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-violet-700 mb-1">
                  Register Your Brand
                </h1>
                <p className="text-sm text-gray-500">
                  Complete the steps below to join Vividly
                </p>
              </div>

              {/* Step Indicator */}
              <StepIndicator
                currentStep={currentStep}
                completedSteps={completedSteps}
              />
            </>
          )}

          <AnimatePresence mode="wait">
            {/* ─── BRAND INFO (Step 1) ─── */}
            {currentStep === 1 && !createdBrand && (
              <BrandInfoStep
                key="brandInfo"
                data={brandInfo}
                onChange={(data) => dispatch(updateBrandInfo(data))}
                onNext={handleNext}
              />
            )}

            {/* ─── CONTACT (Step 2) ─── */}
            {currentStep === 2 && !createdBrand && (
              <ContactStep
                key="contact"
                data={contact}
                onChange={(data) => dispatch(updateContact(data))}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            )}

            {/* ─── ADDRESS (Step 3) ─── */}
            {currentStep === 3 && !createdBrand && (
              <AddressStep
                key="address"
                data={address}
                onChange={(data) => dispatch(updateAddress(data))}
                onSubmit={handleCompleteRegistration}
                onPrev={handlePrev}
                isSubmitting={isSubmitting}
              />
            )}

            {/* ─── SUCCESS ─── */}
            {createdBrand && (
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
                  <p className="text-gray-500">
                    Redirecting to login…
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Brand registration error */}
          {brandError && !createdBrand && (
            <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg mt-4">
              {brandError}
            </p>
          )}
        </motion.div>

        {/* Bottom link */}
        {!createdBrand && (
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/brand/login"
              className="text-violet-600 hover:text-violet-700 font-medium"
            >
              Brand Login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
