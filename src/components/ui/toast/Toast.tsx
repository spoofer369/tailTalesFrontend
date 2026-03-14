import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import type { ToastType } from "@/context/ToastContext";

interface ToastProps {
  type: ToastType;
  title: string;
  subtitle?: string;
  index: number;
  onDismiss: () => void;
}

const config: Record<
  ToastType,
  { bg: string; icon: typeof CheckCircle2 }
> = {
  success: {
    bg: "bg-gradient-to-r from-emerald-500 to-green-500",
    icon: CheckCircle2,
  },
  error: {
    bg: "bg-gradient-to-r from-red-500 to-rose-500",
    icon: XCircle,
  },
  info: {
    bg: "bg-gradient-to-r from-blue-500 to-indigo-500",
    icon: Info,
  },
};

export default function Toast({
  type,
  title,
  subtitle,
  onDismiss,
}: ToastProps) {
  const { bg, icon: Icon } = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.95 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`pointer-events-auto flex items-start gap-3 min-w-[300px] max-w-[420px] px-4 py-3 rounded-xl shadow-lg ${bg} text-white`}
    >
      <Icon className="w-5 h-5 mt-0.5 shrink-0" />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-tight">{title}</p>
        {subtitle && (
          <p className="text-xs opacity-90 mt-0.5 leading-snug">{subtitle}</p>
        )}
      </div>

      <button
        onClick={onDismiss}
        className="shrink-0 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
