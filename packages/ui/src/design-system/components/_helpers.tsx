import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Local layout helpers for the Components pages. They only arrange specimens —
 * every component on these pages is the real one imported from the library.
 */

/** A light grey stage, for components whose resting state is white-on-white. */
export const Surface = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => <div className={cn("rounded-[8px] bg-grey-50 p-6", className)}>{children}</div>;

/** A fixed-width column, so specimens of different intrinsic widths line up. */
export const Fixed = ({
  width,
  className,
  children,
  ...rest
}: {
  width: number;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => (
  <div {...rest} style={{ width }} className={className}>
    {children}
  </div>
);

/** An evenly spaced grid of specimens. */
export const SpecGrid = ({
  columns,
  className,
  children,
}: {
  columns: number;
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={cn("grid items-start gap-x-10 gap-y-8", className)}
    style={{ gridTemplateColumns: `repeat(${columns}, max-content)` }}
  >
    {children}
  </div>
);
