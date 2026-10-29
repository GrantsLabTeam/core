import { grantsStackDesignSystem, grantsStackUIKit } from "@gitcoin/themes/colors";
import type { Meta, StoryObj } from "@storybook/react";

import { Canvas, Caption, Frame, Section } from "@/design-system/_canvas";
import { cn } from "@/lib/utils";

import {
  contrastRatio,
  onColor,
  primitiveCountWithBase,
  Scale,
  scaleNames,
  scales,
  tokenNameForHex,
  wcagLevel,
} from "./colorUtils";

const meta = {
  title: "Design System/Foundations/Color",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  tags: ["!autodocs"],
} satisfies Meta;

export default meta;

const scaleRoles: Record<(typeof scaleNames)[number], string> = {
  grey: "Neutrals · text, surfaces, borders",
  moss: "Primary · buttons, checkboxes, progress",
  blue: "Pool status and type badges",
  green: "Success · approved states",
  red: "Error · rejected states, validation",
  yellow: "Pending · review states, info badges",
  purple: "Accent · Retrofunding, staking, toggles",
};

const Swatch = ({ name, shade, hex }: { name: string; shade: string; hex: string }) => (
  <div className="flex w-[132px] flex-col">
    <div
      className="flex h-[88px] items-end rounded-t-[8px] border border-b-0 border-black/5 p-3"
      style={{ backgroundColor: hex, color: onColor(hex) }}
    >
      <span className="font-ui-mono text-[13px] font-medium">{shade}</span>
    </div>
    <div className="flex flex-col gap-0.5 rounded-b-[8px] border border-t-0 border-grey-100 px-3 py-2">
      <Caption>
        {name}-{shade}
      </Caption>
      <Caption muted>{hex.toUpperCase()}</Caption>
    </div>
  </div>
);

const ScaleRow = ({ name, scale, role }: { name: string; scale: Scale; role?: string }) => (
  <div className="flex items-start gap-8">
    <div className="w-[180px] pt-2">
      <div className="text-[16px] font-semibold capitalize">{name.replace("legacy-", "")}</div>
      {role && <div className="mt-1 text-[13px] leading-[18px] text-grey-500">{role}</div>}
    </div>
    <div className="flex gap-3">
      {Object.entries(scale).map(([shade, hex]) => (
        <Swatch key={shade} name={name} shade={shade} hex={hex} />
      ))}
    </div>
  </div>
);

const semanticGroups = ["text", "background", "border"] as const;

const SemanticToken = ({ group, role, hex }: { group: string; role: string; hex: string }) => {
  const alias = tokenNameForHex(hex);
  return (
    <div className="flex items-center gap-4 rounded-[8px] border border-grey-100 p-3 pr-6">
      <div
        className="size-12 shrink-0 rounded-[6px] border border-grey-100"
        style={{ backgroundColor: hex }}
      />
      <div className="flex flex-col">
        <span className="text-[14px] font-medium">
          {group}-{role}
        </span>
        <Caption muted>
          → {alias ?? "—"} · {hex.toUpperCase()}
        </Caption>
      </div>
    </div>
  );
};

const levelStyles: Record<string, string> = {
  AAA: "bg-moss-100 text-moss-900",
  AA: "bg-green-100 text-green-900",
  "AA Large": "bg-yellow-100 text-yellow-900",
  Fail: "bg-red-100 text-red-900",
};

const ui = grantsStackUIKit as Record<string, Scale>;
const textTokens = Object.entries(ui.text).filter(([role]) => role !== "white");
const backgroundTokens = Object.entries(ui.background);

const legacy = grantsStackDesignSystem as Record<string, Scale>;
const legacyPairs: [string, (typeof scaleNames)[number], string][] = [
  ["legacy-grey", "grey", "6 legacy greys → 6-step neutral scale"],
  ["legacy-green", "moss", "4 legacy greens → 6-step Moss primary scale"],
  ["legacy-orange", "red", "4 legacy oranges → 6-step Red scale"],
  ["legacy-yellow", "yellow", "3 legacy yellows → 6-step Yellow scale"],
  ["legacy-blue", "blue", "5 legacy blues → 6-step Blue scale"],
];

