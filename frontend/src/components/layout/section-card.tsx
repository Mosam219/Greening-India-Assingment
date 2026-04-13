import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function SectionCard({
  className,
  ...props
}: ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "rounded-[2rem] border border-border/70 bg-card/85 p-6 shadow-sm backdrop-blur sm:p-8",
        className,
      )}
      {...props}
    />
  );
}
