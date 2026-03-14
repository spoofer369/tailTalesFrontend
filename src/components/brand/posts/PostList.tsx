import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Tag,
  Heart,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchBrandPosts } from "@/store/slices/postSlice";
import DeletePostDialog from "./DeletePostDialog";

export default function PostList() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { brand } = useAppSelector((s) => s.brandDashboard);
  const { posts, totalCount, totalPages, currentPage, isLoading } =
    useAppSelector((s) => s.brandPosts);

  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const brandId = user?.brand_id || brand?.id || null;

  const loadPosts = useCallback(
    (page = 1) => {
      if (!brandId) return;
      dispatch(fetchBrandPosts({ brand_id: brandId, page, limit: 20 }));
    },
    [dispatch, brandId],
  );

  useEffect(() => {
    loadPosts(1);
  }, [brandId]); // eslint-disable-line react-hooks/exhaustive-deps

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
          <h1 className="text-xl font-bold text-gray-900">Posts</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and manage your content
          </p>
        </div>
        <Button
          onClick={() => navigate("/brand/dashboard/posts/new")}
          className="bg-violet-600 hover:bg-violet-700 cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Post
        </Button>
      </div>

      {/* Post Table */}
      <Card>
        {isLoading ? (
          <CardContent className="py-12">
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg" />
                  <div className="flex-1 h-4 bg-gray-100 rounded" />
                  <div className="w-20 h-4 bg-gray-100 rounded" />
                  <div className="w-16 h-4 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        ) : posts.length === 0 ? (
          <CardContent className="py-16 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-medium text-gray-900 mb-1">
              No posts yet
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Create your first post to engage with customers
            </p>
            <Button
              onClick={() => navigate("/brand/dashboard/posts/new")}
              className="bg-violet-600 hover:bg-violet-700 cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </CardContent>
        ) : (
          <>
            {/* Count header */}
            <div className="px-6 pt-4 pb-2">
              <h2 className="text-base font-semibold text-gray-900">
                All Posts ({totalCount})
              </h2>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr_1fr] gap-4 px-6 py-3 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <span>Post</span>
              <span>Status</span>
              <span>Product & Price</span>
              <span>Engagement</span>
              <span>Actions</span>
            </div>

            {/* Table Rows */}
            <div>
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="grid grid-cols-[2fr_1fr_1.5fr_1fr_1fr] gap-4 px-6 py-4 border-b border-gray-50 last:border-0 items-center hover:bg-gray-50/50 transition-colors"
                >
                  {/* Post */}
                  <div className="flex items-start gap-3 min-w-0">
                    {post.content_url ? (
                      <img
                        src={post.content_url}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
                        {post.content_description || "Untitled post"}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatDate(post.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <span
                      className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium ${
                        post.active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {post.active ? "Published" : "Draft"}
                    </span>
                  </div>

                  {/* Product & Price */}
                  <div className="flex items-center gap-1.5 text-sm text-gray-600 min-w-0">
                    <Tag className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="truncate text-sm">
                        {post.product?.name || "—"}
                      </p>
                      {post.product?.price && (
                        <p className="text-xs text-gray-400">
                          {formatPrice(post.product.price)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Engagement */}
                  <div className="flex flex-col gap-0.5 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {post.engagement?.comments ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5" />
                      {post.engagement?.likes ??
                        post.external_likes_count ??
                        0}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        navigate(`/brand/dashboard/posts/${post.id}`)
                      }
                      className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteTarget({
                          id: post.id,
                          name:
                            post.content_description?.slice(0, 40) ||
                            "this post",
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
            Showing {posts.length} of {totalCount} posts
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => loadPosts(currentPage - 1)}
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
              onClick={() => loadPosts(currentPage + 1)}
              className="cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {deleteTarget && (
        <DeletePostDialog
          postId={deleteTarget.id}
          postName={deleteTarget.name}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
