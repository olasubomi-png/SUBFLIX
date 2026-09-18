import { cn } from "@/lib/utils";

export function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  placeholder,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number | null;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-violet-400"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
      />
    </div>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
  rows = 4,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  rows?: number;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue ?? ""}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
      />
    </div>
  );
}

export function Checkbox({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-300">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-white/20 bg-white/5 text-violet-600 focus:ring-violet-500"
      />
      {label}
    </label>
  );
}

export function MultiSelect({
  label,
  name,
  options,
  selectedIds,
}: {
  label: string;
  name: string;
  options: { id: string; name: string }[];
  selectedIds?: string[];
}) {
  const selected = new Set(selectedIds ?? []);
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium text-gray-300">{label}</p>
      <div className="max-h-40 space-y-1 overflow-y-auto rounded-lg border border-white/10 bg-white/5 p-2">
        {options.length === 0 ? (
          <p className="text-xs text-muted">None available</p>
        ) : (
          options.map((o) => (
            <label
              key={o.id}
              className="flex items-center gap-2 rounded px-2 py-1 text-sm text-gray-300 hover:bg-white/5"
            >
              <input
                type="checkbox"
                name={name}
                value={o.id}
                defaultChecked={selected.has(o.id)}
                className="h-3.5 w-3.5 rounded text-violet-600"
              />
              {o.name}
            </label>
          ))
        )}
      </div>
    </div>
  );
}
