import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { IBrandInfoForm } from "@/interface";

interface BrandInfoStepProps {
  data: IBrandInfoForm;
  onChange: (data: Partial<IBrandInfoForm>) => void;
  onNext: () => void;
}

const fadeIn = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

export default function BrandInfoStep({
  data,
  onChange,
  onNext,
}: BrandInfoStepProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(
    data.logo || null,
  );

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        // For Phase-1 we store a data URL; actual upload will come later
        onChange({ logo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
    onChange({ logo: "" });
  };

  const isValid = data.name.trim().length > 0 && data.description.trim().length > 0;

  return (
    <motion.div {...fadeIn} className="space-y-5">
      {/* Brand Name */}
      <div>
        <Label
          htmlFor="brandName"
          className="text-sm font-medium text-gray-700 mb-1.5"
        >
          Brand Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="brandName"
          placeholder="e.g., Vividly Brand"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="h-12 mt-1.5"
          maxLength={100}
        />
      </div>

      {/* Brand Logo */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-1.5">
          Brand Logo <span className="text-gray-400">(Optional)</span>
        </Label>
        <div className="mt-1.5">
          {logoPreview ? (
            <div className="relative border border-gray-200 rounded-xl p-4 flex items-center justify-center bg-gray-50 min-h-[120px]">
              <img
                src={logoPreview}
                alt="Brand logo preview"
                className="max-h-24 max-w-full object-contain rounded-lg"
              />
              <button
                onClick={removeLogo}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <label
              htmlFor="logoUpload"
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-violet-400 hover:bg-violet-50/30 transition-all min-h-[120px]"
            >
              <Upload className="w-6 h-6 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Click to upload logo</span>
              <span className="text-xs text-gray-400 mt-1">
                PNG, JPG up to 5MB
              </span>
              <input
                id="logoUpload"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleLogoSelect}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Brand Description */}
      <div>
        <Label
          htmlFor="brandDescription"
          className="text-sm font-medium text-gray-700 mb-1.5"
        >
          Brand Description <span className="text-red-500">*</span>
        </Label>
        <textarea
          id="brandDescription"
          placeholder="Tell customers about your brand..."
          value={data.description}
          onChange={(e) => {
            if (e.target.value.length <= 500) {
              onChange({ description: e.target.value });
            }
          }}
          rows={4}
          className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 resize-none transition-all"
        />
        <p className="text-xs text-gray-400 mt-1">
          {data.description.length}/500 characters
        </p>
      </div>

      {/* Next Button */}
      <Button
        onClick={onNext}
        disabled={!isValid}
        className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white h-12 cursor-pointer shadow-md shadow-violet-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next Step
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </motion.div>
  );
}
