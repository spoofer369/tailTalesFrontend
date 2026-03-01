import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  Building,
  Menu,
  X,
  Compass,
  LogIn,
  UserPlus,
  Check,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import type { NavbarProps } from "@/interfaces";

export function Navbar({ onBrandLogin }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleBrandLogin = () => {
    if (onBrandLogin) {
      onBrandLogin();
    } else {
      navigate("/brand/login");
    }
  };

  const handleBrandRegister = () => {
    navigate("/brand/register");
  };

  const handleExplore = () => {
    navigate("/explore");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-linear-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200 group-hover:shadow-indigo-300 transition-shadow">
            <Package className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900 tracking-tight">
            Vividly
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Explore Button */}
          <Button
            onClick={handleExplore}
            variant="ghost"
            className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
          >
            <Compass className="w-4 h-4 mr-2" />
            Explore
          </Button>

          {/* For Brands Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all cursor-pointer">
                <Building className="w-4 h-4 mr-2" />
                For Brands
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 p-2 rounded-xl">
              {/* Brand Login */}
              <DropdownMenuItem
                onClick={handleBrandLogin}
                className="flex items-start gap-3 p-3 rounded-lg cursor-pointer focus:bg-gray-50"
              >
                <div className="w-9 h-9 bg-violet-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <LogIn className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">
                    Brand Login
                  </div>
                  <div className="text-xs text-gray-500">
                    Access your dashboard
                  </div>
                </div>
              </DropdownMenuItem>

              {/* Register Brand */}
              <DropdownMenuItem
                onClick={handleBrandRegister}
                className="flex items-start gap-3 p-3 rounded-lg cursor-pointer focus:bg-gray-50"
              >
                <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <UserPlus className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">
                    Register Brand
                  </div>
                  <div className="text-xs text-gray-500">
                    Get started for free
                  </div>
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Why Vividly info */}
              <div className="px-3 py-2">
                <div className="text-xs font-semibold text-gray-400 mb-2">
                  Why Vividly?
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    Reach local customers instantly
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    Capture WhatsApp inquiries
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden border-t border-gray-100 bg-white"
          >
            <div className="p-4 space-y-3">
              <Button
                onClick={() => {
                  handleExplore();
                  setMobileMenuOpen(false);
                }}
                variant="ghost"
                className="w-full justify-start text-gray-700 cursor-pointer"
              >
                <Compass className="w-4 h-4 mr-2" />
                Explore
              </Button>
              <Button
                onClick={() => {
                  handleBrandLogin();
                  setMobileMenuOpen(false);
                }}
                variant="outline"
                className="w-full cursor-pointer"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Brand Login
              </Button>
              <Button
                onClick={() => {
                  handleBrandRegister();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-linear-to-r from-indigo-600 to-violet-600 text-white cursor-pointer"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Register Brand
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
