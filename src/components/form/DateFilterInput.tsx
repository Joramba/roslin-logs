import React, { useEffect, useRef, useState } from "react";

type Props = {
  value: string | null;
  onChange: (v: string | null) => void;
  placeholder?: string;
  className?: string;
};

// Date filter with reliable placeholder:
// - empty -> type="text" to show placeholder
// - on focus -> switch to "date" and open native picker
// - on blur (empty) -> back to "text"
export default function DateFilterInput({
  value,
  onChange,
  placeholder = "mm/dd/yyyy",
  className = "",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<"text" | "date">(value ? "date" : "text");

  // Keep type in sync if external value changes
  useEffect(() => {
    setType(value ? "date" : "text");
  }, [value]);

  const handleFocus = () => {
    // Switch to date and open the calendar
    setType("date");
    requestAnimationFrame(() => {
      const el = inputRef.current as any;
      if (el?.showPicker) el.showPicker(); // Chrome/Edge support
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!e.currentTarget.value) setType("text");
  };

  return (
    <input
      ref={inputRef}
      type={type}
      className={`input ${className}`}
      // Show placeholder only in "text" mode (most browsers ignore it on type="date")
      placeholder={type === "text" ? placeholder : undefined}
      value={value ?? ""}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={(e) => onChange(e.target.value || null)}
      // Prevent free typing while in "text" mode; clicking will open the picker
      readOnly={type === "text"}
      aria-label={placeholder}
    />
  );
}
