// Column widths for the Service Logs table.
// Keep in the feature folder because it is feature-specific.
export const COL_W = {
  provider: "25ch",
  order: "12ch",
  car: "10ch",
  odometer: "10ch",
  engine: "10ch",
  start: "14ch",
  end: "14ch",
  type: "12ch",
  desc: "25ch",
  actions: "12ch",
} as const;

export type ColKey = keyof typeof COL_W;

/** React helper to render <colgroup> with the widths above. */
export function ColGroup() {
  return (
    <colgroup>
      <col style={{ width: COL_W.provider }} />
      <col style={{ width: COL_W.order }} />
      <col style={{ width: COL_W.car }} />
      <col style={{ width: COL_W.odometer }} />
      <col style={{ width: COL_W.engine }} />
      <col style={{ width: COL_W.start }} />
      <col style={{ width: COL_W.end }} />
      <col style={{ width: COL_W.type }} />
      <col style={{ width: COL_W.desc }} />
      <col style={{ width: COL_W.actions }} />
    </colgroup>
  );
}
