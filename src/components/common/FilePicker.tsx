"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, FolderOpen, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";

interface FilePickerProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: "banners" | "categories" | "products";
  label?: string;
  placeholder?: string;
  aspect?: "square" | "banner" | "portrait";
  className?: string;
}

export function FilePicker({
  value,
  onChange,
  folder = "products",
  label = "Select Image File",
  placeholder = "Click or drag an image file from your device",
  aspect = "square",
  className = "",
}: FilePickerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPG, PNG, WebP, GIF, SVG)");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await apiClient.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success && res.data.url) {
        onChange(res.data.url);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Upload failed. Please try again.");
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message || "Error uploading image file.";
      toast.error(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const aspectClass =
    aspect === "banner"
      ? "aspect-[21/9]"
      : aspect === "portrait"
      ? "aspect-[3/4]"
      : "aspect-square";

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-[#1c2119] uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
      />

      {/* Uploading State */}
      {isUploading ? (
        <div className="border-2 border-dashed border-[#677a5d] bg-[#f9f7f1] rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 text-[#677a5d] animate-spin" />
          <p className="text-xs font-semibold text-[#1c2119]">Uploading file to server...</p>
        </div>
      ) : value ? (
        /* Selected Image Preview Box */
        <div className="relative group rounded-2xl overflow-hidden border border-[#e5e0d5] bg-[#f9f7f1] p-2 flex items-center gap-4">
          <div className={`relative w-20 ${aspectClass} rounded-xl overflow-hidden bg-[#e3dacb] shrink-0 border border-[#e5e0d5]`}>
            <Image src={value} alt="Uploaded Image Preview" fill className="object-cover" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[#1c2119] truncate">{value.split("/").pop()}</p>
            <p className="text-[11px] text-[#7d796f] truncate mt-0.5">{value}</p>
            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#677a5d] hover:text-[#52634a] hover:underline cursor-pointer"
              >
                <FolderOpen className="w-3.5 h-3.5" /> Replace File
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty File Dropzone */
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-[#e5e0d5] hover:border-[#677a5d] bg-[#f9f7f1] hover:bg-[#f1eee6] rounded-2xl p-5 sm:p-6 text-center cursor-pointer transition-all duration-200 group flex flex-col items-center justify-center gap-2"
        >
          <div className="w-10 h-10 rounded-full bg-[#e5eadf] group-hover:bg-[#c9d4bd] text-[#677a5d] flex items-center justify-center transition-colors">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#1c2119] group-hover:text-[#677a5d] transition-colors">
              Click or Drag file from computer
            </p>
            <p className="text-[11px] text-[#7d796f] mt-0.5">{placeholder}</p>
          </div>
        </div>
      )}
    </div>
  );
}
