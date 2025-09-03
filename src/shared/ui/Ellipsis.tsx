/**
 * Ellipsis text with optional multi-line clamp.
 * Always sets title for native tooltip with the full text.
 * Works inside table cells thanks to block/min-w-0/max-w-full.
 */
export default function Ellipsis({
  text,
  lines = 1,
  className = "",
}: {
  text: string | number | null | undefined;
  lines?: 1 | 2 | 3;
  className?: string;
}) {
  const value = (text ?? "").toString();
  const clampClass =
    lines === 1 ? "ellipsis-1" : lines === 2 ? "ellipsis-2" : "ellipsis-3";

  return (
    <span
      className={`block min-w-0 max-w-full ${clampClass} break-words ${className}`}
      title={value}
    >
      {value}
    </span>
  );
}
