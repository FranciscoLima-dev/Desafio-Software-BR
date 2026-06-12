import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
  label: string;
};

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ className, error, id, label, ...props }, ref) => {
    const textAreaId = id ?? props.name;

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-200" htmlFor={textAreaId}>
          {label}
        </label>
        <textarea
          className={cn(
            "min-h-28 w-full resize-y rounded-md border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20",
            error && "border-red-400 focus:border-red-400 focus:ring-red-400/20",
            className,
          )}
          id={textAreaId}
          ref={ref}
          {...props}
        />
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
      </div>
    );
  },
);

TextAreaField.displayName = "TextAreaField";

