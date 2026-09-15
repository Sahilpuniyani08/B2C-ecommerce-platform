"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ShoppingBag, Plus, Minus, Star, Truck, ShieldCheck } from "lucide-react";
import { Skeleton } from "@/components/common/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { useProductBySlug } from "@/features/products/queries";
import { useCart } from "@/context/cart-context";
import { SITE_CONFIG } from "@/config/site";
import { toast } from "sonner";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: Props) {
  const { slug } = use(params);
  const { data: product, isLoading, isError } = useProductBySlug(slug);
  const { addItem } = useCart();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Set default selected variant when product loads
  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      const activeVars = product.variants.filter((v) => v.isActive);
      const defaultVariant = activeVars.find((v) => v.stock > 0) || activeVars[0];
      if (defaultVariant) {
        if (defaultVariant.size) setSelectedSize(defaultVariant.size);
        if (defaultVariant.color) setSelectedColor(defaultVariant.color);
      }
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <Skeleton className="w-full aspect-square rounded-2xl" />
              <div className="flex gap-2 mt-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-20 h-20 rounded-xl" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <EmptyState
          icon="error"
          title="Product not found"
          description="This product may have been removed or the link is incorrect."
          action={
            <Link
              href="/shop"
              className="px-6 py-2.5 rounded-full bg-olive text-white border text-sm font-medium"
            >
              Back to Shop
            </Link>
          }
        />
      </div>
    );
  }

  const images = product.images ?? [];
  const sortedImages = [...images].sort((a, b) =>
    a.isPrimary ? -1 : b.isPrimary ? 1 : a.sortOrder - b.sortOrder
  );
  const activeImage = sortedImages[activeImageIndex];

  const variants = product.variants ?? [];
  const activeVariants = variants.filter((v) => v.isActive);
  const sizes = [...new Set(activeVariants.map((v) => v.size).filter((s): s is string => Boolean(s)))];
  const colors = [...new Set(activeVariants.map((v) => v.color).filter((c): c is string => Boolean(c)))];

  const handleSizeSelect = (size: string) => {
    const newSize = selectedSize === size ? null : size;
    setSelectedSize(newSize);
    if (newSize) {
      const validColors = activeVariants
        .filter((v) => v.size === newSize)
        .map((v) => v.color)
        .filter((c): c is string => Boolean(c));

      if (selectedColor && !validColors.includes(selectedColor)) {
        setSelectedColor(validColors[0] ?? null);
      } else if (!selectedColor && validColors.length > 0) {
        setSelectedColor(validColors[0]);
      }
    }
  };

  const handleColorSelect = (color: string) => {
    const newColor = selectedColor === color ? null : color;
    setSelectedColor(newColor);
    if (newColor) {
      const validSizes = activeVariants
        .filter((v) => v.color === newColor)
        .map((v) => v.size)
        .filter((s): s is string => Boolean(s));

      if (selectedSize && !validSizes.includes(selectedSize)) {
        setSelectedSize(validSizes[0] ?? null);
      } else if (!selectedSize && validSizes.length > 0) {
        setSelectedSize(validSizes[0]);
      }
    }
  };

  // Find matching variant
  const matchedVariant = activeVariants.find(
    (v) =>
      (!selectedSize || v.size === selectedSize) &&
      (!selectedColor || v.color === selectedColor)
  );

  // Determine dynamic variant or base price strictly based on selected variant
  const basePrice = matchedVariant?.price != null
    ? Number(matchedVariant.price)
    : Number(product.price);

  const salePrice = matchedVariant?.salePrice != null
    ? Number(matchedVariant.salePrice)
    : matchedVariant?.price != null
      ? null
      : product.salePrice != null
        ? Number(product.salePrice)
        : null;

  const displayPrice = salePrice ?? basePrice;

  const discountPercent =
    salePrice != null && basePrice > salePrice
      ? Math.round(((basePrice - salePrice) / basePrice) * 100)
      : null;

  const stockInfo = (() => {
    if (activeVariants.length === 0) return { label: "In Stock", color: "text-green-600" };
    const v = matchedVariant;
    if (!v) return { label: "Select options", color: "text-[#8a8070]" };
    if (v.stock === 0) return { label: "Out of Stock", color: "text-red-500" };
    if (v.stock <= 5) return { label: `Only ${v.stock} left!`, color: "text-orange-500" };
    return { label: "In Stock", color: "text-green-600" };
  })();

  const handleAddToCart = () => {
    // If variants exist but none selected, prompt user
    if (activeVariants.length > 0 && !matchedVariant) {
      toast.error("Please select a size/color to continue");
      return;
    }

    const variant = matchedVariant ?? null;
    if (variant && variant.stock < quantity) {
      toast.error("Not enough stock available");
      return;
    }

    addItem({
      productId: product.id,
      variantId: variant?.id,
      productName: product.name,
      price: basePrice,
      salePrice: salePrice ?? undefined,
      imageUrl: activeImage?.imageUrl ?? sortedImages[0]?.imageUrl,
      size: variant?.size ?? undefined,
      color: variant?.color ?? undefined,
      quantity,
      slug: product.slug,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();

  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-olive mb-8">
          <Link href="/" className="hover:text-[#0a0a0a] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-[#0a0a0a] transition-colors">Shop</Link>
          {product.category?.name && (
            <>
              <ChevronRight className="w-3 h-3" />
              <Link
                href={`/category/${product.category.slug}`}
                className="hover:text-[#0a0a0a] transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#0a0a0a] font-medium truncate max-w-50">
            {product.name}
          </span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* ── Left: Image Gallery ── */}
          <div>
            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden bg-[#f5f0e8] aspect-square mb-3 border border-beige">
              {activeImage ? (
                <Image
                  src={activeImage.imageUrl}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShoppingBag className="w-16 h-16 text-[#8a8070]" />
                </div>
              )}

              {/* Sale badge */}
              {discountPercent && (
                <div className="absolute top-4 left-4">
                  <span className="electric-badge px-3 py-1 rounded-full text-sm">
                    -{discountPercent}%
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {sortedImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {sortedImages.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`View image ${idx + 1}`}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 ${idx === activeImageIndex
                      ? "border-coral"
                      : "border-transparent hover:border-[#e8e3d8]"
                      }`}
                  >
                    <Image
                      src={img.imageUrl}
                      alt={`${product.name} view ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Product Info ── */}
          <div className="flex flex-col">
            {/* Category */}
            {product.category?.name && (
              <Link
                href={`/category/${product.category.slug}`}
                className="text-xs text-[#8a8070] uppercase tracking-wider mb-3 hover:text-(--primary) transition-colors"
              >
                {product.category.name}
              </Link>
            )}

            {/* Name */}
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#0a0a0a] leading-tight mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display font-bold text-3xl text-[#0a0a0a]">
                {SITE_CONFIG.currency}{displayPrice.toLocaleString("en-IN")}
              </span>
              {salePrice != null && (
                <span className="text-lg text-[#8a8070] line-through">
                  {SITE_CONFIG.currency}{basePrice.toLocaleString("en-IN")}
                </span>
              )}
              {discountPercent && (
                <span className="electric-badge px-2 py-0.5 rounded-full text-xs">
                  {discountPercent}% off
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-[#8a8070] leading-relaxed mb-6">
                {product.description}
              </p>
            )}

            {/* Size selector */}
            {sizes.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-semibold text-[#0a0a0a] mb-2">
                  Size:{" "}
                  {selectedSize && (
                    <span className="font-normal text-[#8a8070]">{selectedSize}</span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeSelect(size)}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${selectedSize === size
                        ? "border-beige bg-olive text-white"
                        : "border-olive/40 text-olive hover:border-olive"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color selector */}
            {colors.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-semibold text-[#0a0a0a] mb-2">
                  Color:{" "}
                  {selectedColor && (
                    <span className="font-normal text-[#8a8070]">{selectedColor}</span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorSelect(color)}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${selectedColor === color
                        ? "border-beige bg-olive text-white"
                        : "border-olive/40 text-olive hover:border-olive"
                        }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock status */}
            <p className={`text-sm font-medium mb-6 ${stockInfo.color}`}>
              ● {stockInfo.label}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <p className="text-sm font-semibold text-[#0a0a0a]">Qty:</p>
              <div className="flex items-center gap-2 border border-olive/40 rounded-full">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center hover:bg-olive hover:text-white rounded-full transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(20, quantity + 1))}
                  className="w-8 h-8 flex items-center justify-center hover:bg-olive hover:text-white rounded-full transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={handleBuyNow}
                className="flex-1 py-3.5 rounded-full bg-olive text-white text-sm font-bold hover:bg-coral cursor-pointer hover:text-white transition-colors flex items-center justify-center gap-2 group"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Bag
              </button>
              <Link
                href="/checkout"
                onClick={handleAddToCart}
                className="flex-1 py-3.5 rounded-full border-2 border-olive text-olive text-sm font-bold text-center hover:bg-olive hover:text-white transition-colors"
              >
                Buy Now
              </Link>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-[#e8e3d8]">
              {[
                { icon: Truck, text: "Pan-India delivery" },
                { icon: ShieldCheck, text: "Authentic product" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs text-coral">
                  <Icon className="w-4 h-4 shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
