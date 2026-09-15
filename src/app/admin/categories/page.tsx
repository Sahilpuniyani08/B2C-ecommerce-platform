"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Tag,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Layers,
  ArrowUpDown,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useCategories } from "@/features/categories/queries";
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/features/categories/mutations";
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/features/categories/types";
import { Modal } from "@/components/common/Modal";
import { EmptyState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/common/Skeleton";
import {
  FormInput,
  FormTextarea,
  FormCheckbox,
  FormImagePicker,
} from "@/components/forms/FormController";

export default function AdminCategoriesPage() {
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // Queries & Mutations
  const { data: categories = [], isLoading, error } = useCategories(false);
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
    sortOrder: 0,
    isActive: true,
  });

  const handleOpenCreate = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      imageUrl: "",
      sortOrder: (categories?.length || 0) + 1,
      isActive: true,
    });
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      imageUrl: category.imageUrl || "",
      sortOrder: category.sortOrder ?? 0,
      isActive: category.isActive,
    });
  };

  const handleNameChange = (name: string) => {
    // Generate clean slug if creating or if slug is empty
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug === "" || !editingCategory ? slug : prev.slug,
    }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) return;

    await createMutation.mutateAsync({
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      description: formData.description.trim() || undefined,
      imageUrl: formData.imageUrl.trim() || undefined,
      sortOrder: Number(formData.sortOrder) || 0,
      isActive: formData.isActive,
    });

    setIsCreateOpen(false);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !formData.name.trim() || !formData.slug.trim()) return;

    await updateMutation.mutateAsync({
      id: editingCategory.id,
      input: {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim() || null,
        imageUrl: formData.imageUrl.trim() || null,
        sortOrder: Number(formData.sortOrder) || 0,
        isActive: formData.isActive,
      },
    });

    setEditingCategory(null);
  };

  const handleToggleStatus = async (category: Category) => {
    await updateMutation.mutateAsync({
      id: category.id,
      input: { isActive: !category.isActive },
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;
    await deleteMutation.mutateAsync(deletingCategory.id);
    setDeletingCategory(null);
  };

  // Filter categories
  const filteredCategories = categories.filter((cat) => {
    const q = search.toLowerCase();
    return (
      cat.name.toLowerCase().includes(q) ||
      cat.slug.toLowerCase().includes(q) ||
      (cat.description && cat.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0a0a0a]">Categories</h1>
          <p className="text-sm text-[#8a8070] mt-1">
            Organize products into curated collections and storefront catalogs.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 bg-[#0a0a0a] hover:bg-[#2a2a2a] text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#e8e4dc] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8a8070] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#fcfaf7] border border-[#e8e4dc] rounded-xl pl-9 pr-4 py-2 text-sm text-[#0a0a0a] placeholder:text-[#a0988a] focus:outline-none focus:border-[#0a0a0a]"
          />
        </div>

        <div className="text-xs text-[#8a8070] font-medium self-end sm:self-auto">
          Total Categories: <span className="text-[#0a0a0a] font-semibold">{categories.length}</span>
        </div>
      </div>

      {/* Content Table / State */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-[#e8e4dc] p-6 space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">Failed to load categories. Please verify backend connection.</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e8e4dc] p-12">
          <EmptyState
            icon="package"
            title={search ? "No matching categories" : "No categories found"}
            description={
              search
                ? `No categories matched "${search}". Try clearing the search query.`
                : "Get started by creating your first product category for the store."
            }
            action={
              !search ? (
                <button
                  onClick={handleOpenCreate}
                  className="inline-flex items-center gap-2 bg-[#0a0a0a] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#2a2a2a] transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Category
                </button>
              ) : (
                <button
                  onClick={() => setSearch("")}
                  className="text-xs text-[#8a8070] underline hover:text-[#0a0a0a]"
                >
                  Clear search
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
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Slug</th>
                  <th className="px-6 py-3.5">Sort Order</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ece1]">
                {filteredCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="hover:bg-[#fbf9f5] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#f0ece1] relative flex-shrink-0 flex items-center justify-center">
                          {category.imageUrl ? (
                            <Image
                              src={category.imageUrl}
                              alt={category.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Tag className="w-4 h-4 text-[#8a8070]" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-[#0a0a0a] group-hover:text-black">
                            {category.name}
                          </div>
                          {category.description && (
                            <div className="text-xs text-[#8a8070] line-clamp-1 max-w-xs">
                              {category.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-[#6b6255]">
                      /{category.slug}
                    </td>
                    <td className="px-6 py-4 text-[#0a0a0a]">
                      <span className="inline-flex items-center gap-1 font-mono text-xs bg-[#f5f0e8] px-2 py-0.5 rounded-md">
                        <ArrowUpDown className="w-3 h-3 text-[#8a8070]" />
                        {category.sortOrder}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(category)}
                        disabled={updateMutation.isPending}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          category.isActive
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                        title="Click to toggle active status"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            category.isActive ? "bg-emerald-500" : "bg-gray-400"
                          }`}
                        />
                        {category.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(category)}
                          className="p-1.5 text-[#8a8070] hover:text-[#0a0a0a] hover:bg-[#f0ece1] rounded-lg transition-colors cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingCategory(category)}
                          className="p-1.5 text-[#8a8070] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isCreateOpen || editingCategory !== null}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingCategory(null);
        }}
        title={editingCategory ? "Edit Category" : "Create New Category"}
        description={
          editingCategory
            ? `Updating category: ${editingCategory.name}`
            : "Add a new product category to organize your catalog."
        }
      >
        <form
          onSubmit={editingCategory ? handleUpdateSubmit : handleCreateSubmit}
          className="space-y-4"
        >
          <FormInput
            label="Category Name *"
            required
            placeholder="e.g. Sarees, Dresses, Kurtis"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold text-[#1c2119] uppercase tracking-wider mb-1.5">
              URL Slug *
            </label>
            <div className="flex items-center">
              <span className="bg-[#f0ece1] text-[#7d796f] px-3.5 py-2.5 rounded-l-xl text-xs font-mono border border-r-0 border-[#e5e0d5]">
                /category/
              </span>
              <input
                type="text"
                required
                placeholder="sarees"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                className="flex-1 bg-[#f9f7f1] border border-[#e5e0d5] rounded-r-xl px-3.5 py-2.5 text-sm font-mono text-[#1c2119] placeholder:text-[#99958b] focus:outline-none focus:border-[#677a5d]"
              />
            </div>
          </div>

          <FormTextarea
            label="Description (Optional)"
            rows={3}
            placeholder="Short description for SEO and category banner..."
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
          />

          <FormImagePicker
            label="Category Image (Optional)"
            value={formData.imageUrl}
            onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
            folder="categories"
            aspect="square"
            placeholder="Upload category image file from computer"
          />

          <div className="grid grid-cols-2 gap-4 items-end">
            <FormInput
              label="Display Order"
              type="number"
              min={0}
              value={formData.sortOrder}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  sortOrder: parseInt(e.target.value) || 0,
                }))
              }
            />

            <FormCheckbox
              label="Active in Store"
              description="Visible in catalog"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
              }
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0ece1]">
            <button
              type="button"
              onClick={() => {
                setIsCreateOpen(false);
                setEditingCategory(null);
              }}
              className="px-4 py-2 rounded-xl text-sm font-medium text-[#7d796f] hover:text-[#1c2119] hover:bg-[#f5f0e8] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="inline-flex items-center gap-2 bg-[#677a5d] hover:bg-[#52634a] text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              {editingCategory ? "Save Changes" : "Create Category"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deletingCategory !== null}
        onClose={() => setDeletingCategory(null)}
        title="Delete Category"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#6b6255]">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-[#0a0a0a]">
              "{deletingCategory?.name}"
            </span>
            ? This action cannot be undone and may affect products linked to this category.
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setDeletingCategory(null)}
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
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
