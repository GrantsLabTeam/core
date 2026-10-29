import type { Meta, StoryObj } from "@storybook/react";

import { customIcons, heroIcons, networkIcons, socialMediaIcons } from "@/assets/icons";
import {
  BuilderLogoColor,
  ExplorerLogoColor,
  GitcoinLogo,
  GrantsStackLogoColor,
  ManagerLogoColor,
  RetrofundingLogoLockup,
} from "@/assets/logos";
import { Caption } from "@/design-system/_canvas";

import pkg from "../../package.json";
import { primitiveCountWithBase } from "./foundations/colorUtils";

const meta = {
  title: "Design System/Cover",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  tags: ["!autodocs"],
} satisfies Meta;

export default meta;

// Counted from the source tree at build time, so the cover stays accurate.
const primitives = Object.keys(import.meta.glob("../primitives/*/index.ts")).length;
const components = Object.keys(import.meta.glob("../components/*/index.ts")).length;
const featureComponents = Object.keys(
  import.meta.glob("../features/*/components/*/index.ts"),
).length;
const iconCount =
  heroIcons.length + customIcons.length + networkIcons.length + socialMediaIcons.length;

const stats = [
  { value: primitives, label: "Primitives" },
  { value: components + featureComponents, label: "Components & patterns" },
  { value: primitiveCountWithBase, label: "Color tokens" },
  { value: iconCount, label: "Icons" },
  { value: 2, label: "Typefaces" },
];

const contents = [
  {
    section: "01",
    title: "Foundations",
    items: "Color · Typography · Shape & Elevation · Iconography · Brand",
  },
  { section: "02", title: "Components", items: "Every variant, size and state of the core UI kit" },
  {
    section: "03",
    title: "Patterns & Screens",
    items: "Retrofunding, Checker, pools, programs and projects",
  },
];

const productLogos = [
  { name: "Grants Stack", Logo: GrantsStackLogoColor },
  { name: "Manager", Logo: ManagerLogoColor },
  { name: "Builder", Logo: BuilderLogoColor },
  { name: "Explorer", Logo: ExplorerLogoColor },
];

export const Cover: StoryObj = {
  render: () => (
    <div className="min-h-screen bg-[#E9E9E9] p-16">
      <div className="mx-auto max-w-[1440px] overflow-hidden rounded-[4px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <div className="relative overflow-hidden bg-moss-900 px-20 pb-20 pt-16 text-white">
          <div
            className="pointer-events-none absolute -right-40 -top-40 size-[640px] rounded-full opacity-40 blur-3xl"
            style={{ background: "radial-gradient(circle, #7D67EB 0%, rgba(125,103,235,0) 70%)" }}
          />
          <div
            className="pointer-events-none absolute -bottom-56 right-80 size-[520px] rounded-full opacity-40 blur-3xl"
            style={{ background: "radial-gradient(circle, #78D0BC 0%, rgba(120,208,188,0) 70%)" }}
          />
          <div className="relative flex items-center gap-4">
            <GitcoinLogo className="h-10 w-auto [&_path]:fill-white" />
            <span className="font-ui-mono text-[14px] uppercase tracking-[0.16em] text-moss-100">
              Gitcoin Core
            </span>
          </div>
          <h1 className="relative mt-24 max-w-[900px] text-[96px] font-semibold leading-[96px] tracking-[-0.03em]">
            Design System
          </h1>
          <p className="relative mt-8 max-w-[720px] text-[22px] leading-[34px] text-moss-100">
            One shared language for the products that fund public goods: Grants Stack, Manager,
            Builder, Explorer, Checker and Retrofunding.
          </p>
          <div className="relative mt-16 flex gap-3 text-[13px] text-moss-100 [&>span]:font-ui-mono">
            <span className="rounded-full border border-moss-500 px-4 py-1.5">v{pkg.version}</span>
            <span className="rounded-full border border-moss-500 px-4 py-1.5">
              React · Tailwind
            </span>
            <span className="rounded-full border border-moss-500 px-4 py-1.5">@gitcoin/ui</span>
          </div>
        </div>

        <div className="grid grid-cols-5 border-b border-grey-100">
          {stats.map((s) => (
            <div key={s.label} className="border-r border-grey-100 px-10 py-10 last:border-r-0">
              <div className="text-[48px] font-semibold leading-[56px] tracking-[-0.02em]">
                {s.value}
              </div>
              <Caption muted className="mt-1 block text-[13px]">
                {s.label}
              </Caption>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_1fr] gap-20 px-20 py-16">
          <div>
            <Caption muted className="text-[12px] uppercase tracking-[0.12em]">
              Contents
            </Caption>
            <div className="mt-6 flex flex-col">
              {contents.map((c) => (
                <div key={c.section} className="flex gap-6 border-t border-grey-100 py-6">
                  <span className="font-ui-mono text-[14px] text-grey-500">{c.section}</span>
                  <div>
                    <div className="text-[22px] font-semibold">{c.title}</div>
                    <div className="mt-1 text-[14px] text-grey-900">{c.items}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Caption muted className="text-[12px] uppercase tracking-[0.12em]">
              Product family
            </Caption>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {productLogos.map(({ name, Logo }) => (
                <div
                  key={name}
                  className="flex h-[132px] flex-col items-center justify-center gap-3 rounded-[8px] bg-grey-50"
                >
                  <Logo className="h-12 w-auto" />
                  <Caption muted>{name}</Caption>
                </div>
              ))}
              <div className="col-span-2 flex h-[132px] items-center justify-center rounded-[8px] bg-purple-50">
                <RetrofundingLogoLockup className="h-10 w-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
