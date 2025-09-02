// Map service type to badge CSS class (kept close to the feature).
const TYPE_TO_CLASS: Record<string, string> = {
  planned: "badge badge-planned",
  unplanned: "badge badge-unplanned",
  emergency: "badge badge-emergency",
};

export default function TypeBadge({ type }: { type: string }) {
  const cls = TYPE_TO_CLASS[type] ?? "badge";
  return <span className={cls}>{type}</span>;
}
