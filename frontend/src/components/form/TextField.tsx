import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  label: string;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ className, error, id, label, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-200" htmlFor={inputId}>
          {label}
        </label>
        <input
          className={cn(
            "h-11 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20",
            error && "border-red-400 focus:border-red-400 focus:ring-red-400/20",
            className,
          )}
          id={inputId}
          ref={ref}
          {...props}
        />
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
      </div>
    );
  },
);

TextField.displayName = "TextField";
