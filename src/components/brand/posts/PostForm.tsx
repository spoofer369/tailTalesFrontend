import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X, Image, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store";
import { useToast } from "@/hooks/useToast";
import { addPost, editPost } from "@/store/slices/postSlice";
import { fetchCategories, fetchBrandProducts } from "@/store/slices/productSlice";
import { getPostByIdApi } from "@/services/postService";

const MAX_CAPTION = 500;

export default function PostForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const { user } = useAppSelector((s) => s.auth);
  const { brand } = useAppSelector((s) => s.brandDashboard);
  const { categories, categoriesLoading, products } = useAppSelector(
    (s) => s.products,
  );

  const brandId = user?.brand_id || brand?.id || null;
  const isEdit = Boolean(id && id !== "new");

  // ── Form state ──
  const [postType, setPostType] = useState("image");
  const [contentUrl, setContentUrl] = useState("");
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [productId, setProductId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Load categories + products on mount ──
  useEffect(() => {
    dispatch(fetchCategories());
    if (brandId) {
      dispatch(
        fetchBrandProducts({ brand_id: brandId, limit: 100 }),
      );
    }
  }, [dispatch, brandId]);

  // ── Load existing post for editing ──
  useEffect(() => {
    if (!isEdit || !id) return;
    const loadPost = async () => {
      try {
        const res = await getPostByIdApi(Number(id));
        if (res.success && res.data) {
          const p = res.data;
          setPostType(p.type || "image");
          setContentUrl(p.content_url || "");
          setMediaPreview(p.content_url || null);
          setCaption(p.content_description || "");
          setProductId(p.product_id ? String(p.product_id) : "");
          setCategoryId(
            p.categories?.length ? String(p.categories[0]) : "",
          );
          setCtaUrl(p.cta_url || "");
        }
      } catch {
        showToast({ type: "error", title: "Failed to load post" });
      }
    };
    loadPost();
  }, [id, isEdit]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Media upload handler ──
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Determine type from file
    if (file.type.startsWith("video/")) {
      setPostType("video");
    } else {
      setPostType("image");
    }

    // Create preview + data URL
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setMediaPreview(dataUrl);
      // For now store data URL as content_url preview
      // In production this would be a real upload URL
      setContentUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const removeMedia = () => {
    setMediaPreview(null);
    setContentUrl("");
  };

  // ── Validation ──
  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!contentUrl.trim()) {
      errs.media = "Media is required";
    }
    if (!caption.trim()) {
      errs.caption = "Caption is required";
    } else if (caption.length > MAX_CAPTION) {
      errs.caption = `Caption cannot exceed ${MAX_CAPTION} characters`;
    }
    if (!productId) {
      errs.product = "Please select a product to tag";
    }
    if (!categoryId) {
      errs.category = "Please select a category";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Submit ──
  const handleSubmit = async (publishNow: boolean) => {
    if (!validate()) return;
    if (!brandId) {
      showToast({ type: "error", title: "No brand linked to your account" });
      return;
    }

    setIsSubmitting(true);
    try {
      // Filter out data URIs for content_url (backend expects a URL)
      const finalContentUrl =
        contentUrl.startsWith("data:") ? `https://placeholder.media/${Date.now()}` : contentUrl;

      if (isEdit && id) {
        await dispatch(
          editPost({
            id: Number(id),
            data: {
              type: postType,
              product_id: Number(productId),
              categories: categoryId ? [Number(categoryId)] : [],
              content_description: caption.trim(),
              content_url: finalContentUrl,
              cta_url: ctaUrl.trim() || undefined,
              active: publishNow,
            },
          }),
        ).unwrap();
        showToast({ type: "success", title: "Post updated successfully" });
      } else {
        await dispatch(
          addPost({
            type: postType,
            product_id: Number(productId),
            categories: categoryId ? [Number(categoryId)] : [],
            content_description: caption.trim(),
            content_url: finalContentUrl,
            cta_url: ctaUrl.trim() || undefined,
            feed_content: true,
          }),
        ).unwrap();
        showToast({
          type: "success",
          title: publishNow
            ? "Post published successfully"
            : "Post saved as draft",
        });
      }
      navigate("/brand/dashboard/posts");
    } catch (error) {
      showToast({
        type: "error",
        title: isEdit ? "Failed to update post" : "Failed to create post",
        subtitle: typeof error === "string" ? error : "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/brand/dashboard/posts")}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {isEdit ? "Edit Post" : "Create New Post"}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEdit
                ? "Update your post content"
                : "Share content with your customers"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/brand/dashboard/posts")}
            disabled={isSubmitting}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
            className="cursor-pointer"
          >
            Save Draft
          </Button>
          <Button
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
            className="bg-violet-600 hover:bg-violet-700 cursor-pointer"
          >
            {isSubmitting ? "Publishing…" : "Publish Now"}
          </Button>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Media Upload */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Media (Images or Video) <span className="text-red-500">*</span>
            </Label>
            {!mediaPreview ? (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-violet-300 hover:bg-violet-50/30 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-600">
                  Click to upload media
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Images or Video (multiple images for carousel)
                </p>
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleMediaUpload}
                />
              </label>
            ) : (
              <div className="space-y-3">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-violet-300 hover:bg-violet-50/30 transition-colors">
                  <Upload className="w-6 h-6 text-gray-400 mb-1" />
                  <p className="text-xs text-gray-500">
                    Click to replace media
                  </p>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleMediaUpload}
                  />
                </label>

                {/* Uploaded media preview */}
                <div className="border border-gray-100 rounded-lg p-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    {postType === "video" ? (
                      <Video className="w-5 h-5 text-gray-500" />
                    ) : (
                      <Image className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  <span className="text-sm text-gray-600 flex-1 capitalize">
                    {postType}
                  </span>
                  <button
                    onClick={removeMedia}
                    className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            {errors.media && (
              <p className="text-xs text-red-500 mt-1">{errors.media}</p>
            )}
          </div>

          {/* Caption */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Caption <span className="text-red-500">*</span>
            </Label>
            <Textarea
              placeholder="Write an engaging caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={4}
              className="resize-none"
              maxLength={MAX_CAPTION}
            />
            <p className="text-xs text-gray-400 mt-1">
              {caption.length}/{MAX_CAPTION} characters
            </p>
            {errors.caption && (
              <p className="text-xs text-red-500 mt-0.5">{errors.caption}</p>
            )}
          </div>

          {/* Tag Product */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Tag Product <span className="text-red-500">*</span>
            </Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem
                    key={p.id}
                    value={String(p.id)}
                    className="cursor-pointer"
                  >
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.product && (
              <p className="text-xs text-red-500 mt-1">{errors.product}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select
              value={categoryId}
              onValueChange={setCategoryId}
              disabled={categoriesLoading}
            >
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue
                  placeholder={
                    categoriesLoading
                      ? "Loading categories..."
                      : "Select a category"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem
                    key={c.id}
                    value={String(c.id)}
                    className="cursor-pointer"
                  >
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-red-500 mt-1">{errors.category}</p>
            )}
          </div>

          {/* CTA URL (optional — maps to backend cta_url) */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              CTA URL (Optional)
            </Label>
            <Input
              placeholder="https://example.com/product-page"
              value={ctaUrl}
              onChange={(e) => setCtaUrl(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
