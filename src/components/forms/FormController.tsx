"use client";

import React from "react";
import { FilePicker } from "../common/FilePicker";

// ─── Input Field ────────────────────────────────────────────────────────
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, icon, className = "", id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-[#1c2119] uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7d796f] pointer-events-none">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-[#f9f7f1] border border-[#e5e0d5] text-[#1c2119] text-sm rounded-xl px-3.5 py-2.5 placeholder:text-[#99958b] focus:outline-none focus:border-[#677a5d] focus:ring-1 focus:ring-[#677a5d] transition-colors ${
              icon ? "pl-10" : ""
            } ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""} ${className}`}
            {...props}
          />
        </div>
        {error ? (
          <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#7d796f] mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
FormInput.displayName = "FormInput";

// ─── Select Field ──────────────────────────────────────────────────────
interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: Array<{ value: string; label: string }>;
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, options, children, className = "", id, ...props }, ref) => {
    const selectId = id || props.name;

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold text-[#1c2119] uppercase tracking-wider">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`w-full bg-[#f9f7f1] border border-[#e5e0d5] text-[#1c2119] text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#677a5d] focus:ring-1 focus:ring-[#677a5d] transition-colors ${
            error ? "border-red-500" : ""
          } ${className}`}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {error && <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>}
      </div>
    );
  }
);
FormSelect.displayName = "FormSelect";

// ─── Textarea Field ────────────────────────────────────────────────────
interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const textareaId = id || props.name;

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-semibold text-[#1c2119] uppercase tracking-wider">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={`w-full bg-[#f9f7f1] border border-[#e5e0d5] text-[#1c2119] text-sm rounded-xl px-3.5 py-2.5 placeholder:text-[#99958b] focus:outline-none focus:border-[#677a5d] focus:ring-1 focus:ring-[#677a5d] transition-colors ${
            error ? "border-red-500" : ""
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>}
      </div>
    );
  }
);
FormTextarea.displayName = "FormTextarea";

// ─── Checkbox Field ────────────────────────────────────────────────────
interface FormCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
}

export const FormCheckbox = React.forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ label, description, className = "", id, ...props }, ref) => {
    const checkboxId = id || props.name;

    return (
      <div className="flex items-start gap-3 py-1">
        <input
          id={checkboxId}
          type="checkbox"
          ref={ref}
          className={`w-4 h-4 rounded text-[#677a5d] border-[#e5e0d5] focus:ring-[#677a5d] mt-0.5 cursor-pointer ${className}`}
          {...props}
        />
        <div className="text-xs">
          <label htmlFor={checkboxId} className="font-semibold text-[#1c2119] cursor-pointer">
            {label}
          </label>
          {description && <p className="text-[#7d796f] text-[11px] mt-0.5">{description}</p>}
        </div>
      </div>
    );
  }
);
FormCheckbox.displayName = "FormCheckbox";

// ─── Image Picker Field ────────────────────────────────────────────────
interface FormImagePickerProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  folder?: "banners" | "categories" | "products";
  aspect?: "square" | "banner" | "portrait";
  placeholder?: string;
  error?: string;
}

export function FormImagePicker({
  label,
  value,
  onChange,
  folder = "products",
  aspect = "square",
  placeholder,
  error,
}: FormImagePickerProps) {
  return (
    <div className="space-y-1.5 w-full">
      <FilePicker
        label={label}
        value={value}
        onChange={onChange}
        folder={folder}
        aspect={aspect}
        placeholder={placeholder}
      />
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}
