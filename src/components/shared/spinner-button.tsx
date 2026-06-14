import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

interface SpinnerButtonProps {
  loading: boolean;
  disabled?: boolean;
  /** Text while idle */
  children: ReactNode;
  /** Text while loading — defaults to children */
  loadingText?: string;
  type?: "submit" | "button";
  className?: string;
  /** Icon to show alongside idle text */
  icon?: ReactNode;
  size?: "default" | "sm" | "lg";
}

/**
 * 🔄 SpinnerButton — unified loading-state submit button
 * Replaces:
 *  - features/auth/submit-button.tsx
 *  - features/profile/profile-submit-button.tsx
 */
export function SpinnerButton({
  loading,
  disabled,
  children,
  loadingText,
  type = "submit",
  className,
  icon,
  size = "default",
}: SpinnerButtonProps) {
  return (
    <Button
      type={type}
      size={size}
      disabled={loading || disabled}
      className={cn(loading && "opacity-80 cursor-not-allowed", className)}
    >
      {loading ? (
        <>
          <LoaderCircle className="w-4 h-4 animate-spin" />
          {loadingText ?? children}
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </Button>
  );
}
