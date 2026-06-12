import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "ghost";
};

const variantClasses = {
  primary: "bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-950/20 hover:bg-emerald-400",
  secondary:
    "border border-slate-700 bg-slate-900 text-slate-100 hover:border-slate-600 hover:bg-slate-800",
  ghost: "text-slate-300 hover:bg-slate-900 hover:text-white",
};

export function Button({
  children,
  className,
  disabled,
  isLoading = false,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-md px-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        className,
      )}
      disabled={disabled || isLoading}
      type={type}
      {...props}
    >
      {isLoading ? "Aguarde..." : children}
    </button>
  );
}
