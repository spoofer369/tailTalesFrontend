import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { IAddressForm } from "@/interface";

interface AddressStepProps {
  data: IAddressForm;
  onChange: (data: Partial<IAddressForm>) => void;
  onSubmit: () => void;
  onPrev: () => void;
  isSubmitting: boolean;
}

const fadeIn = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

export default function AddressStep({
  data,
  onChange,
  onSubmit,
  onPrev,
  isSubmitting,
}: AddressStepProps) {
  const isValid =
    data.address.trim().length > 0 && data.city.trim().length > 0;

  return (
    <motion.div {...fadeIn} className="space-y-5">
      {/* Business Address */}
      <div>
        <Label
          htmlFor="businessAddress"
          className="text-sm font-medium text-gray-700 mb-1.5"
        >
          Business Address <span className="text-red-500">*</span>
        </Label>
        <textarea
          id="businessAddress"
          placeholder="Street address, building, floor"
          value={data.address}
          onChange={(e) => onChange({ address: e.target.value })}
          rows={3}
          className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 resize-none transition-all"
        />
      </div>

      {/* City & Country */}
      <div>
        <Label
          htmlFor="cityCountry"
          className="text-sm font-medium text-gray-700 mb-1.5"
        >
          City & Country <span className="text-red-500">*</span>
        </Label>
        <div className="relative mt-1.5">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            id="cityCountry"
            placeholder="Search and select city..."
            value={data.city}
            onChange={(e) => onChange({ city: e.target.value })}
            className="h-12 pl-10"
          />
        </div>
      </div>

      {/* PIN Code */}
      <div>
        <Label
          htmlFor="pinCode"
          className="text-sm font-medium text-gray-700 mb-1.5"
        >
          PIN Code <span className="text-gray-400">(Optional)</span>
        </Label>
        <Input
          id="pinCode"
          placeholder="6-digit PIN code"
          value={data.pinCode}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 6);
            onChange({ pinCode: val });
          }}
          className="h-12 mt-1.5"
          maxLength={6}
        />
      </div>

      {/* Prev / Submit Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={isSubmitting}
          className="flex-1 h-12 border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!isValid || isSubmitting}
          className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white h-12 cursor-pointer shadow-md shadow-violet-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <CheckCircle className="w-4 h-4 mr-2" />
          )}
          Complete Registration
        </Button>
      </div>
    </motion.div>
  );
}
