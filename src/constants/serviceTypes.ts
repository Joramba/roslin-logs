// Shared option lists for service "type" selects

export const SERVICE_TYPES = [
  { value: "planned", label: "planned" },
  { value: "unplanned", label: "unplanned" },
  { value: "emergency", label: "emergency" },
] as const;

export type ServiceTypeValue = (typeof SERVICE_TYPES)[number]["value"];

// Filter dropdown options (includes "all")
export const FILTER_TYPE_OPTIONS = [
  { value: "all", label: "all types" },
  ...SERVICE_TYPES,
] as const;
