import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type PageShellProps = ComponentProps<"main"> & {
  decorated?: boolean;
};

export function PageShell({
  className,
  decorated = false,
  children,
  ...props
}: PageShellProps) {
  return (
    <main
      className={cn("relative isolate min-h-screen overflow-hidden", className)}
      {...props}
    >
      {decorated ? (
        <>
          <div className="absolute -left-16 top-12 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute right-[-3rem] top-40 h-72 w-72 rounded-full bg-accent/40 blur-3xl" />
        </>
      ) : null}
      {children}
    </main>
  );
}
