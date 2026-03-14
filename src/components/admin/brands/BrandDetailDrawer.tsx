import {
  X,
  Globe,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Package,
  Users,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store";
import type { IBrand } from "@/interface";

interface BrandDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  onApproveKyc: (id: number) => void;
  onRejectKyc: (id: number) => void;
  onToggleStatus: (brand: IBrand) => void;
  onDelete: (id: number) => void;
}

function getKycState(brand: IBrand): "approved" | "pending" | "rejected" {
  if (brand.verification_status) return "approved";
  if (brand.status === "pending_review") return "pending";
  return "rejected";
}

export default function BrandDetailDrawer({
  open,
  onClose,
  onApproveKyc,
  onRejectKyc,
  onToggleStatus,
  onDelete,
}: BrandDetailDrawerProps) {
  const { selectedBrand: brand, selectedBrandLoading } = useAppSelector(
    (s) => s.admin,
  );

  if (!open) return null;

  const kycState = brand ? getKycState(brand) : "pending";

  // Brand detail response includes users, products, posts from getBrandById
  const brandWithRelations = brand as IBrand & {
    users?: {
      id: number;
      username: string;
      phone_number: string;
      role: string;
    }[];
    products?: {
      id: number;
      name: string;
      price: number;
      currency: string;
      active: boolean;
    }[];
    posts?: {
      id: number;
      type: string;
      content_description: string;
      created_at: string;
    }[];
  };

  const users = brandWithRelations?.users || [];
  const products = brandWithRelations?.products || [];
  const posts = brandWithRelations?.posts || [];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {brand?.name || "Loading..."}
            </h2>
            {brand && (
              <div className="flex items-center gap-2 mt-1">
                {kycState === "approved" && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                    <ShieldCheck className="w-3 h-3" /> KYC Approved
                  </span>
                )}
                {kycState === "pending" && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium">
                    <ShieldAlert className="w-3 h-3" /> KYC Pending
                  </span>
                )}
                {kycState === "rejected" && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-700 font-medium">
                    <ShieldX className="w-3 h-3" /> KYC Rejected
                  </span>
                )}
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    brand.status === "active"
                      ? "bg-emerald-50 text-emerald-700"
                      : brand.status === "suspended"
                        ? "bg-red-50 text-red-700"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {brand.status}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {selectedBrandLoading || !brand ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Description */}
              {brand.description && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    About
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {brand.description}
                  </p>
                </div>
              )}

              {/* Contact Info */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                  Contact Info
                </h3>
                <div className="space-y-2">
                  {brand.contact_info?.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {brand.contact_info.email}
                    </div>
                  )}
                  {brand.contact_info?.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {brand.contact_info.phone}
                    </div>
                  )}
                  {brand.contact_info?.address && (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {brand.contact_info.address}
                    </div>
                  )}
                  {brand.website_url && (
                    <a
                      href={brand.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-violet-600 hover:text-violet-700"
                    >
                      <Globe className="w-4 h-4" />
                      {brand.website_url}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Social Media */}
              {brand.social_media &&
                Object.values(brand.social_media).some(Boolean) && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                      Social Media
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(brand.social_media).map(([key, val]) =>
                        val ? (
                          <a
                            key={key}
                            href={
                              val.startsWith("http") ? val : `https://${val}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors capitalize"
                          >
                            {key}
                          </a>
                        ) : null,
                      )}
                    </div>
                  </div>
                )}

              {/* Products */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
                  <Package className="w-3.5 h-3.5" /> Products (
                  {products.length})
                </h3>
                {products.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">
                    No products yet
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg"
                      >
                        <span className="text-sm text-gray-800">{p.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            {p.currency || "₹"}
                            {p.price}
                          </span>
                          <span
                            className={`w-2 h-2 rounded-full ${p.active ? "bg-emerald-500" : "bg-gray-300"}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Team */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" /> Team ({users.length})
                </h3>
                {users.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">
                    No team members
                  </p>
                ) : (
                  <div className="space-y-2">
                    {users.map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <span className="text-sm text-gray-800">
                            {u.username}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            {u.phone_number}
                          </span>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 font-medium capitalize">
                          {u.role.replace("brand_", "")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Posts */}
              {posts.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                    Recent Posts ({posts.length})
                  </h3>
                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {posts.map((p) => (
                      <div
                        key={p.id}
                        className="px-3 py-2 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium capitalize">
                            {p.type}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(p.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {p.content_description || "No description"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Brand Details */}
              {brand.brand_details && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                    Brand Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {(brand.brand_details as Record<string, unknown>)
                      .founding_year && (
                      <div>
                        <span className="text-gray-500">Founded</span>
                        <p className="font-medium text-gray-900">
                          {String(
                            (brand.brand_details as Record<string, unknown>)
                              .founding_year,
                          )}
                        </p>
                      </div>
                    )}
                    {(brand.brand_details as Record<string, unknown>)
                      .headquarters && (
                      <div>
                        <span className="text-gray-500">HQ</span>
                        <p className="font-medium text-gray-900">
                          {String(
                            (brand.brand_details as Record<string, unknown>)
                              .headquarters,
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Date info */}
              <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
                Registered on{" "}
                {new Date(brand.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </>
          )}
        </div>

        {/* Actions Footer */}
        {brand && (
          <div className="p-4 border-t border-gray-200 space-y-2">
            {kycState === "pending" && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => onApproveKyc(brand.id)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 mr-1" /> Approve KYC
                </Button>
                <Button
                  size="sm"
                  onClick={() => onRejectKyc(brand.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                >
                  <ShieldX className="w-4 h-4 mr-1" /> Reject KYC
                </Button>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onToggleStatus(brand)}
                className="flex-1 cursor-pointer"
              >
                {brand.status === "active" ? "Suspend" : "Activate"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(brand.id)}
                className="text-red-600 border-red-200 hover:bg-red-50 cursor-pointer"
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
