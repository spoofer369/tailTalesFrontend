import { ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KycApproveDialogProps {
  open: boolean;
  brandName: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function KycApproveDialog({
  open,
  brandName,
  loading,
  onConfirm,
  onCancel,
}: KycApproveDialogProps) {
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
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Approve Brand KYC?
          </h3>
          <p className="text-sm text-gray-500 mt-1.5">
            This will activate{" "}
            <span className="font-medium text-gray-700">{brandName}</span> and
            make their products visible to all customers.
          </p>
        </div>
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
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
