import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { IContactForm } from "@/interface";

interface ContactStepProps {
  data: IContactForm;
  onChange: (data: Partial<IContactForm>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const fadeIn = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

export default function ContactStep({
  data,
  onChange,
  onNext,
  onPrev,
}: ContactStepProps) {
  const isValid =
    data.contactPerson.trim().length > 0 &&
    data.phone.trim().length >= 10 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);

  return (
    <motion.div {...fadeIn} className="space-y-5">
      {/* Contact Person Name */}
      <div>
        <Label
          htmlFor="contactPerson"
          className="text-sm font-medium text-gray-700 mb-1.5"
        >
          Contact Person Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="contactPerson"
          placeholder="Full name"
          value={data.contactPerson}
          onChange={(e) => onChange({ contactPerson: e.target.value })}
          className="h-12 mt-1.5"
        />
      </div>

      {/* Phone Number */}
      <div>
        <Label
          htmlFor="contactPhone"
          className="text-sm font-medium text-gray-700 mb-1.5"
        >
          Phone Number <span className="text-red-500">*</span>
        </Label>
        <div className="flex gap-2 mt-1.5">
          <div className="flex items-center justify-center px-3 h-12 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 font-medium min-w-[56px]">
            +91
          </div>
          <Input
            id="contactPhone"
            type="tel"
            placeholder="10-digit number"
            value={data.phone}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 10);
              onChange({ phone: val });
            }}
            className="h-12 flex-1"
            maxLength={10}
          />
        </div>
      </div>

      {/* Email Address */}
      <div>
        <Label
          htmlFor="contactEmail"
          className="text-sm font-medium text-gray-700 mb-1.5"
        >
          Email Address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="contactEmail"
          type="email"
          placeholder="your@email.com"
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
          className="h-12 mt-1.5"
        />
      </div>

      {/* Website */}
      <div>
        <Label
          htmlFor="contactWebsite"
          className="text-sm font-medium text-gray-700 mb-1.5"
        >
          Website <span className="text-gray-400">(Optional)</span>
        </Label>
        <Input
          id="contactWebsite"
          type="url"
          placeholder="https://yourbrand.com"
          value={data.website}
          onChange={(e) => onChange({ website: e.target.value })}
          className="h-12 mt-1.5"
        />
      </div>

      {/* Instagram + WhatsApp row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor="contactInstagram"
            className="text-sm font-medium text-gray-700 mb-1.5"
          >
            Instagram <span className="text-gray-400">(Optional)</span>
          </Label>
          <Input
            id="contactInstagram"
            placeholder="@yourbrand"
            value={data.instagram}
            onChange={(e) => onChange({ instagram: e.target.value })}
            className="h-12 mt-1.5"
          />
        </div>
        <div>
          <Label
            htmlFor="contactWhatsApp"
            className="text-sm font-medium text-gray-700 mb-1.5"
          >
            WhatsApp <span className="text-gray-400">(Optional)</span>
          </Label>
          <Input
            id="contactWhatsApp"
            placeholder="+91 98765 43210"
            value={data.whatsapp}
            onChange={(e) => onChange({ whatsapp: e.target.value })}
            className="h-12 mt-1.5"
          />
        </div>
      </div>

      {/* Prev / Next Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          onClick={onPrev}
          className="flex-1 h-12 border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white h-12 cursor-pointer shadow-md shadow-violet-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Step
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}
