import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Tag,
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchBrandProducts } from "@/store/slices/productSlice";
import DeleteProductDialog from "./DeleteProductDialog";

export default function ProductList() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { products, totalCount, totalPages, currentPage, isLoading } =
    useAppSelector((s) => s.products);

  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const brandId = user?.brand_id;

  const loadProducts = useCallback(
    (page = 1, searchTerm = search) => {
      if (!brandId) return;
      dispatch(
        fetchBrandProducts({
          brand_id: brandId,
          page,
          limit: 20,
          search: searchTerm || undefined,
        }),
      );
    },
    [dispatch, brandId, search],
  );

  useEffect(() => {
    loadProducts(1, "");
  }, [brandId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts(1, search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (page: number) => {
    loadProducts(page);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Product Catalog</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your product inventory
          </p>
        </div>
        <Button
          onClick={() => navigate("/brand/dashboard/products/new")}
          className="bg-violet-600 hover:bg-violet-700 cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <Card className="py-3">
        <CardContent className="px-4 py-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-0 shadow-none focus-visible:ring-0 bg-transparent"
            />
          </div>
        </CardContent>
      </Card>

      {/* Product Table */}
      <Card>
        {isLoading ? (
          <CardContent className="py-12">
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg" />
                  <div className="flex-1 h-4 bg-gray-100 rounded" />
                  <div className="w-20 h-4 bg-gray-100 rounded" />
                  <div className="w-16 h-4 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        ) : products.length === 0 ? (
          <CardContent className="py-16 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-medium text-gray-900 mb-1">
              No products yet
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Add your first product to get started
            </p>
            <Button
              onClick={() => navigate("/brand/dashboard/products/new")}
              className="bg-violet-600 hover:bg-violet-700 cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </CardContent>
        ) : (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <span>Product</span>
              <span>Category</span>
              <span>Price</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {/* Table Rows */}
            <div>
              {products.map((product) => (
                <div
                  key={product.id}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-4 border-b border-gray-50 last:border-0 items-center hover:bg-gray-50/50 transition-colors"
                >
                  {/* Product */}
                  <div className="flex items-center gap-3 min-w-0">
                    {product.catalog_content?.[0] ? (
                      <img
                        src={product.catalog_content[0]}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Tag className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate">
                      {product.categoryDetails?.[0]?.name || "—"}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="text-sm font-medium text-gray-900">
                    {formatPrice(product.price)}
                  </div>

                  {/* Status */}
                  <div>
                    <span
                      className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium ${
                        product.active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {product.active ? "Published" : "Draft"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        navigate(
                          `/brand/dashboard/products/${product.id}`,
                        )
                      }
                      className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteTarget({
                          id: product.id,
                          name: product.name,
                        })
                      }
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {products.length} of {totalCount} products
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {deleteTarget && (
        <DeleteProductDialog
          productId={deleteTarget.id}
          productName={deleteTarget.name}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
