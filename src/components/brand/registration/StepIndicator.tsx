import { motion } from "framer-motion";
import {
  FileText,
  User,
  MapPin,
  Check,
} from "lucide-react";

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
  completedSteps: number[];
}

const steps = [
  { number: 1, label: "Brand Info", icon: FileText },
  { number: 2, label: "Contact", icon: User },
  { number: 3, label: "Address", icon: MapPin },
];

export default function StepIndicator({
  currentStep,
  completedSteps,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto mb-8">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(step.number);
        const isActive = currentStep === step.number;
        const Icon = step.icon;

        return (
          <div key={step.number} className="flex items-center flex-1 last:flex-none">
            {/* Step circle + label */}
            <div className="flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.05 : 1,
                  backgroundColor: isCompleted
                    ? "#10b981"
                    : isActive
                      ? "#7c3aed"
                      : "#e5e7eb",
                }}
                transition={{ duration: 0.3 }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shadow-sm"
                style={{
                  color: isCompleted || isActive ? "#ffffff" : "#9ca3af",
                }}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{step.number}</span>
                )}
              </motion.div>
              <div className="mt-1.5 flex flex-col items-center">
                <Icon
                  className="w-3.5 h-3.5 mb-0.5"
                  style={{
                    color: isCompleted
                      ? "#10b981"
                      : isActive
                        ? "#7c3aed"
                        : "#9ca3af",
                  }}
                />
                <span
                  className="text-xs font-medium"
                  style={{
                    color: isCompleted
                      ? "#10b981"
                      : isActive
                        ? "#7c3aed"
                        : "#9ca3af",
                  }}
                >
                  {step.label}
                </span>
              </div>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 mt-[-24px] rounded-full overflow-hidden bg-gray-200">
                <motion.div
                  initial={false}
                  animate={{
                    width: isCompleted ? "100%" : "0%",
                  }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
