import type { Meta, StoryObj } from "@storybook/react";

import { Canvas, Caption, Frame, FrameRow, Section, Spec } from "@/design-system/_canvas";

const meta = {
  title: "Design System/Foundations/Shape & Elevation",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  tags: ["!autodocs"],
} satisfies Meta;

export default meta;

// --radius is 0.5rem (src/index.css); lg/md/sm derive from it in @gitcoin/themes.
const radii = [
  { token: "rounded-none", value: "0", className: "rounded-none" },
  { token: "rounded-sm", value: "4px · radius − 4", className: "rounded-sm" },
  { token: "rounded-md", value: "6px · radius − 2", className: "rounded-md" },
  { token: "rounded-lg", value: "8px · --radius", className: "rounded-lg" },
  { token: "rounded-xl", value: "12px", className: "rounded-xl" },
  { token: "rounded-3.5", value: "14px · custom", className: "rounded-3.5" },
  { token: "rounded-2xl", value: "16px", className: "rounded-2xl" },
  { token: "rounded-3xl", value: "24px", className: "rounded-3xl" },
  { token: "rounded-full", value: "9999px", className: "rounded-full" },
];

const shadows = [
  { token: "shadow-sm", note: "Tailwind default", className: "shadow-sm" },
  { token: "shadow-md", note: "Tailwind default", className: "shadow-md" },
  { token: "shadow-lg", note: "Tailwind default", className: "shadow-lg" },
  { token: "shadow-navbar", note: "Custom · sticky navigation", className: "shadow-navbar" },
  { token: "shadow-toast", note: "Custom · 4-layer toast shadow", className: "shadow-toast" },
];

const borders = [
  { token: "border", value: "1px", className: "border" },
  { token: "border-1.5", value: "1.5px · custom", className: "border-1.5" },
  { token: "border-2", value: "2px · outlined variants", className: "border-2" },
];

const spacing = [1, 2, 3, 4, 6, 8, 10, 12, 16, 18, 20, 24];

export const ShapeAndElevation: StoryObj = {
  name: "Shape & Elevation",
  render: () => (
    <Canvas
      eyebrow="Foundations"
      title="Shape & Elevation"
      description="Corner radius, borders, shadows and spacing. The radius scale is driven by one --radius variable, so the whole system can be made sharper or softer from a single value."
    >
      <Frame name="Corner radius" meta="--radius: 0.5rem">
        <Section title="Corner radius">
          <div className="flex flex-wrap gap-8">
            {radii.map((r) => (
              <Spec key={r.token} label={r.token} sublabel={r.value}>
                <div
                  className={`size-[112px] border-2 border-moss-500 bg-moss-50 ${r.className}`}
                />
              </Spec>
            ))}
          </div>
        </Section>
      </Frame>

      <FrameRow>
        <Frame name="Elevation" meta="box-shadow" width={860}>
          <Section title="Elevation">
            <div className="flex flex-wrap gap-10 rounded-[8px] bg-grey-50 p-10">
              {shadows.map((s) => (
                <Spec key={s.token} label={s.token} sublabel={s.note}>
                  <div className={`h-[96px] w-[150px] rounded-lg bg-white ${s.className}`} />
                </Spec>
              ))}
            </div>
          </Section>
        </Frame>

        <Frame name="Borders" meta="width · color" width={520}>
          <Section title="Borders">
            <div className="flex flex-col gap-8">
              <div className="flex gap-8">
                {borders.map((b) => (
                  <Spec key={b.token} label={b.token} sublabel={b.value}>
                    <div
                      className={`h-[72px] w-[120px] rounded-lg border-grey-900 bg-white ${b.className}`}
                    />
                  </Spec>
                ))}
              </div>
              <div className="flex gap-8">
                <Spec label="border-primary" sublabel="→ grey-100">
                  <div className="h-[72px] w-[120px] rounded-lg border-2 border-border-primary bg-white" />
                </Spec>
                <Spec label="border-secondary" sublabel="→ grey-300">
                  <div className="h-[72px] w-[120px] rounded-lg border-2 border-border-secondary bg-white" />
                </Spec>
              </div>
            </div>
          </Section>
        </Frame>
      </FrameRow>

      <Frame name="Spacing" meta="4px base unit">
        <Section
          title="Spacing"
          description="Padding, gaps and sizes follow a 4px grid. Custom steps (18 = 72px) extend it for navigation heights."
        >
          <div className="flex flex-col gap-3">
            {spacing.map((step) => (
              <div key={step} className="grid grid-cols-[80px_80px_1fr] items-center gap-4">
                <Caption>space-{step}</Caption>
                <Caption muted>{step * 4}px</Caption>
                <div className="h-4 rounded-sm bg-purple-300" style={{ width: step * 4 }} />
              </div>
            ))}
          </div>
        </Section>
      </Frame>
    </Canvas>
  ),
};
