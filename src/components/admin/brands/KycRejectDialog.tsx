import { useState } from "react";
import { ShieldX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KycRejectDialogProps {
  open: boolean;
  brandName: string;
  loading?: boolean;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export default function KycRejectDialog({
  open,
  brandName,
  loading,
  onConfirm,
  onCancel,
}: KycRejectDialogProps) {
  const [reason, setReason] = useState("");

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
            <ShieldX className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Reject Brand KYC
          </h3>
          <p className="text-sm text-gray-500 mt-1.5">
            Please provide a reason for rejection. The brand will be notified.
          </p>
        </div>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g., Documents are not clear, missing required information..."
          className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-700 resize-none h-24 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 mb-4"
        />
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            onClick={() => onConfirm(reason)}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}
