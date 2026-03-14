import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import type { FooterProps } from "@/interface";

export function Footer({ onAdminLogin }: FooterProps) {
  const [adminClickCount, setAdminClickCount] = useState(0);
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const navigate = useNavigate();

  const handleFooterClick = useCallback(() => {
    const newCount = adminClickCount + 1;
    setAdminClickCount(newCount);

    if (newCount === 3) {
      setShowAdminPrompt(true);
      setAdminClickCount(0);
      setTimeout(() => setShowAdminPrompt(false), 4000);
    }

    // Reset counter after 2 seconds of inactivity
    setTimeout(() => {
      setAdminClickCount((prev) => (prev < 3 ? 0 : prev));
    }, 2000);
  }, [adminClickCount]);

  const handleAdminLogin = () => {
    setShowAdminPrompt(false);
    if (onAdminLogin) {
      onAdminLogin();
    } else {
      navigate("/admin/login");
    }
  };

  return (
    <>
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-linear-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Vividly</div>
                <div className="text-sm text-gray-500">
                  Connecting brands & customers
                </div>
              </div>
            </Link>
            <div
              className="text-sm text-gray-400 cursor-default select-none"
              onClick={handleFooterClick}
            >
              © {new Date().getFullYear()} Vividly. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Hidden Admin Access Modal */}
      <AnimatePresence>
        {showAdminPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowAdminPrompt(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-14 h-14 bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                Admin Access
              </h3>
              <p className="text-sm text-gray-500 mb-6 text-center leading-relaxed">
                Internal team access for managing brands and users
              </p>
              <Button
                onClick={handleAdminLogin}
                className="w-full bg-gray-900 text-white hover:bg-gray-800 cursor-pointer"
              >
                Continue to Admin
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
