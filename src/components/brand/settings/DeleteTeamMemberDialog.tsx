import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { deleteUserApi } from "@/services/userService";

interface DeleteTeamMemberDialogProps {
  memberId: number;
  memberName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteTeamMemberDialog({
  memberId,
  memberName,
  onClose,
  onSuccess,
}: DeleteTeamMemberDialogProps) {
  const { showToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteUserApi(memberId);
      showToast({
        type: "success",
        title: "Team member removed successfully",
      });
      onSuccess();
      onClose();
    } catch (error) {
      showToast({
        type: "error",
        title: "Failed to remove team member",
        subtitle: typeof error === "string" ? error : "Please try again",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <Card className="relative z-10 w-full max-w-md mx-4 shadow-2xl">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Remove Team Member
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to remove{" "}
            <span className="font-medium text-gray-700">{memberName}</span>{" "}
            from the team? This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            >
              {isDeleting ? "Removing…" : "Remove"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
