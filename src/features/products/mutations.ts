import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  addProductImage,
  addProductVariant,
  updateProductVariant,
  deleteProductVariant,
} from "./api";
import { productKeys } from "./queries";
import type {
  CreateProductInput,
  UpdateProductInput,
  CreateProductImageInput,
  CreateVariantInput,
  UpdateVariantInput,
} from "./types";
import { getErrorMessage } from "@/lib/api-client";

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProductInput) => createProduct(input),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: productKeys.all });
      toast.success(`Product "${data.name}" created`);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProductInput }) =>
      updateProduct(id, input),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: productKeys.all });
      toast.success(`Product "${data.name}" updated`);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Product deleted");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useAddProductImage(productId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProductImageInput) => addProductImage(productId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.images(productId) });
      toast.success("Image added");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useAddProductVariant(productId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateVariantInput) => addProductVariant(productId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.variants(productId) });
      toast.success("Variant added");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useUpdateProductVariant(productId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ variantId, input }: { variantId: string; input: UpdateVariantInput }) =>
      updateProductVariant(productId, variantId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.variants(productId) });
      toast.success("Variant updated");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useDeleteProductVariant(productId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (variantId: string) => deleteProductVariant(productId, variantId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.variants(productId) });
      toast.success("Variant deleted");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}
