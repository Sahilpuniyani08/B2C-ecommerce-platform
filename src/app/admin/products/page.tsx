"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  Star,
  Layers,
  Loader2,
  AlertCircle,
  Eye,
} from "lucide-react";
import { useProducts } from "@/features/products/queries";
import { useDeleteProduct, useUpdateProduct } from "@/features/products/mutations";
import { useCategories } from "@/features/categories/queries";
import type { Product } from "@/features/products/types";
import { Modal } from "@/components/common/Modal";
import { EmptyState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/common/Skeleton";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Queries
  const {
    data: productsData,
    isLoading,
    error,
  } = useProducts({
    search: search.trim() || undefined,
    categoryId: selectedCategory || undefined,
    limit: 100,
  });
  const products = productsData?.products ?? [];
  const { data: categories = [] } = useCategories(false);

  // Mutations
  const deleteMutation = useDeleteProduct();
  const updateMutation = useUpdateProduct();

  // Filter products by status
  const filteredProducts = products.filter((product) => {
    if (statusFilter === "active") return product.isActive;
    if (statusFilter === "inactive") return !product.isActive;
    if (statusFilter === "featured") return product.isFeatured;
    return true;
  });

  const handleToggleActive = async (product: Product) => {
    await updateMutation.mutateAsync({
      id: product.id,
      input: { isActive: !product.isActive },
    });
  };

  const handleToggleFeatured = async (product: Product) => {
    await updateMutation.mutateAsync({
      id: product.id,
      input: { isFeatured: !product.isFeatured },
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    await deleteMutation.mutateAsync(deletingProduct.id);
    setDeletingProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0a0a0a]">Products</h1>
          <p className="text-sm text-[#8a8070] mt-1">
            Manage your store catalog, pricing, variants, and product images.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 bg-[#0a0a0a] hover:bg-[#2a2a2a] text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#e8e4dc] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3 w-full">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#8a8070] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#fcfaf7] border border-[#e8e4dc] rounded-xl pl-9 pr-4 py-2 text-sm text-[#0a0a0a] placeholder:text-[#a0988a] focus:outline-none focus:border-[#0a0a0a]"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-48 bg-[#fcfaf7] border border-[#e8e4dc] rounded-xl px-3 py-2 text-sm text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a]"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-40 bg-[#fcfaf7] border border-[#e8e4dc] rounded-xl px-3 py-2 text-sm text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a]"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Draft / Inactive</option>
            <option value="featured">Featured Only</option>
          </select>
        </div>

        <div className="text-xs text-[#8a8070] font-medium whitespace-nowrap">
          Showing <span className="text-[#0a0a0a] font-semibold">{filteredProducts.length}</span>{" "}
          items
        </div>
      </div>

      {/* Content Table */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-[#e8e4dc] p-6 space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">Failed to load products. Please check backend connection.</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e8e4dc] p-12">
          <EmptyState
            icon="package"
            title={search ? "No products match criteria" : "No products found"}
            description={
              search || selectedCategory
                ? "Try adjusting filters or clear your search term."
                : "Your store has no products yet. Create your first product to begin selling."
            }
            action={
              !search && !selectedCategory ? (
                <Link
                  href="/admin/products/new"
                  className="inline-flex items-center gap-2 bg-[#0a0a0a] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#2a2a2a] transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("");
                    setStatusFilter("all");
                  }}
                  className="text-xs text-[#8a8070] underline hover:text-[#0a0a0a]"
                >
                  Reset all filters
                </button>
              )
            }
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#e8e4dc] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#fcfaf7] border-b border-[#e8e4dc] text-xs font-semibold text-[#8a8070] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Product</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Pricing</th>
                  <th className="px-6 py-3.5">Variants / Stock</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ece1]">
                {filteredProducts.map((product) => {
                  const primaryImage =
                    product.images?.find((img) => img.isPrimary)?.imageUrl ||
                    product.images?.[0]?.imageUrl;
                  const totalStock =
                    product.variants?.reduce((sum, v) => sum + v.stock, 0) ?? 0;
                  const hasVariants = Boolean(product.variants && product.variants.length > 0);

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-[#fbf9f5] transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-14 rounded-lg bg-[#f0ece1] overflow-hidden relative flex-shrink-0">
                            {primaryImage ? (
                              <Image
                                src={primaryImage}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#8a8070]">
                                <Package className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <Link
                              href={`/admin/products/${product.id}`}
                              className="font-semibold text-[#0a0a0a] hover:underline flex items-center gap-1.5"
                            >
                              {product.name}
                              {product.isFeatured && (
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                              )}
                            </Link>
                            <span className="font-mono text-xs text-[#8a8070]">
                              /{product.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center text-xs font-medium bg-[#f5f0e8] text-[#6b6255] px-2.5 py-1 rounded-md">
                          {product.category?.name || "Unassigned"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          {product.salePrice ? (
                            <>
                              <span className="font-bold text-[#0a0a0a]">
                                ₹{product.salePrice}
                              </span>
                              <span className="text-xs text-[#8a8070] line-through">
                                ₹{product.price}
                              </span>
                            </>
                          ) : (
                            <span className="font-bold text-[#0a0a0a]">
                              ₹{product.price}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-semibold text-[#0a0a0a] flex items-center gap-1">
                            <Layers className="w-3 h-3 text-[#8a8070]" />
                            {hasVariants
                              ? `${product.variants?.length} Variant${
                                  (product.variants?.length || 0) > 1 ? "s" : ""
                                }`
                              : "Single (No variants)"}
                          </span>
                          <span
                            className={`text-[11px] font-medium ${
                              totalStock > 0 ? "text-emerald-700" : "text-amber-700"
                            }`}
                          >
                            {totalStock > 0
                              ? `${totalStock} in stock`
                              : "Out of stock"}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleActive(product)}
                            disabled={updateMutation.isPending}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                              product.isActive
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                            title="Toggle active"
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                product.isActive ? "bg-emerald-500" : "bg-gray-400"
                              }`}
                            />
                            {product.isActive ? "Active" : "Draft"}
                          </button>

                          <button
                            onClick={() => handleToggleFeatured(product)}
                            disabled={updateMutation.isPending}
                            className={`p-1 rounded-lg transition-colors cursor-pointer ${
                              product.isFeatured
                                ? "text-amber-500 hover:bg-amber-50"
                                : "text-gray-300 hover:text-gray-500 hover:bg-gray-100"
                            }`}
                            title={
                              product.isFeatured
                                ? "Featured on Home"
                                : "Mark as Featured"
                            }
                          >
                            <Star
                              className={`w-4 h-4 ${
                                product.isFeatured ? "fill-amber-400" : ""
                              }`}
                            />
                          </button>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Link
                            href={`/product/${product.slug}`}
                            target="_blank"
                            className="p-1.5 text-[#8a8070] hover:text-[#0a0a0a] hover:bg-[#f0ece1] rounded-lg transition-colors"
                            title="View on Storefront"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="p-1.5 text-[#8a8070] hover:text-[#0a0a0a] hover:bg-[#f0ece1] rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setDeletingProduct(product)}
                            className="p-1.5 text-[#8a8070] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deletingProduct !== null}
        onClose={() => setDeletingProduct(null)}
        title="Delete Product"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#6b6255]">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-[#0a0a0a]">
              "{deletingProduct?.name}"
            </span>
            ? This will remove all associated variants and product images permanently.
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setDeletingProduct(null)}
              className="px-4 py-2 rounded-xl text-sm font-medium text-[#8a8070] hover:bg-[#f5f0e8] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={deleteMutation.isPending}
              onClick={handleDeleteConfirm}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
            >
              {deleteMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Delete Product
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
