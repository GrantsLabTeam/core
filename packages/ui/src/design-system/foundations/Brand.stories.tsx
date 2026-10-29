import type { Meta, StoryObj } from "@storybook/react";

import * as logos from "@/assets/logos";
import { Canvas, Caption, Frame } from "@/design-system/_canvas";
import { cn } from "@/lib/utils";

const meta = {
  title: "Design System/Foundations/Brand",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  tags: ["!autodocs"],
} satisfies Meta;

export default meta;

type Logo = React.FC<React.SVGProps<SVGSVGElement>>;

const products = [
  { key: "Gitcoin", name: "Gitcoin", description: "Parent brand mark." },
  {
    key: "GrantsStack",
    name: "Grants Stack",
    description: "The protocol-powered suite for running grant programs.",
  },
  { key: "Manager", name: "Manager", description: "Create and operate funding rounds." },
  { key: "Builder", name: "Builder", description: "Projects create profiles and apply to rounds." },
  { key: "Explorer", name: "Explorer", description: "Donors discover and fund projects." },
  {
    key: "Retrofunding",
    name: "Retrofunding",
    description: "Retroactive funding: vote on impact metrics.",
  },
];

// Groups every exported logo by product, e.g. "BuilderLogoLockupColor" -> Builder / "Lockup Color".
const logosFor = (key: string) =>
  Object.entries(logos as Record<string, Logo>)
    .filter(([name]) => name.startsWith(key))
    .map(([name, Component]) => {
      const variant = name
        .slice(key.length)
        .replace("Logo", "")
        .replace(/([A-Z])/g, " $1")
        .trim();
      return { name, variant: variant || "Mark", Component };
    })
    .sort((a, b) => order(a.variant) - order(b.variant) || a.variant.localeCompare(b.variant));

const order = (variant: string) => {
  if (variant.startsWith("Lockup")) return 1;
  if (variant.includes("Wordmark")) return 2;
  return 0;
};

const isWide = (variant: string) => variant.startsWith("Lockup") || variant.includes("Wordmark");

const LogoTile = ({ variant, Component }: { variant: string; Component: Logo }) => (
  <div className="flex flex-col gap-2">
    <div
      className={cn(
        "flex h-[160px] items-center justify-center rounded-[8px] border",
        isWide(variant) ? "w-[320px]" : "w-[160px]",
        "border-grey-100 bg-white",
      )}
    >
      <Component
        className={cn("w-auto", isWide(variant) ? "h-[56px] max-w-[260px]" : "h-[72px]")}
      />
    </div>
    <Caption>{variant}</Caption>
  </div>
);

export const Brand: StoryObj = {
  render: () => (
    <Canvas
      eyebrow="Foundations"
      title="Brand"
      description="One logo system across the Gitcoin product family. Grants Stack, Manager, Builder and Explorer share the same structure: a mark, a lockup and a wordmark, in monochrome, colour, light colour and gradient versions."
    >
      {products.map((p) => {
        const items = logosFor(p.key);
        return (
          <Frame key={p.key} name={p.name} meta={`${items.length} variants`}>
            <div className="mb-8 flex items-baseline gap-4">
              <h2 className="text-[24px] font-semibold">{p.name}</h2>
              <span className="text-[14px] text-grey-900">{p.description}</span>
            </div>
            <div className="flex flex-wrap gap-5">
              {items.map(({ name, variant, Component }) => (
                <LogoTile key={name} variant={variant} Component={Component} />
              ))}
            </div>
          </Frame>
        );
      })}
    </Canvas>
  ),
};
