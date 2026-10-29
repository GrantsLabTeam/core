import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Figma-style presentation layout for the "Design System" showcase pages.
 * A grey canvas holds white, labelled frames (like artboards on a Figma page).
 */

export interface CanvasProps {
  /** Page name, shown like a Figma page title. */
  title: string;
  /** Short description of what the page covers. */
  description?: React.ReactNode;
  /** Small label above the title (e.g. "Foundations"). */
  eyebrow?: string;
  children: React.ReactNode;
}

export const Canvas = ({ title, description, eyebrow, children }: CanvasProps) => (
  <div className="min-h-screen bg-[#E9E9E9] px-16 py-14 text-black">
    <header className="mb-12 max-w-[880px]">
      {eyebrow && (
        <div className="mb-3 font-ui-mono text-[12px] uppercase tracking-[0.12em] text-grey-500">
          {eyebrow}
        </div>
      )}
      <h1 className="text-[48px] font-semibold leading-[56px] tracking-[-0.02em]">{title}</h1>
      {description && (
        <p className="mt-4 text-[18px] leading-[28px] text-grey-900">{description}</p>
      )}
    </header>
    <div className="flex flex-col gap-14">{children}</div>
  </div>
);

export interface FrameProps {
  /** Frame name, rendered above the frame like a Figma artboard label. */
  name: string;
  /** Optional dimensions/notes shown next to the name. */
  meta?: string;
  /** Fixed frame width in px. Defaults to filling the canvas. */
  width?: number;
  className?: string;
  /** Remove inner padding (for full-bleed screens). */
  bleed?: boolean;
  children: React.ReactNode;
}

export const Frame = ({ name, meta, width, className, bleed, children }: FrameProps) => (
  <section style={width ? { width } : undefined} className={cn(!width && "w-full")}>
    <div className="mb-2 flex items-baseline gap-3 font-ui-mono text-[12px] text-grey-500">
      <span className="text-grey-900">{name}</span>
      {meta && <span>{meta}</span>}
    </div>
    <div
      className={cn(
        "overflow-hidden rounded-[4px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
        !bleed && "p-12",
        className,
      )}
    >
      {children}
    </div>
  </section>
);

/** Lays frames out side by side, wrapping like a Figma page. */
export const FrameRow = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap items-start gap-10">{children}</div>
);

export interface SectionProps {
  title: string;
  description?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/** A titled group inside a frame. */
export const Section = ({ title, description, className, children }: SectionProps) => (
  <div className={cn("[&+&]:mt-14", className)}>
    <h2 className="text-[24px] font-semibold leading-[32px]">{title}</h2>
    {description && (
      <p className="mt-1 max-w-[720px] text-[14px] leading-[22px] text-grey-900">{description}</p>
    )}
    <div className="mt-6">{children}</div>
  </div>
);

/** Small mono caption, used for token names, values and variant labels. */
export const Caption = ({
  children,
  muted,
  className,
}: {
  children: React.ReactNode;
  muted?: boolean;
  className?: string;
}) => (
  <span
    className={cn(
      "font-ui-mono text-[11px] leading-[16px]",
      muted ? "text-grey-500" : "text-grey-900",
      className,
    )}
  >
    {children}
  </span>
);

/** A specimen with a caption underneath. */
export const Spec = ({
  label,
  sublabel,
  className,
  children,
}: {
  label?: React.ReactNode;
  sublabel?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) => (
  <div className={cn("flex flex-col items-start gap-2", className)}>
    {children}
    {(label || sublabel) && (
      <div className="flex flex-col">
        {label && <Caption>{label}</Caption>}
        {sublabel && <Caption muted>{sublabel}</Caption>}
      </div>
    )}
  </div>
);

export interface VariantGridProps<R extends string, C extends string> {
  rows: readonly R[];
  columns: readonly C[];
  render: (row: R, column: C) => React.ReactNode;
  /** Label for the row axis, shown in the top-left corner. */
  corner?: string;
  rowLabel?: (row: R) => React.ReactNode;
  columnLabel?: (column: C) => React.ReactNode;
}

/** A variant × state (or size) matrix, like a Figma component set. */
export const VariantGrid = <R extends string, C extends string>({
  rows,
  columns,
  render,
  corner,
  rowLabel = (r) => r,
  columnLabel = (c) => c,
}: VariantGridProps<R, C>) => (
  <div
    className="grid items-center gap-x-8 gap-y-5"
    style={{ gridTemplateColumns: `max-content repeat(${columns.length}, max-content)` }}
  >
    <Caption muted>{corner}</Caption>
    {columns.map((c) => (
      <Caption key={c} muted>
        {columnLabel(c)}
      </Caption>
    ))}
    {rows.map((r) => (
      <React.Fragment key={r}>
        <Caption>{rowLabel(r)}</Caption>
        {columns.map((c) => (
          <div key={c}>{render(r, c)}</div>
        ))}
      </React.Fragment>
    ))}
  </div>
);

/** Dashed outline that marks a component set, like Figma's purple variant container. */
export const ComponentSet = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={cn(
      "inline-block rounded-[6px] border border-dashed border-purple-500 p-8",
      className,
    )}
  >
    {children}
  </div>
);
