import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Eye,
  Download,
  CheckSquare,
  Square,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchBrandById, updateBrand } from "@/store/slices/adminSlice";
import KycApproveDialog from "./KycApproveDialog";
import KycRejectDialog from "./KycRejectDialog";
import type { IBrand } from "@/interface";

// Mock document types — since backend doesn't store KYC docs yet
const DOC_TYPES = [
  {
    key: "pan",
    label: "PAN Card",
    desc: "Business PAN",
    filename: "pan_card.pdf",
  },
  {
    key: "gst",
    label: "GST Certificate",
    desc: "GSTIN Certificate",
    filename: "gst_certificate.pdf",
  },
  {
    key: "business_proof",
    label: "Business Proof",
    desc: "Incorporation Certificate",
    filename: "incorporation_cert.pdf",
  },
];

const CHECKLIST_ITEMS = [
  "All documents are clear and readable",
  "Document details match brand information",
  "GST/PAN numbers are valid (if applicable)",
  "Business address is verifiable",
  "No discrepancies found in submitted information",
];

export default function BrandKycReviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedBrand: brand, selectedBrandLoading } = useAppSelector(
    (s) => s.admin,
  );

  const [checklist, setChecklist] = useState<boolean[]>(
    CHECKLIST_ITEMS.map(() => false),
  );
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchBrandById(Number(id)));
  }, [dispatch, id]);

  const brandWithRelations = brand as IBrand & {
    users?: {
      id: number;
      username: string;
      phone_number: string;
      role: string;
    }[];
  };
  const owner = brandWithRelations?.users?.find(
    (u) => u.role === "brand_admin",
  );

  const toggleCheck = (idx: number) => {
    setChecklist((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  const handleApprove = async () => {
    if (!brand) return;
    setActionLoading(true);
    await dispatch(
      updateBrand({
        id: brand.id,
        data: { verification_status: true, status: "active" } as never,
      }),
    );
    setActionLoading(false);
    setApproveOpen(false);
    navigate("/admin/dashboard/brands");
  };

  const handleReject = async (_reason: string) => {
    if (!brand) return;
    setActionLoading(true);
    await dispatch(
      updateBrand({
        id: brand.id,
        data: { verification_status: false, status: "suspended" } as never,
      }),
    );
    setActionLoading(false);
    setRejectOpen(false);
    navigate("/admin/dashboard/brands");
  };

  if (selectedBrandLoading || !brand) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-3 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Use certifications from brand_details if available
  const certifications = (brand.brand_details as Record<string, unknown>)
    ?.certifications as string[] | undefined;
  const documents =
    certifications && certifications.length > 0
      ? certifications.map((cert, i) => ({
          key: `cert-${i}`,
          label: cert,
          desc: cert,
          filename: `${cert.toLowerCase().replace(/\s+/g, "_")}.pdf`,
          uploadDate: brand.created_at,
        }))
      : DOC_TYPES.map((doc) => ({
          ...doc,
          uploadDate: brand.created_at,
        }));

  return (
    <div className="space-y-6">
      {/* Breadcrumb + Header */}
      <div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/dashboard/brands")}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              KYC Document Review
            </h1>
            <p className="text-sm text-gray-500">
              Review and verify business documents for approval
            </p>
          </div>
        </div>
      </div>

      {/* Brand Information */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Brand Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <span className="text-xs text-violet-600 font-medium">
              Brand Name
            </span>
            <p className="text-sm font-medium text-gray-900 mt-0.5">
              {brand.name}
            </p>
          </div>
          <div>
            <span className="text-xs text-violet-600 font-medium">Owner</span>
            <p className="text-sm font-medium text-gray-900 mt-0.5">
              {owner?.username || "—"}
            </p>
          </div>
          <div>
            <span className="text-xs text-violet-600 font-medium">Email</span>
            <p className="text-sm text-gray-900 mt-0.5">
              {brand.contact_info?.email || "—"}
            </p>
          </div>
          <div>
            <span className="text-xs text-violet-600 font-medium">Phone</span>
            <p className="text-sm text-gray-900 mt-0.5">
              {brand.contact_info?.phone || "—"}
            </p>
          </div>
          <div>
            <span className="text-xs text-violet-600 font-medium">
              Category
            </span>
            <p className="text-sm text-gray-900 mt-0.5">
              {brand.categories?.length
                ? `${brand.categories.length} categories`
                : "—"}
            </p>
          </div>
          <div>
            <span className="text-xs text-violet-600 font-medium">
              Signup Date
            </span>
            <p className="text-sm text-gray-900 mt-0.5">
              {new Date(brand.created_at).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Submitted Documents */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Submitted Documents
        </h2>
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.key}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {doc.label}
                  </p>
                  <p className="text-xs text-gray-500">
                    {doc.filename} • Uploaded{" "}
                    {new Date(doc.uploadDate).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-8 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 mr-1" /> Preview
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-8 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 mr-1" /> Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Checklist */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Review Checklist
        </h2>
        <div className="space-y-3">
          {CHECKLIST_ITEMS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => toggleCheck(idx)}
              className="flex items-center gap-3 text-sm text-gray-700 w-full text-left cursor-pointer hover:text-gray-900 transition-colors"
            >
              {checklist[idx] ? (
                <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-gray-300 shrink-0" />
              )}
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Review Decision */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Review Decision
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1 h-11 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
            onClick={() => setRejectOpen(true)}
          >
            <ShieldX className="w-4 h-4 mr-2" /> Reject KYC
          </Button>
          <Button
            className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
            onClick={() => setApproveOpen(true)}
          >
            <ShieldCheck className="w-4 h-4 mr-2" /> Approve & Activate Brand
          </Button>
        </div>
      </div>

      {/* Dialogs */}
      <KycApproveDialog
        open={approveOpen}
        brandName={brand.name}
        loading={actionLoading}
        onConfirm={handleApprove}
        onCancel={() => setApproveOpen(false)}
      />
      <KycRejectDialog
        open={rejectOpen}
        brandName={brand.name}
        loading={actionLoading}
        onConfirm={handleReject}
        onCancel={() => setRejectOpen(false)}
      />
    </div>
  );
}
