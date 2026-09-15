"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  ArrowUpDown,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useBanners } from "@/features/banners/queries";
import {
  useCreateBanner,
  useUpdateBanner,
  useDeleteBanner,
} from "@/features/banners/mutations";
import { useCategories } from "@/features/categories/queries";
import type { Banner } from "@/features/banners/types";
import { Modal } from "@/components/common/Modal";
import { EmptyState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/common/Skeleton";
import {
  FormInput,
  FormSelect,
  FormCheckbox,
  FormImagePicker,
} from "@/components/forms/FormController";

export default function AdminBannersPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deletingBanner, setDeletingBanner] = useState<Banner | null>(null);

  // Queries
  const { data: banners = [], isLoading, error } = useBanners(false);
  const { data: categories = [] } = useCategories(true);

  // Mutations
  const createMutation = useCreateBanner();
  const updateMutation = useUpdateBanner();
  const deleteMutation = useDeleteBanner();

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    buttonText: "Shop Collection",
    categoryId: "",
    sortOrder: 0,
    isActive: true,
  });

  const handleOpenCreate = () => {
    setFormData({
      title: "",
      subtitle: "",
      imageUrl: "",
      buttonText: "Shop Collection",
      categoryId: "",
      sortOrder: (banners?.length || 0) + 1,
      isActive: true,
    });
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      imageUrl: banner.imageUrl,
      buttonText: banner.buttonText || "Shop Collection",
      categoryId: banner.categoryId || "",
      sortOrder: banner.sortOrder ?? 0,
      isActive: banner.isActive,
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.imageUrl.trim()) return;

    await createMutation.mutateAsync({
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim() || undefined,
      imageUrl: formData.imageUrl.trim(),
      buttonText: formData.buttonText.trim() || undefined,
      categoryId: formData.categoryId || null,
      sortOrder: Number(formData.sortOrder) || 0,
      isActive: formData.isActive,
    });

    setIsCreateOpen(false);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner || !formData.title.trim() || !formData.imageUrl.trim()) return;

    await updateMutation.mutateAsync({
      id: editingBanner.id,
      input: {
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim() || null,
        imageUrl: formData.imageUrl.trim(),
        buttonText: formData.buttonText.trim() || null,
        categoryId: formData.categoryId || null,
        sortOrder: Number(formData.sortOrder) || 0,
        isActive: formData.isActive,
      },
    });

    setEditingBanner(null);
  };

  const handleToggleStatus = async (banner: Banner) => {
    await updateMutation.mutateAsync({
      id: banner.id,
      input: { isActive: !banner.isActive },
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deletingBanner) return;
    await deleteMutation.mutateAsync(deletingBanner.id);
    setDeletingBanner(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0a0a0a]">Hero Banners</h1>
          <p className="text-sm text-[#8a8070] mt-1">
            Manage promotional sliders and homepage highlight banners.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 bg-[#0a0a0a] hover:bg-[#2a2a2a] text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Banner
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">Failed to load banners. Please verify backend connection.</p>
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e8e4dc] p-12">
          <EmptyState
            icon="bag"
            title="No promotional banners"
            description="Create promotional banners to highlight sales, festival specials, or new collections on the homepage."
            action={
              <button
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-2 bg-[#0a0a0a] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#2a2a2a] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Banner
              </button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-white rounded-2xl border border-[#e8e4dc] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col group"
            >
              {/* Banner Image Preview */}
              <div className="relative h-48 bg-[#f5f0e8] overflow-hidden">
                {banner.imageUrl ? (
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#8a8070]">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <span className="bg-black/70 backdrop-blur-xs text-white font-mono text-xs px-2 py-0.5 rounded-md flex items-center gap-1">
                    <ArrowUpDown className="w-3 h-3" /> {banner.sortOrder}
                  </span>
                </div>
              </div>

              {/* Banner Content Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-[#0a0a0a] text-base leading-tight">
                      {banner.title}
                    </h3>
                    <button
                      onClick={() => handleToggleStatus(banner)}
                      disabled={updateMutation.isPending}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer flex-shrink-0 ${
                        banner.isActive
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          banner.isActive ? "bg-emerald-500" : "bg-gray-400"
                        }`}
                      />
                      {banner.isActive ? "Active" : "Draft"}
                    </button>
                  </div>

                  {banner.subtitle && (
                    <p className="text-xs text-[#8a8070] line-clamp-2 mb-3">
                      {banner.subtitle}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-[#6b6255] bg-[#fcfaf7] border border-[#f0ece1] p-2 rounded-xl mb-4">
                    <span className="font-semibold text-[#0a0a0a]">Button:</span>
                    <span>{banner.buttonText || "Shop Collection"}</span>
                    {banner.categoryId && (
                      <span className="ml-auto text-[11px] text-[#8a8070] bg-[#f0ece1] px-1.5 py-0.5 rounded">
                        Linked Category
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-[#f0ece1]">
                  <span className="text-xs text-[#8a8070]">
                    Created {new Date(banner.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(banner)}
                      className="p-1.5 text-[#8a8070] hover:text-[#0a0a0a] hover:bg-[#f0ece1] rounded-lg transition-colors cursor-pointer"
                      title="Edit Banner"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingBanner(banner)}
                      className="p-1.5 text-[#8a8070] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Banner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isCreateOpen || editingBanner !== null}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingBanner(null);
        }}
        title={editingBanner ? "Edit Banner" : "Create Hero Banner"}
        description={
          editingBanner
            ? `Updating banner: ${editingBanner.title}`
            : "Display a promotional slide or banner on the store homepage."
        }
      >
        <form
          onSubmit={editingBanner ? handleUpdateSubmit : handleCreateSubmit}
          className="space-y-4"
        >
          <FormInput
            label="Banner Title *"
            required
            placeholder="e.g. Royal Festive Silks"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          />

          <FormInput
            label="Subtitle / Caption (Optional)"
            placeholder="e.g. Up to 40% off handcrafted banarasi masterpieces"
            value={formData.subtitle}
            onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
          />

          <FormImagePicker
            label="Banner Image *"
            value={formData.imageUrl}
            onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
            folder="banners"
            aspect="banner"
            placeholder="Upload banner image file from computer"
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="CTA Button Text"
              placeholder="Shop Collection"
              value={formData.buttonText}
              onChange={(e) => setFormData((prev) => ({ ...prev, buttonText: e.target.value }))}
            />

            <FormSelect
              label="Link Category (Optional)"
              value={formData.categoryId}
              onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value }))}
            >
              <option value="">None (General Homepage)</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </FormSelect>
          </div>

          <div className="grid grid-cols-2 gap-4 items-end">
            <FormInput
              label="Sort Order"
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
              label="Active Banner"
              description="Make visible on home slider"
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
                setEditingBanner(null);
              }}
              className="px-4 py-2 rounded-xl text-sm font-medium text-[#8a8070] hover:text-[#0a0a0a] hover:bg-[#f5f0e8] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending || !formData.imageUrl}
              className="inline-flex items-center gap-2 bg-[#677a5d] hover:bg-[#52634a] text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              {editingBanner ? "Save Changes" : "Create Banner"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deletingBanner !== null}
        onClose={() => setDeletingBanner(null)}
        title="Delete Banner"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#6b6255]">
            Are you sure you want to delete banner{" "}
            <span className="font-semibold text-[#0a0a0a]">
              "{deletingBanner?.title}"
            </span>
            ? This banner will be removed from the homepage slider.
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setDeletingBanner(null)}
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
