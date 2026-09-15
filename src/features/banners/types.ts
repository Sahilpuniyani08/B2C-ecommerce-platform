export interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  imageUrl: string;
  buttonText?: string | null;
  categoryId?: string | null;
  productId?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  storagePath?: string | null;
}

export interface CreateBannerInput {
  title: string;
  subtitle?: string;
  imageUrl: string;
  buttonText?: string;
  categoryId?: string | null;
  productId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
  storagePath?: string;
}

export interface UpdateBannerInput {
  title?: string;
  subtitle?: string | null;
  imageUrl?: string;
  buttonText?: string | null;
  categoryId?: string | null;
  productId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
  storagePath?: string | null;
}
