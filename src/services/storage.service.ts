import { supabaseAdmin } from "@/lib/supabase";
import fs from "fs/promises";
import path from "path";

export const BUCKET_NAME = "shop-assets";
export type StorageFolder = "banners" | "categories" | "products";

/**
 * Get the public URL of a file from Supabase storage.
 */
export function getPublicUrl(bucket: string = BUCKET_NAME, filePath: string): string {
  if (filePath.startsWith("/") || filePath.startsWith("http")) {
    return filePath;
  }
  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Parse storage path from full URL or relative path.
 */
export function parseStoragePath(urlOrPath: string): string {
  if (!urlOrPath) return "";

  // Strip query parameters and hashes (e.g. ?t=123#anchor)
  let cleaned = urlOrPath.split("?")[0].split("#")[0];

  // If full Supabase URL containing bucket name
  if (cleaned.includes(`/${BUCKET_NAME}/`)) {
    cleaned = cleaned.split(`/${BUCKET_NAME}/`)[1];
  } else if (cleaned.includes("/storage/v1/object/public/")) {
    const parts = cleaned.split("/storage/v1/object/public/")[1];
    cleaned = parts.startsWith(`${BUCKET_NAME}/`)
      ? parts.replace(`${BUCKET_NAME}/`, "")
      : parts;
  }

  if (cleaned.startsWith("/")) {
    cleaned = cleaned.replace(/^\//, "");
  }

  try {
    return decodeURIComponent(cleaned);
  } catch {
    return cleaned;
  }
}

/**
 * Upload a file to storage (Supabase shop-assets bucket with local disk fallback).
 */
export async function uploadFile(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
  folder: StorageFolder = "products",
  bucket: string = BUCKET_NAME
): Promise<{ url: string; path: string }> {
  const fileExt = path.extname(fileName) || ".jpg";
  const cleanBaseName = path.basename(fileName, fileExt).replace(/[^a-zA-Z0-9_-]/g, "_");
  const uniqueName = `${folder}/${cleanBaseName}_${Date.now()}${fileExt}`;

  // Try Supabase Storage first
  try {
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const exists = buckets?.some((b) => b.name === bucket);
    if (!exists) {
      await supabaseAdmin.storage.createBucket(bucket, { public: true });
    }

    const { data, error } = await supabaseAdmin.storage.from(bucket).upload(uniqueName, fileBuffer, {
      contentType,
      upsert: true,
    });

    if (!error && data) {
      const publicUrl = getPublicUrl(bucket, data.path);
      return { url: publicUrl, path: data.path };
    } else if (error) {
      console.warn("Supabase upload error:", error);
    }
  } catch (err) {
    console.warn("Supabase storage upload failed, falling back to local storage:", err);
  }

  // Fallback to local /public/uploads directory
  const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(uploadsDir, { recursive: true });
  const localFilePath = path.join(uploadsDir, `${cleanBaseName}_${Date.now()}${fileExt}`);
  await fs.writeFile(localFilePath, fileBuffer);

  const localUrl = `/uploads/${folder}/${path.basename(localFilePath)}`;
  return { url: localUrl, path: localUrl };
}

/**
 * Delete a file from storage (Supabase bucket or local disk fallback).
 */
export async function deleteFileFromStorage(
  urlOrPath: string | null | undefined,
  bucket: string = BUCKET_NAME
) {
  if (!urlOrPath) return;

  const storagePath = parseStoragePath(urlOrPath);
  if (!storagePath) return;

  // Don't attempt to delete external domain images (e.g., Unsplash, Pexels)
  if (storagePath.startsWith("http://") || storagePath.startsWith("https://")) {
    return;
  }

  // If local fallback file
  if (storagePath.startsWith("uploads/")) {
    try {
      const localFilePath = path.join(process.cwd(), "public", storagePath);
      await fs.unlink(localFilePath);
    } catch (e) {
      // Ignore if file doesn't exist locally
    }
    return;
  }

  // Supabase storage delete
  try {
    const { error } = await supabaseAdmin.storage.from(bucket).remove([storagePath]);
    if (error) {
      console.error(`Storage delete error for object "${storagePath}":`, error);
    }
  } catch (e) {
    console.error(`Storage delete exception for object "${storagePath}":`, e);
  }
}


