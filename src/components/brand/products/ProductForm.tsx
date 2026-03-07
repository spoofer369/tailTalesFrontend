import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, Eye, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  addProduct,
  editProduct,
  fetchCategories,
} from "@/store/slices/productSlice";
import { getProductByIdApi } from "@/services/productService";
import { useToast } from "@/hooks/useToast";

export default function ProductForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const { user } = useAppSelector((s) => s.auth);
  const { brand } = useAppSelector((s) => s.brandDashboard);
  const { categories, categoriesLoading } = useAppSelector((s) => s.products);

  // Use user.brand_id, falling back to brand.id from dashboard slice
  const brandId = user?.brand_id || brand?.id || null;

  const isEdit = Boolean(id && id !== "new");

  // ── Form state ──
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load categories
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  // Load product for edit
  useEffect(() => {
    if (isEdit && id) {
      setIsLoadingProduct(true);
      getProductByIdApi(Number(id))
        .then((res) => {
          if (res.success) {
            const p = res.data;
            setName(p.name);
            setDescription(p.description || "");
            setPrice(String(p.price));
            setCategoryId(p.categories?.[0] || "");
            if (p.catalog_content?.[0]) setImagePreview(p.catalog_content[0]);
          } else {
            showToast({ type: "error", title: "Product not found" });
            navigate("/brand/dashboard/products");
          }
        })
        .catch(() => {
          showToast({ type: "error", title: "Failed to load product" });
          navigate("/brand/dashboard/products");
        })
        .finally(() => setIsLoadingProduct(false));
    }
  }, [isEdit, id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Validation ──
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Product name is required";
    if (!price || Number(price) <= 0) newErrors.price = "Enter a valid price";
    if (!categoryId) newErrors.category = "Select a category";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Image handler (preview only, stored as data URL or catalog_content URL) ──
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
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
      if (isEdit && id) {
        await dispatch(
          editProduct({
            id: Number(id),
            data: {
              name: name.trim(),
              description: description.trim() || undefined,
              price: Number(price),
              categories: categoryId ? [Number(categoryId)] : undefined,
              active: publishNow,
            },
          }),
        ).unwrap();

        showToast({
          type: "success",
          title: "Product updated successfully!",
          subtitle: publishNow
            ? "Your product is now live"
            : "Saved as draft",
        });
      } else {
        await dispatch(
          addProduct({
            name: name.trim(),
            description: description.trim() || undefined,
            price: Number(price),
            currency: "INR",
            brand_id: brandId,
            added_by: user?.id || brandId,
            categories: categoryId ? [Number(categoryId)] : [],
            active: publishNow,
          }),
        ).unwrap();

        showToast({
          type: "success",
          title: publishNow
            ? "Product published successfully!"
            : "Product saved as draft",
          subtitle: publishNow ? "Your product is now live" : undefined,
        });
      }

      navigate("/brand/dashboard/products");
    } catch (error) {
      showToast({
        type: "error",
        title: isEdit
          ? "Failed to update product"
          : "Failed to create product",
        subtitle: typeof error === "string" ? error : "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="max-w-3xl mx-auto animate-pulse space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="h-64 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/brand/dashboard/products")}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {isEdit ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-sm text-gray-500">
              Fill in the product details below
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/brand/dashboard/products")}
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
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
            className="bg-violet-600 hover:bg-violet-700 cursor-pointer"
          >
            <Eye className="w-4 h-4 mr-2" />
            {isSubmitting ? "Publishing…" : "Publish Now"}
          </Button>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <Label className="mb-2 block">
              Product Images <span className="text-red-500">*</span>
            </Label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl py-10 cursor-pointer hover:border-violet-300 hover:bg-violet-50/30 transition-colors">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 rounded-lg object-cover mb-2"
                />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-700">
                    Click to upload product images
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    Upload up to 5 images (JPG, PNG)
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Name + Category row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="productName" className="mb-1.5 block">
                Product Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="productName"
                placeholder="e.g., Premium Leather Wallet"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="category" className="mb-1.5 block">
                Category <span className="text-red-500">*</span>
              </Label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) =>
                  setCategoryId(
                    e.target.value ? Number(e.target.value) : "",
                  )
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">
                  {categoriesLoading ? "Loading…" : "Select a category"}
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs text-red-500 mt-1">{errors.category}</p>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="max-w-xs">
            <Label htmlFor="price" className="mb-1.5 block">
              Price (₹) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="2999"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            {errors.price && (
              <p className="text-xs text-red-500 mt-1">{errors.price}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="mb-1.5 block">
              Description
            </Label>
            <textarea
              id="description"
              placeholder="Describe your product in detail..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
