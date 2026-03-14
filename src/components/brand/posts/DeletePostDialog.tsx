import { useAppDispatch } from "@/store";
import { removePost } from "@/store/slices/postSlice";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface DeletePostDialogProps {
  postId: number;
  postName: string;
  onClose: () => void;
}

export default function DeletePostDialog({
  postId,
  postName,
  onClose,
}: DeletePostDialogProps) {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(removePost(postId)).unwrap();
      showToast({
        type: "success",
        title: "Post deleted successfully",
      });
      onClose();
    } catch (error) {
      showToast({
        type: "error",
        title: "Failed to delete post",
        subtitle: typeof error === "string" ? error : "Please try again",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <Card className="relative z-10 w-full max-w-md mx-4 shadow-2xl">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Delete Post
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-medium text-gray-700">"{postName}"</span>?
            This action cannot be undone.
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
              {isDeleting ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
