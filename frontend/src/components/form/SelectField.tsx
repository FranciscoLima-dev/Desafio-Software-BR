import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string;
  label: string;
  options: Array<{
    label: string;
    value: string;
  }>;
  placeholder?: string;
};

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ className, error, id, label, options, placeholder, ...props }, ref) => {
    const selectId = id ?? props.name;

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-200" htmlFor={selectId}>
          {label}
        </label>
        <select
          className={cn(
            "h-11 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20",
            error && "border-red-400 focus:border-red-400 focus:ring-red-400/20",
            className,
          )}
          id={selectId}
          ref={ref}
          {...props}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
      </div>
    );
  },
);

SelectField.displayName = "SelectField";
