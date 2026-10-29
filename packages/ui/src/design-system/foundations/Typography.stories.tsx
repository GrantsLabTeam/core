import type { Meta, StoryObj } from "@storybook/react";

import { Canvas, Caption, Frame, FrameRow, Section } from "@/design-system/_canvas";
import { cn } from "@/lib/utils";

const meta = {
  title: "Design System/Foundations/Typography",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  tags: ["!autodocs"],
} satisfies Meta;

export default meta;

interface TypeStyle {
  token: string;
  role: string;
  size: number;
  lineHeight: number;
  weight: number;
  className: string;
  sample: string;
}

// Sizes and line heights are the Tailwind tokens the components use (text-*),
// plus the two custom styles defined in @gitcoin/themes (text-p, text-body).
const sansScale: TypeStyle[] = [
  {
    token: "text-5xl",
    role: "Display",
    size: 48,
    lineHeight: 48,
    weight: 700,
    className: "text-5xl font-bold",
    sample: "Fund what matters",
  },
  {
    token: "text-3xl",
    role: "Heading 1",
    size: 30,
    lineHeight: 36,
    weight: 600,
    className: "text-3xl font-semibold",
    sample: "Gitcoin Grants Round 22",
  },
  {
    token: "text-2xl",
    role: "Heading 2",
    size: 24,
    lineHeight: 32,
    weight: 600,
    className: "text-2xl font-semibold",
    sample: "Review applications",
  },
  {
    token: "text-xl",
    role: "Heading 3",
    size: 20,
    lineHeight: 28,
    weight: 600,
    className: "text-xl font-semibold",
    sample: "Open Source Software round",
  },
  {
    token: "text-lg",
    role: "Subtitle",
    size: 18,
    lineHeight: 28,
    weight: 500,
    className: "text-lg font-medium",
    sample: "Matching pool of 500,000 DAI",
  },
  {
    token: "text-p",
    role: "Paragraph",
    size: 16,
    lineHeight: 28,
    weight: 400,
    className: "text-p",
    sample: "Projects apply, the community donates, and matching funds amplify every contribution.",
  },
  {
    token: "text-base",
    role: "Body large",
    size: 16,
    lineHeight: 24,
    weight: 400,
    className: "text-base",
    sample: "Applications close on 14 November at 23:59 UTC.",
  },
  {
    token: "text-body",
    role: "Body",
    size: 14,
    lineHeight: 24,
    weight: 400,
    className: "text-body",
    sample: "Evaluate each project against the round's eligibility criteria before approving.",
  },
  {
    token: "text-sm",
    role: "Body small",
    size: 14,
    lineHeight: 20,
    weight: 400,
    className: "text-sm",
    sample: "128 applications · 42 pending review",
  },
  {
    token: "text-xs",
    role: "Caption",
    size: 12,
    lineHeight: 16,
    weight: 400,
    className: "text-xs",
    sample: "Last updated 3 hours ago",
  },
];

const monoStyles: TypeStyle[] = [
  {
    token: "Button label",
    role: "font-ui-mono · medium",
    size: 14,
    lineHeight: 16,
    weight: 500,
    className: "font-ui-mono text-[14px] font-medium leading-[16px]",
    sample: "Approve application",
  },
  {
    token: "Badge label",
    role: "font-ui-mono · regular",
    size: 12,
    lineHeight: 18,
    weight: 400,
    className: "font-ui-mono text-[12px] leading-[18px]",
    sample: "Pending review",
  },
  {
    token: "Data",
    role: "font-ui-mono · regular",
    size: 16,
    lineHeight: 24,
    weight: 400,
    className: "font-ui-mono text-base",
    sample: "0x5f4e…3a9c · 12,480.50 DAI",
  },
];

const weightName: Record<number, string> = {
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "Semibold",
  700: "Bold",
};

const TypeRow = ({ style, mono }: { style: TypeStyle; mono?: boolean }) => (
  <div className="grid grid-cols-[200px_180px_1fr] items-baseline gap-8 border-t border-grey-100 py-6 first:border-t-0">
    <div className="flex flex-col gap-1">
      <span className="text-[14px] font-semibold">{mono ? style.token : style.role}</span>
      <Caption muted>{mono ? style.role : style.token}</Caption>
    </div>
    <div className="flex flex-col gap-1">
      <Caption>
        {style.size} / {style.lineHeight}
      </Caption>
      <Caption muted>
        {weightName[style.weight]} · {style.weight}
      </Caption>
    </div>
    <div className={cn("truncate", style.className, mono ? "font-ui-mono" : "font-ui-sans")}>
      {style.sample}
    </div>
  </div>
);

const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ\nabcdefghijklmnopqrstuvwxyz\n0123456789 !?&@#$%(){}[]";

const Specimen = ({
  family,
  className,
  weights,
  note,
}: {
  family: string;
  className: string;
  weights: number[];
  note: string;
}) => (
  <Frame name={family} meta="Typeface" width={640}>
    <div>
      <div className={cn("text-[140px] font-medium leading-[1] tracking-[-0.03em]", className)}>
        Aa
      </div>
      <div className={cn("mt-6 text-[28px] font-semibold", className)}>{family}</div>
      <p className="mt-2 max-w-[480px] font-ui-sans text-[14px] leading-[22px] text-grey-900">
        {note}
      </p>
      <pre
        className={cn(
          "mt-8 whitespace-pre-wrap text-[18px] leading-[30px] text-grey-900",
          className,
        )}
      >
        {glyphs}
      </pre>
      <div className="mt-8 flex flex-col gap-3 border-t border-grey-100 pt-6">
        {weights.map((w) => (
          <div key={w} className="flex items-baseline justify-between">
            <span className={cn("text-[22px]", className)} style={{ fontWeight: w }}>
              The quick brown fox jumps
            </span>
            <Caption muted>
              {weightName[w]} {w}
            </Caption>
          </div>
        ))}
      </div>
    </div>
  </Frame>
);

export const Typography: StoryObj = {
  render: () => (
    <Canvas
      eyebrow="Foundations"
      title="Typography"
      description="Two typefaces from one family: DM Sans for content and DM Mono for interface labels and data. Buttons, badges, tabs and stat values are set in Mono."
    >
      <FrameRow>
        <Specimen
          family="DM Sans"
          className="font-ui-sans"
          weights={[400, 500, 600, 700]}
          note="Primary typeface for headings, body copy and long-form content. Shipped as a variable font (100–1000)."
        />
        <Specimen
          family="DM Mono"
          className="font-ui-mono"
          weights={[300, 400, 500]}
          note="Secondary typeface for buttons, badges, navigation labels, addresses and figures. Shipped in Light, Regular and Medium."
        />
      </FrameRow>

      <Frame name="Type scale" meta="DM Sans · size / line height in px">
        <Section
          title="Type scale"
          description="The text styles used across the components, from display headlines to captions."
        >
          <div>
            {sansScale.map((style) => (
              <TypeRow key={style.token} style={style} />
            ))}
          </div>
        </Section>
      </Frame>

      <Frame name="Interface type" meta="DM Mono">
        <Section
          title="Interface type"
          description="Labels set in DM Mono read as controls and data, separate from the surrounding content."
        >
          <div>
            {monoStyles.map((style) => (
              <TypeRow key={style.token} style={style} mono />
            ))}
          </div>
        </Section>
      </Frame>
    </Canvas>
  ),
};
