import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/hooks/useToast";
import { createUserApi } from "@/services/userService";

const BRAND_ROLES = [
  { value: "brand_admin", label: "Owner", description: "Full access to all features and settings" },
  { value: "brand_manager", label: "Admin", description: "Manage products, posts, and users" },
  { value: "brand_staff", label: "Viewer", description: "View-only access to dashboard" },
];

interface AddTeamMemberDialogProps {
  open: boolean;
  brandName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddTeamMemberDialog({
  open,
  brandName,
  onClose,
  onSuccess,
}: AddTeamMemberDialogProps) {
  const { showToast } = useToast();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("brand_staff");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const resetAndClose = () => {
    setFirstName("");
    setLastName("");
    setUsername("");
    setPhone("");
    setRole("brand_staff");
    setErrors({});
    onClose();
  };

  const handleSubmit = async () => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = "First name is required";
    if (!lastName.trim()) errs.lastName = "Last name is required";
    if (!username.trim()) errs.username = "Username is required";
    if (!phone.trim()) errs.phone = "Phone number is required";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setIsSubmitting(true);
    try {
      await createUserApi({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        username: username.trim(),
        phone_number: phone.trim(),
        role,
        brand_name: brandName,
      });
      showToast({ type: "success", title: "Team member added successfully" });
      resetAndClose();
      onSuccess();
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : "Please try again";
      showToast({
        type: "error",
        title: "Failed to add team member",
        subtitle: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedRole = BRAND_ROLES.find((r) => r.value === role);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={resetAndClose}
      />

      {/* Dialog */}
      <Card className="relative z-10 w-full max-w-md mx-4 shadow-2xl">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Add Team Member
            </h2>
            <button
              onClick={resetAndClose}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Username */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Username <span className="text-red-500">*</span>
              </Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
              />
              {errors.username && (
                <p className="text-xs text-red-500 mt-1">{errors.username}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Role <span className="text-red-500">*</span>
              </Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BRAND_ROLES.map((r) => (
                    <SelectItem
                      key={r.value}
                      value={r.value}
                      className="cursor-pointer"
                    >
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedRole && (
                <p className="text-xs text-gray-500 mt-1">
                  {selectedRole.description}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={resetAndClose}
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-violet-600 hover:bg-violet-700 cursor-pointer"
            >
              {isSubmitting ? "Adding…" : "Add User"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
