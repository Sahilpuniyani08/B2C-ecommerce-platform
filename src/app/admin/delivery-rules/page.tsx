"use client";

import { useState } from "react";
import {
  Truck,
  Plus,
  Edit2,
  Trash2,
  Clock,
  MapPin,
  IndianRupee,
  Loader2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { useDeliveryRules } from "@/features/delivery-rules/queries";
import {
  useCreateDeliveryRule,
  useUpdateDeliveryRule,
  useDeleteDeliveryRule,
} from "@/features/delivery-rules/mutations";
import type { DeliveryRule } from "@/features/delivery-rules/types";
import { Modal } from "@/components/common/Modal";
import { EmptyState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/common/Skeleton";

export default function AdminDeliveryRulesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<DeliveryRule | null>(null);
  const [deletingRule, setDeletingRule] = useState<DeliveryRule | null>(null);

  // Queries & Mutations
  const { data: rules = [], isLoading, error } = useDeliveryRules(false);
  const createMutation = useCreateDeliveryRule();
  const updateMutation = useUpdateDeliveryRule();
  const deleteMutation = useDeleteDeliveryRule();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    state: "",
    city: "",
    pincode: "",
    minDays: 2,
    maxDays: 5,
    deliveryCharge: 0,
    isActive: true,
  });

  const handleOpenCreate = () => {
    setFormData({
      name: "",
      state: "",
      city: "",
      pincode: "",
      minDays: 2,
      maxDays: 5,
      deliveryCharge: 0,
      isActive: true,
    });
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (rule: DeliveryRule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      state: rule.state || "",
      city: rule.city || "",
      pincode: rule.pincode || "",
      minDays: rule.minDays,
      maxDays: rule.maxDays,
      deliveryCharge: rule.deliveryCharge,
      isActive: rule.isActive,
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    await createMutation.mutateAsync({
      name: formData.name.trim(),
      state: formData.state.trim() || undefined,
      city: formData.city.trim() || undefined,
      pincode: formData.pincode.trim() || undefined,
      minDays: Number(formData.minDays) || 1,
      maxDays: Math.max(Number(formData.minDays) || 1, Number(formData.maxDays) || 1),
      deliveryCharge: Math.max(0, Number(formData.deliveryCharge) || 0),
      isActive: formData.isActive,
    });

    setIsCreateOpen(false);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule || !formData.name.trim()) return;

    await updateMutation.mutateAsync({
      id: editingRule.id,
      input: {
        name: formData.name.trim(),
        state: formData.state.trim() || null,
        city: formData.city.trim() || null,
        pincode: formData.pincode.trim() || null,
        minDays: Number(formData.minDays) || 1,
        maxDays: Math.max(Number(formData.minDays) || 1, Number(formData.maxDays) || 1),
        deliveryCharge: Math.max(0, Number(formData.deliveryCharge) || 0),
        isActive: formData.isActive,
      },
    });

    setEditingRule(null);
  };

  const handleToggleStatus = async (rule: DeliveryRule) => {
    await updateMutation.mutateAsync({
      id: rule.id,
      input: { isActive: !rule.isActive },
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deletingRule) return;
    await deleteMutation.mutateAsync(deletingRule.id);
    setDeletingRule(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0a0a0a]">
            Delivery Rules
          </h1>
          <p className="text-sm text-[#8a8070] mt-1">
            Configure delivery timelines, regional shipping rates, and free shipping criteria.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 bg-[#0a0a0a] hover:bg-[#2a2a2a] text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Delivery Rule
        </button>
      </div>

      {/* Info Callout */}
      <div className="bg-[#fdfaf5] border border-[#eee4d0] rounded-2xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#9e7d3b] flex-shrink-0 mt-0.5" />
        <div className="text-xs text-[#6b604b] leading-relaxed">
          <span className="font-semibold text-[#0a0a0a]">How Matching Priority Works:</span>{" "}
          When a customer checks out, the system matches their shipping address in order of
          specificity: <span className="font-medium text-[#0a0a0a]">Pincode</span> →{" "}
          <span className="font-medium text-[#0a0a0a]">City</span> →{" "}
          <span className="font-medium text-[#0a0a0a]">State</span> →{" "}
          <span className="font-medium text-[#0a0a0a]">National Default (Blank Region)</span>.
        </div>
      </div>

      {/* Content Table */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-[#e8e4dc] p-6 space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">Failed to load delivery rules.</p>
        </div>
      ) : rules.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e8e4dc] p-12">
          <EmptyState
            icon="package"
            title="No delivery rules configured"
            description="Create your first delivery rule to enable checkout shipping cost calculation."
            action={
              <button
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-2 bg-[#0a0a0a] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#2a2a2a] transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Delivery Rule
              </button>
            }
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#e8e4dc] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#fcfaf7] border-b border-[#e8e4dc] text-xs font-semibold text-[#8a8070] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Rule Name</th>
                  <th className="px-6 py-3.5">Target Geography</th>
                  <th className="px-6 py-3.5">Timeline</th>
                  <th className="px-6 py-3.5">Shipping Fee</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ece1]">
                {rules.map((rule) => {
                  const hasGeo = rule.pincode || rule.city || rule.state;
                  return (
                    <tr
                      key={rule.id}
                      className="hover:bg-[#fbf9f5] transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#f5f0e8] flex items-center justify-center text-[#8a8070]">
                            <Truck className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-[#0a0a0a]">{rule.name}</div>
                            <div className="text-xs text-[#8a8070]">
                              ID: {rule.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {hasGeo ? (
                          <div className="flex flex-wrap items-center gap-1.5 text-xs">
                            {rule.pincode && (
                              <span className="font-mono bg-[#f0ece1] text-[#0a0a0a] px-2 py-0.5 rounded-md font-medium">
                                PIN: {rule.pincode}
                              </span>
                            )}
                            {rule.city && (
                              <span className="bg-[#f5f0e8] text-[#6b6255] px-2 py-0.5 rounded-md">
                                {rule.city}
                              </span>
                            )}
                            {rule.state && (
                              <span className="bg-[#f5f0e8] text-[#6b6255] px-2 py-0.5 rounded-md">
                                {rule.state}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                            <MapPin className="w-3 h-3" /> All India (Default)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-[#0a0a0a] font-medium">
                          <Clock className="w-3.5 h-3.5 text-[#8a8070]" />
                          {rule.minDays} – {rule.maxDays} Business Days
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {rule.deliveryCharge === 0 ? (
                          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                            FREE Delivery
                          </span>
                        ) : (
                          <span className="font-semibold text-[#0a0a0a]">
                            ₹{rule.deliveryCharge}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(rule)}
                          disabled={updateMutation.isPending}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                            rule.isActive
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              rule.isActive ? "bg-emerald-500" : "bg-gray-400"
                            }`}
                          />
                          {rule.isActive ? "Active" : "Disabled"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(rule)}
                            className="p-1.5 text-[#8a8070] hover:text-[#0a0a0a] hover:bg-[#f0ece1] rounded-lg transition-colors cursor-pointer"
                            title="Edit Rule"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingRule(rule)}
                            className="p-1.5 text-[#8a8070] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Rule"
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

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isCreateOpen || editingRule !== null}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingRule(null);
        }}
        title={editingRule ? "Edit Delivery Rule" : "Create Delivery Rule"}
        description={
          editingRule
            ? `Updating delivery rule: ${editingRule.name}`
            : "Define pricing and SLA timelines based on destination criteria."
        }
      >
        <form
          onSubmit={editingRule ? handleUpdateSubmit : handleCreateSubmit}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-medium text-[#0a0a0a] uppercase tracking-wider mb-1">
              Rule Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Standard Pan-India, Bangalore Express, Delhi NCR"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full bg-[#fcfaf7] border border-[#e8e4dc] rounded-xl px-3.5 py-2.5 text-sm text-[#0a0a0a] placeholder:text-[#a0988a] focus:outline-none focus:border-[#0a0a0a]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#0a0a0a] uppercase tracking-wider mb-1">
                State (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Karnataka"
                value={formData.state}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, state: e.target.value }))
                }
                className="w-full bg-[#fcfaf7] border border-[#e8e4dc] rounded-xl px-3 py-2 text-sm text-[#0a0a0a] placeholder:text-[#a0988a] focus:outline-none focus:border-[#0a0a0a]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#0a0a0a] uppercase tracking-wider mb-1">
                City (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Bangalore"
                value={formData.city}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, city: e.target.value }))
                }
                className="w-full bg-[#fcfaf7] border border-[#e8e4dc] rounded-xl px-3 py-2 text-sm text-[#0a0a0a] placeholder:text-[#a0988a] focus:outline-none focus:border-[#0a0a0a]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#0a0a0a] uppercase tracking-wider mb-1">
                Pincode (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 560001"
                value={formData.pincode}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, pincode: e.target.value }))
                }
                className="w-full bg-[#fcfaf7] border border-[#e8e4dc] rounded-xl px-3 py-2 text-sm font-mono text-[#0a0a0a] placeholder:text-[#a0988a] focus:outline-none focus:border-[#0a0a0a]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#0a0a0a] uppercase tracking-wider mb-1">
                Min Days *
              </label>
              <input
                type="number"
                min={1}
                required
                value={formData.minDays}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    minDays: parseInt(e.target.value) || 1,
                  }))
                }
                className="w-full bg-[#fcfaf7] border border-[#e8e4dc] rounded-xl px-3.5 py-2 text-sm text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#0a0a0a] uppercase tracking-wider mb-1">
                Max Days *
              </label>
              <input
                type="number"
                min={formData.minDays || 1}
                required
                value={formData.maxDays}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    maxDays: parseInt(e.target.value) || formData.minDays,
                  }))
                }
                className="w-full bg-[#fcfaf7] border border-[#e8e4dc] rounded-xl px-3.5 py-2 text-sm text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#0a0a0a] uppercase tracking-wider mb-1">
                Shipping Fee (₹)
              </label>
              <input
                type="number"
                min={0}
                value={formData.deliveryCharge}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    deliveryCharge: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full bg-[#fcfaf7] border border-[#e8e4dc] rounded-xl px-3.5 py-2 text-sm text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a]"
              />
            </div>
          </div>

          <div className="pt-2">
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
                Rule is Active for checkout calculation
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0ece1]">
            <button
              type="button"
              onClick={() => {
                setIsCreateOpen(false);
                setEditingRule(null);
              }}
              className="px-4 py-2 rounded-xl text-sm font-medium text-[#8a8070] hover:text-[#0a0a0a] hover:bg-[#f5f0e8] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="inline-flex items-center gap-2 bg-[#0a0a0a] hover:bg-[#2a2a2a] text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              {editingRule ? "Save Changes" : "Create Rule"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deletingRule !== null}
        onClose={() => setDeletingRule(null)}
        title="Delete Delivery Rule"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#6b6255]">
            Are you sure you want to delete delivery rule{" "}
            <span className="font-semibold text-[#0a0a0a]">"{deletingRule?.name}"</span>?
            Customers matching this region will fall back to higher level rules.
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setDeletingRule(null)}
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
