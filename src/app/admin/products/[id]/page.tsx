"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  Package,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Layers,
  Save,
  Loader2,
  AlertCircle,
  ExternalLink,
  Star,
  Check,
} from "lucide-react";
import {
  useProductById,
  useProductImages,
  useProductVariants,
} from "@/features/products/queries";
import {
  useCreateProduct,
  useUpdateProduct,
  useAddProductImage,
  useAddProductVariant,
  useUpdateProductVariant,
  useDeleteProductVariant,
} from "@/features/products/mutations";
import { useCategories } from "@/features/categories/queries";
import type {
  ProductVariant,
  ProductImage,
  CreateVariantInput,
  UpdateVariantInput,
} from "@/features/products/types";
import { Modal } from "@/components/common/Modal";
import { Skeleton } from "@/components/common/Skeleton";
import { formatCurrency } from "@/lib/utils";
import {
  FormInput,
  FormSelect,
  FormTextarea,
  FormCheckbox,
  FormImagePicker,
} from "@/components/forms/FormController";

interface Props {
  params: Promise<{ id: string }>;
}

export default function AdminProductDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === "new";

  // Queries
  const { data: product, isLoading: isProductLoading, error: productError } = useProductById(
    isNew ? "" : id
  );
  const { data: fetchedImages = [] } = useProductImages(isNew ? "" : id);
  const { data: fetchedVariants = [] } = useProductVariants(isNew ? "" : id);
  const { data: categories = [] } = useCategories(false);

  // Mutations
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const addImageMutation = useAddProductImage(id);
  const addVariantMutation = useAddProductVariant(id);
  const updateVariantMutation = useUpdateProductVariant(id);
  const deleteVariantMutation = useDeleteProductVariant(id);

  // Main Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    categoryId: "",
    price: 0,
    salePrice: "",
    description: "",
    isFeatured: false,
    isActive: true,
  });

  // Populate form on product load
  useEffect(() => {
    if (product && !isNew) {
      setFormData({
        name: product.name,
        slug: product.slug,
        categoryId: product.categoryId || "",
        price: product.price,
        salePrice: product.salePrice ? String(product.salePrice) : "",
        description: product.description || "",
        isFeatured: product.isFeatured,
        isActive: product.isActive,
      });
    }
  }, [product, isNew]);

  // Handle Slug Auto-generation
  const handleNameChange = (name: string) => {
    const generatedSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    setFormData((prev) => ({
      ...prev,
      name,
      slug: isNew || prev.slug === "" ? generatedSlug : prev.slug,
    }));
  };

  // Main Product Save
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim() || !formData.categoryId) return;

    if (isNew) {
      const created = await createProductMutation.mutateAsync({
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        categoryId: formData.categoryId,
        price: Number(formData.price) || 0,
        salePrice: formData.salePrice ? Number(formData.salePrice) : null,
        description: formData.description.trim() || undefined,
        isFeatured: formData.isFeatured,
        isActive: formData.isActive,
      });
      router.push(`/admin/products/${created.id}`);
    } else {
      await updateProductMutation.mutateAsync({
        id,
        input: {
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          categoryId: formData.categoryId,
          price: Number(formData.price) || 0,
          salePrice: formData.salePrice ? Number(formData.salePrice) : null,
          description: formData.description.trim() || null,
          isFeatured: formData.isFeatured,
          isActive: formData.isActive,
        },
      });
    }
  };

  // ─── Image Management State ──────────────────────────────────────────
  const [isAddImageOpen, setIsAddImageOpen] = useState(false);
  const [imageInput, setImageInput] = useState({
    imageUrl: "",
    sortOrder: 0,
    isPrimary: false,
    storagePath: "",
  });

  const handleAddImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageInput.imageUrl.trim()) return;

    await addImageMutation.mutateAsync({
      imageUrl: imageInput.imageUrl.trim(),
      sortOrder: Number(imageInput.sortOrder) || 0,
      isPrimary: imageInput.isPrimary,
      storagePath: imageInput.storagePath.trim() || imageInput.imageUrl.trim(),
    });

    setImageInput({ imageUrl: "", sortOrder: 0, isPrimary: false, storagePath: "" });
    setIsAddImageOpen(false);
  };

  // ─── Variant Management State ────────────────────────────────────────
  const [isAddVariantOpen, setIsAddVariantOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [deletingVariant, setDeletingVariant] = useState<ProductVariant | null>(null);

  const [variantInput, setVariantInput] = useState<CreateVariantInput>({
    sku: "",
    size: "M",
    color: "",
    price: null,
    salePrice: null,
    stock: 10,
    isActive: true,
  });

  const handleOpenAddVariant = () => {
    const autoSku = `${formData.slug || "prod"}-${Date.now().toString().slice(-4)}`;
    setVariantInput({
      sku: autoSku.toUpperCase(),
      size: "M",
      color: "",
      price: null,
      salePrice: null,
      stock: 10,
      isActive: true,
    });
    setIsAddVariantOpen(true);
  };

  const handleOpenEditVariant = (variant: ProductVariant) => {
    setEditingVariant(variant);
    setVariantInput({
      sku: variant.sku,
      size: variant.size || "",
      color: variant.color || "",
      price: variant.price || null,
      salePrice: variant.salePrice || null,
      stock: variant.stock,
      isActive: variant.isActive,
    });
  };

  const handleVariantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!variantInput.sku.trim()) return;

    if (editingVariant) {
      await updateVariantMutation.mutateAsync({
        variantId: editingVariant.id,
        input: {
          sku: variantInput.sku.trim(),
          size: variantInput.size?.trim() || null,
          color: variantInput.color?.trim() || null,
          price: variantInput.price ? Number(variantInput.price) : null,
          salePrice: variantInput.salePrice ? Number(variantInput.salePrice) : null,
          stock: Number(variantInput.stock) || 0,
          isActive: variantInput.isActive,
        },
      });
      setEditingVariant(null);
    } else {
      await addVariantMutation.mutateAsync({
        sku: variantInput.sku.trim(),
        size: variantInput.size?.trim() || undefined,
        color: variantInput.color?.trim() || undefined,
        price: variantInput.price ? Number(variantInput.price) : undefined,
        salePrice: variantInput.salePrice ? Number(variantInput.salePrice) : undefined,
        stock: Number(variantInput.stock) || 0,
        isActive: variantInput.isActive,
      });
      setIsAddVariantOpen(false);
    }
  };

  const handleDeleteVariantConfirm = async () => {
    if (!deletingVariant) return;
    await deleteVariantMutation.mutateAsync(deletingVariant.id);
    setDeletingVariant(null);
  };

  const images = fetchedImages.length > 0 ? fetchedImages : product?.images || [];
  const variants = fetchedVariants.length > 0 ? fetchedVariants : product?.variants || [];

  if (!isNew && isProductLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 lg:col-span-2 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!isNew && productError) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs text-[#8a8070] hover:text-[#0a0a0a]"
        >
          <ChevronLeft className="w-4 h-4" /> Back to products
        </Link>
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">Product not found or failed to load.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 bg-white rounded-xl border border-[#e8e4dc] text-[#8a8070] hover:text-[#0a0a0a] hover:bg-[#f5f0e8] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0a0a0a]">
              {isNew ? "Create New Product" : `Edit: ${product?.name}`}
            </h1>
            <p className="text-xs text-[#8a8070] mt-0.5 font-mono">
              {isNew ? "Fill in product specifications below" : `ID: ${id}`}
            </p>
          </div>
        </div>

        {!isNew && product?.slug && (
          <div className="flex items-center gap-3">
            <Link
              href={`/product/${product.slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#e8e4dc] bg-white text-xs font-semibold text-[#0a0a0a] hover:bg-[#f5f0e8] transition-colors shadow-xs"
            >
              <ExternalLink className="w-4 h-4 text-[#8a8070]" />
              View on Storefront
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Product Details Form */}
        <div className="lg:col-span-2 space-y-6">
          <form
            onSubmit={handleProductSubmit}
            className="bg-white rounded-2xl border border-[#e8e4dc] p-6 space-y-5 shadow-xs"
          >
            <div className="flex items-center justify-between border-b border-[#f0ece1] pb-4">
              <h2 className="font-bold text-base text-[#0a0a0a]">Product Details</h2>
              <button
                type="submit"
                disabled={
                  createProductMutation.isPending || updateProductMutation.isPending
                }
                className="inline-flex items-center gap-2 bg-[#0a0a0a] hover:bg-[#2a2a2a] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                {(createProductMutation.isPending ||
                  updateProductMutation.isPending) && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                <Save className="w-4 h-4" />
                {isNew ? "Create & Continue" : "Save Changes"}
              </button>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-[#0a0a0a] uppercase tracking-wider mb-1.5">
                Product Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Royal Maroon Velvet Anarkali"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full bg-[#fcfaf7] border border-[#e8e4dc] rounded-xl px-3.5 py-2.5 text-sm text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a]"
              />
            </div>

            {/* Slug & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0a0a0a] uppercase tracking-wider mb-1.5">
                  URL Slug *
                </label>
                <div className="flex items-center">
                  <span className="bg-[#f0ece1] text-[#8a8070] px-3 py-2.5 rounded-l-xl text-xs font-mono border border-r-0 border-[#e8e4dc]">
                    /product/
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    className="flex-1 bg-[#fcfaf7] border border-[#e8e4dc] rounded-r-xl px-3.5 py-2.5 text-sm font-mono text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0a0a0a] uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, categoryId: e.target.value }))
                  }
                  className="w-full bg-[#fcfaf7] border border-[#e8e4dc] rounded-xl px-3.5 py-2.5 text-sm text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a]"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0a0a0a] uppercase tracking-wider mb-1.5">
                  Regular Price (₹) *
                </label>
                <input
                  type="number"
                  min={0}
                  step="any"
                  required
                  placeholder="2499"
                  value={formData.price || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      price: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full bg-[#fcfaf7] border border-[#e8e4dc] rounded-xl px-3.5 py-2.5 text-sm text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0a0a0a] uppercase tracking-wider mb-1.5">
                  Sale Price (₹) (Optional)
                </label>
                <input
                  type="number"
                  min={0}
                  step="any"
                  placeholder="1999"
                  value={formData.salePrice}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, salePrice: e.target.value }))
                  }
                  className="w-full bg-[#fcfaf7] border border-[#e8e4dc] rounded-xl px-3.5 py-2.5 text-sm text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a]"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-[#0a0a0a] uppercase tracking-wider mb-1.5">
                Product Description
              </label>
              <textarea
                rows={5}
                placeholder="Detail the fabric composition, craftsmanship, fit, and care instructions..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                className="w-full bg-[#fcfaf7] border border-[#e8e4dc] rounded-xl px-3.5 py-2.5 text-sm text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a] leading-relaxed"
              />
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                  }
                  className="w-4 h-4 rounded text-black border-[#e8e4dc] focus:ring-black"
                />
                <span className="text-sm text-[#0a0a0a] font-medium">
                  Active in Store
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isFeatured: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 rounded text-black border-[#e8e4dc] focus:ring-black"
                />
                <span className="text-sm text-[#0a0a0a] font-medium flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  Featured Collection
                </span>
              </label>
            </div>
          </form>

          {/* Product Variants Section (Visible once created) */}
          {!isNew && (
            <div className="bg-white rounded-2xl border border-[#e8e4dc] p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#f0ece1] pb-4">
                <div>
                  <h2 className="font-bold text-base text-[#0a0a0a] flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#8a8070]" />
                    Product Variants & Inventory
                  </h2>
                  <p className="text-xs text-[#8a8070] mt-0.5">
                    Configure sizes, colors, individual SKUs, and stock counts.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddVariant}
                  className="inline-flex items-center gap-1.5 bg-[#f5f0e8] hover:bg-[#e8e4dc] text-[#0a0a0a] px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Variant
                </button>
              </div>

              {variants.length === 0 ? (
                <div className="text-center py-8 bg-[#fcfaf7] rounded-xl border border-dashed border-[#e8e4dc]">
                  <p className="text-sm text-[#8a8070] mb-2">
                    No variants configured for this product.
                  </p>
                  <button
                    onClick={handleOpenAddVariant}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#0a0a0a] underline"
                  >
                    Add Size/Color Variant
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs font-semibold text-[#8a8070] uppercase tracking-wider border-b border-[#f0ece1]">
                      <tr>
                        <th className="pb-2">SKU</th>
                        <th className="pb-2">Size</th>
                        <th className="pb-2">Color</th>
                        <th className="pb-2">Stock</th>
                        <th className="pb-2">Price Override</th>
                        <th className="pb-2">Status</th>
                        <th className="pb-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f5f0e8]">
                      {variants.map((v) => (
                        <tr key={v.id} className="hover:bg-[#fcfaf7]">
                          <td className="py-3 font-mono text-xs text-[#0a0a0a] font-medium">
                            {v.sku}
                          </td>
                          <td className="py-3 font-medium text-xs text-[#0a0a0a]">
                            {v.size || "—"}
                          </td>
                          <td className="py-3 text-xs text-[#6b6255]">
                            {v.color || "—"}
                          </td>
                          <td className="py-3">
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                                v.stock > 5
                                  ? "bg-emerald-50 text-emerald-700"
                                  : v.stock > 0
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-red-50 text-red-700"
                              }`}
                            >
                              {v.stock} pcs
                            </span>
                          </td>
                          <td className="py-3 text-xs text-[#0a0a0a]">
                            {v.salePrice ? (
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-emerald-700">{formatCurrency(v.salePrice)}</span>
                                <span className="text-[11px] text-[#8a8070] line-through">{v.price ? formatCurrency(v.price) : "Def"}</span>
                              </div>
                            ) : v.price ? (
                              formatCurrency(v.price)
                            ) : (
                              "Default"
                            )}
                          </td>
                          <td className="py-3">
                            <span
                              className={`inline-block w-2 h-2 rounded-full ${
                                v.isActive ? "bg-emerald-500" : "bg-gray-300"
                              }`}
                              title={v.isActive ? "Active" : "Inactive"}
                            />
                          </td>
                          <td className="py-3 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => handleOpenEditVariant(v)}
                                className="p-1 text-[#8a8070] hover:text-[#0a0a0a] hover:bg-[#f0ece1] rounded-md transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeletingVariant(v)}
                                className="p-1 text-[#8a8070] hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right 1 Col: Product Media Gallery */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#e8e4dc] p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#f0ece1] pb-3">
              <h2 className="font-bold text-base text-[#0a0a0a] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#8a8070]" />
                Product Images
              </h2>
              {!isNew && (
                <button
                  type="button"
                  onClick={() => setIsAddImageOpen(true)}
                  className="inline-flex items-center gap-1 bg-[#f5f0e8] hover:bg-[#e8e4dc] text-[#0a0a0a] px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              )}
            </div>

            {isNew ? (
              <div className="text-center py-8 bg-[#fcfaf7] rounded-xl border border-dashed border-[#e8e4dc] text-xs text-[#8a8070]">
                Save product details first to start uploading imagery.
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-8 bg-[#fcfaf7] rounded-xl border border-dashed border-[#e8e4dc]">
                <p className="text-xs text-[#8a8070] mb-2">
                  No images added yet.
                </p>
                <button
                  onClick={() => setIsAddImageOpen(true)}
                  className="text-xs font-semibold text-[#0a0a0a] underline"
                >
                  Add Primary Image
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-3/4 rounded-xl bg-[#f5f0e8] overflow-hidden border border-[#e8e4dc] group"
                  >
                    <Image
                      src={img.imageUrl}
                      alt={product?.name || "Product image"}
                      fill
                      className="object-cover"
                    />
                    {img.isPrimary && (
                      <span className="absolute top-2 left-2 bg-[#0a0a0a]/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                        Primary
                      </span>
                    )}
                    <span className="absolute bottom-2 right-2 bg-white/80 text-[#0a0a0a] text-[10px] font-mono px-1.5 py-0.5 rounded">
                      #{img.sortOrder}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Image Modal */}
      <Modal
        isOpen={isAddImageOpen}
        onClose={() => setIsAddImageOpen(false)}
        title="Add Product Image"
        maxWidth="md"
      >
        <form onSubmit={handleAddImageSubmit} className="space-y-4">
          <FormImagePicker
            label="Product Image *"
            value={imageInput.imageUrl}
            onChange={(url) =>
              setImageInput((prev) => ({
                ...prev,
                imageUrl: url,
                storagePath: url,
              }))
            }
            folder="products"
            aspect="portrait"
            placeholder="Upload product image file from computer"
          />

          <div className="grid grid-cols-2 gap-4 items-end">
            <FormInput
              label="Display Order"
              type="number"
              min={0}
              value={imageInput.sortOrder}
              onChange={(e) =>
                setImageInput((prev) => ({
                  ...prev,
                  sortOrder: parseInt(e.target.value) || 0,
                }))
              }
            />

            <FormCheckbox
              label="Primary Image"
              description="Main product thumbnail"
              checked={imageInput.isPrimary}
              onChange={(e) =>
                setImageInput((prev) => ({
                  ...prev,
                  isPrimary: e.target.checked,
                }))
              }
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f0ece1]">
            <button
              type="button"
              onClick={() => setIsAddImageOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#7d796f] hover:bg-[#f5f0e8] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addImageMutation.isPending || !imageInput.imageUrl}
              className="inline-flex items-center gap-2 bg-[#677a5d] hover:bg-[#52634a] text-white px-4 py-2 rounded-xl text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {addImageMutation.isPending && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              Add Image
            </button>
          </div>
        </form>
      </Modal>

      {/* Add / Edit Variant Modal */}
      <Modal
        isOpen={isAddVariantOpen || editingVariant !== null}
        onClose={() => {
          setIsAddVariantOpen(false);
          setEditingVariant(null);
        }}
        title={editingVariant ? "Edit Variant" : "Add Product Variant"}
        maxWidth="md"
      >
        <form onSubmit={handleVariantSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#0a0a0a] uppercase tracking-wider mb-1">
              SKU Identifier *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. SLK-MRN-01"
              value={variantInput.sku}
              onChange={(e) =>
                setVariantInput((prev) => ({ ...prev, sku: e.target.value }))
              }
              className="w-full bg-[#fcfaf7] border border-[#e8e4dc] rounded-xl px-3.5 py-2 font-mono text-sm text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#0a0a0a] uppercase tracking-wider mb-1">
                Size (e.g. XS, S, M, L, XL, Free Size)
              </label>
              <input
                type="text"
                placeholder="M"
                value={variantInput.size || ""}
                onChange={(e) =>
                  setVariantInput((prev) => ({ ...prev, size: e.target.value }))
                }
                className="w-full bg-[#fcfaf7] border border-[#e8e4dc] rounded-xl px-3.5 py-2 text-sm text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#0a0a0a] uppercase tracking-wider mb-1">
                Color (e.g. Royal Maroon)
              </label>
              <input
                type="text"
                placeholder="Maroon"
                value={variantInput.color || ""}
                onChange={(e) =>
                  setVariantInput((prev) => ({ ...prev, color: e.target.value }))
                }
                className="w-full bg-[#fcfaf7] border border-[#e8e4dc] rounded-xl px-3.5 py-2 text-sm text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#0a0a0a] uppercase tracking-wider mb-1">
                Stock Count *
              </label>
              <input
                type="number"
                min={0}
                required
                value={variantInput.stock}
                onChange={(e) =>
                  setVariantInput((prev) => ({
                    ...prev,
                    stock: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full bg-[#fcfaf7] border border-[#e8e4dc] rounded-xl px-3.5 py-2 text-sm text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#0a0a0a] uppercase tracking-wider mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                min={0}
                step="any"
                placeholder="Default"
                value={variantInput.price || ""}
                onChange={(e) =>
                  setVariantInput((prev) => ({
                    ...prev,
                    price: e.target.value ? parseFloat(e.target.value) : null,
                  }))
                }
                className="w-full bg-[#fcfaf7] border border-[#e8e4dc] rounded-xl px-3.5 py-2 text-sm text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#0a0a0a] uppercase tracking-wider mb-1">
                Sale Price (₹)
              </label>
              <input
                type="number"
                min={0}
                step="any"
                placeholder="Sale (Opt)"
                value={variantInput.salePrice || ""}
                onChange={(e) =>
                  setVariantInput((prev) => ({
                    ...prev,
                    salePrice: e.target.value ? parseFloat(e.target.value) : null,
                  }))
                }
                className="w-full bg-[#fcfaf7] border border-[#e8e4dc] rounded-xl px-3.5 py-2 text-sm text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a]"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer mt-1">
              <input
                type="checkbox"
                checked={variantInput.isActive}
                onChange={(e) =>
                  setVariantInput((prev) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
                className="w-4 h-4 rounded text-black border-[#e8e4dc] focus:ring-black"
              />
              <span className="text-xs text-[#0a0a0a] font-medium">
                Variant is Available for Purchase
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f0ece1]">
            <button
              type="button"
              onClick={() => {
                setIsAddVariantOpen(false);
                setEditingVariant(null);
              }}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#8a8070] hover:bg-[#f5f0e8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                addVariantMutation.isPending || updateVariantMutation.isPending
              }
              className="inline-flex items-center gap-2 bg-[#0a0a0a] text-white px-4 py-2 rounded-xl text-xs font-medium hover:bg-[#2a2a2a] disabled:opacity-50"
            >
              {(addVariantMutation.isPending ||
                updateVariantMutation.isPending) && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              {editingVariant ? "Save Variant" : "Add Variant"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Variant Confirmation Modal */}
      <Modal
        isOpen={deletingVariant !== null}
        onClose={() => setDeletingVariant(null)}
        title="Delete Variant"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#6b6255]">
            Are you sure you want to delete SKU{" "}
            <span className="font-semibold text-[#0a0a0a]">
              "{deletingVariant?.sku}"
            </span>
            ? This action cannot be undone.
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setDeletingVariant(null)}
              className="px-4 py-2 rounded-xl text-sm font-medium text-[#8a8070] hover:bg-[#f5f0e8] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={deleteVariantMutation.isPending}
              onClick={handleDeleteVariantConfirm}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
            >
              {deleteVariantMutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              Delete Variant
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