export const Color: StoryObj = {
  render: () => (
    <Canvas
      eyebrow="Foundations"
      title="Color"
      description="A primitive palette of seven 50–900 scales, mapped to semantic tokens for text, surfaces and borders. Every value below is read live from @gitcoin/themes, the package all Gitcoin apps consume."
    >
      <Frame
        name="Primitives"
        meta={`${scaleNames.length} scales · ${primitiveCountWithBase} tokens`}
      >
        <Section
          title="Primitive palette"
          description="Base colours. Components never use these directly for text or surfaces. They go through the semantic tokens, so the palette can evolve without touching components."
        >
          <div className="flex flex-col gap-8">
            {scaleNames.map((name) => (
              <ScaleRow key={name} name={name} scale={scales[name]} role={scaleRoles[name]} />
            ))}
            <div className="flex items-start gap-8">
              <div className="w-[180px] pt-2 text-[16px] font-semibold">Base</div>
              <div className="flex gap-3">
                <Swatch name="color" shade="black" hex="#000000" />
                <Swatch name="color" shade="white" hex="#FFFFFF" />
              </div>
            </div>
          </div>
        </Section>
      </Frame>

      <Frame name="Semantic tokens" meta="text · background · border">
        <Section
          title="Semantic tokens"
          description="Purpose-named aliases that components consume. Each one points at a primitive."
        >
          <div className="grid grid-cols-3 gap-10">
            {semanticGroups.map((group) => (
              <div key={group} className="flex flex-col gap-3">
                <div className="mb-1 text-[16px] font-semibold capitalize">{group}</div>
                {Object.entries(ui[group]).map(([role, hex]) => (
                  <SemanticToken key={role} group={group} role={role} hex={hex} />
                ))}
              </div>
            ))}
          </div>
        </Section>
      </Frame>

      <Frame name="Accessibility" meta="WCAG 2.1 contrast">
        <Section
          title="Text contrast"
          description="Every text token checked against every background token, calculated live. Primary and secondary text pass AA on every surface, and AAA on most. Tertiary falls below 3:1, so it suits placeholders and disabled states, not essential text."
        >
          <div className="grid grid-cols-3 gap-6">
            {backgroundTokens.map(([bgRole, bg]) => (
              <div key={bgRole} className="overflow-hidden rounded-[8px] border border-grey-100">
                <div className="border-b border-grey-100 px-4 py-2">
                  <Caption muted>
                    on background-{bgRole} · {bg.toUpperCase()}
                  </Caption>
                </div>
                <div className="flex flex-col gap-4 p-5" style={{ backgroundColor: bg }}>
                  {textTokens.map(([textRole, fg]) => {
                    const ratio = contrastRatio(fg, bg);
                    const level = wcagLevel(ratio);
                    return (
                      <div key={textRole} className="flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                          <span className="text-[18px] font-medium" style={{ color: fg }}>
                            Aa {textRole}
                          </span>
                          <Caption muted>
                            text-{textRole} · {ratio.toFixed(2)}:1
                          </Caption>
                        </div>
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 font-ui-mono text-[11px] font-medium",
                            levelStyles[level],
                          )}
                        >
                          {level}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Section>
      </Frame>

      <Frame name="Evolution" meta="Grants Stack → Gitcoin Core">
        <Section
          title="From the legacy palette to the new system"
          description="The Grants Stack palette next to the Gitcoin Core scales that replace it. Legacy tokens are still shipped under legacy-* so older screens keep working during migration."
        >
          <div className="flex flex-col gap-10">
            {legacyPairs.map(([legacyName, nextName, note]) => (
              <div key={legacyName} className="flex items-start gap-8">
                <div className="w-[220px] pt-1">
                  <div className="text-[16px] font-semibold capitalize">
                    {legacyName.replace("legacy-", "")} → {nextName}
                  </div>
                  <div className="mt-1 text-[13px] leading-[18px] text-grey-500">{note}</div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Caption muted className="w-[56px]">
                      Before
                    </Caption>
                    {Object.entries(legacy[legacyName]).map(([shade, hex]) => (
                      <div key={shade} className="flex w-[96px] flex-col gap-1">
                        <div className="h-[44px] rounded-[6px]" style={{ backgroundColor: hex }} />
                        <Caption muted>{hex.toUpperCase()}</Caption>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <Caption className="w-[56px]">After</Caption>
                    {Object.entries(scales[nextName]).map(([shade, hex]) => (
                      <div key={shade} className="flex w-[96px] flex-col gap-1">
                        <div className="h-[44px] rounded-[6px]" style={{ backgroundColor: hex }} />
                        <Caption>
                          {shade} · {hex.toUpperCase()}
                        </Caption>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </Frame>
    </Canvas>
  ),
};
