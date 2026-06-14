"use client";

import {
  CircleCheckIcon, InfoIcon, LoaderCircleIcon,
  OctagonXIcon, TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

// Hardcoded to system — app has no dark mode toggle, next-themes not needed
const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner
    theme="system"
    className="toaster group"
    icons={{
      success: <CircleCheckIcon className="size-4" />,
      info:    <InfoIcon className="size-4" />,
      warning: <TriangleAlertIcon className="size-4" />,
      error:   <OctagonXIcon className="size-4" />,
      loading: <LoaderCircleIcon className="size-4 animate-spin" />,
    }}
    style={{
      "--normal-bg":     "var(--popover)",
      "--normal-text":   "var(--popover-foreground)",
      "--normal-border": "var(--border)",
      "--border-radius": "var(--radius)",
    } as React.CSSProperties}
    {...props}
  />
);

export { Toaster };
