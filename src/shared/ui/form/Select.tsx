export type Option = {
  value: string;
  label: string;
  disabled?: boolean;
};

type Props = {
  options: Readonly<Option[]>;
  value: string;
  onChange: (value: string) => void;
  className?: string; // extra classes merged with the base "input"
  placeholder?: string; // shown as the first empty option if allowEmpty
  allowEmpty?: boolean; // adds an empty option with placeholder text
  id?: string;
  name?: string;
};

/**
 * Simple, accessible select styled like other inputs.
 * Use `allowEmpty` + `placeholder` when the value can be blank.
 */
export default function Select({
  options,
  value,
  onChange,
  className = "",
  placeholder = "—",
  allowEmpty = false,
  id,
  name,
}: Props) {
  return (
    <select
      id={id}
      name={name}
      className={`input ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {allowEmpty && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
