import React from "react";

export function fieldErrorClass(error?: string) {
  // Visual error state without changing input dimensions
  return error ? "border-rose-500 ring-2 ring-rose-100" : "";
}

export default function Field({
  label,
  error,
  description,
  children,
  htmlFor,
}: {
  label: string;
  error?: string;
  description?: string; // Optional helper text shown when there is no error
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label className="grid gap-1" htmlFor={htmlFor}>
      <span className="text-sm">{label}</span>
      {children}

      {/* Reserve a single line for helper/error text to avoid layout shifts */}
      <div className="min-h-[18px] leading-4">
        {error ? (
          <span className="text-xs text-rose-600">{error}</span>
        ) : description ? (
          <span className="text-xs text-gray-500">{description}</span>
        ) : null}
      </div>
    </label>
  );
}
