import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "@/lib/api-handler";
import { requireAdmin } from "@/lib/auth";
import { uploadFile, StorageFolder } from "@/services/storage.service";

/**
 * POST /api/upload — Upload a new image file into shop-assets (subfolder: banners, categories, products)
 */
export const POST = apiHandler(async (request: NextRequest) => {
  await requireAdmin(request);

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const rawFolder = (formData.get("folder") as string) || "products";
  const folder: StorageFolder = ["banners", "categories", "products"].includes(rawFolder)
    ? (rawFolder as StorageFolder)
    : "products";

  if (!file) {
    return NextResponse.json(
      { success: false, error: "No file provided" },
      { status: 400 }
    );
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { success: false, error: "Only image files (JPG, PNG, WebP, GIF, SVG) are allowed" },
      { status: 400 }
    );
  }

  // Validate file size (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json(
      { success: false, error: "File size exceeds 10MB limit" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await uploadFile(buffer, file.name, file.type, folder);

  return NextResponse.json({
    success: true,
    url: result.url,
    path: result.path,
    name: file.name,
  }, { status: 201 });
});

