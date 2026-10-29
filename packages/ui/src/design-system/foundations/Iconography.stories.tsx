import type { Meta, StoryObj } from "@storybook/react";

import { customIcons, heroIcons, networkIcons, socialMediaIcons } from "@/assets/icons";
import { Canvas, Caption, Frame, FrameRow, Section, Spec } from "@/design-system/_canvas";
import { Icon, IconType } from "@/primitives/Icon";

const meta = {
  title: "Design System/Foundations/Iconography",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  tags: ["!autodocs"],
} satisfies Meta;

export default meta;

const IconTile = ({ type }: { type: string }) => (
  <div className="flex h-[104px] w-[112px] flex-col items-center justify-center gap-3 rounded-[8px] border border-grey-100">
    <Icon type={type as IconType} className="size-6" />
    <Caption muted className="max-w-[96px] truncate">
      {type}
    </Caption>
  </div>
);

const IconSet = ({
  title,
  description,
  types,
}: {
  title: string;
  description: string;
  types: string[];
}) => (
  <Section title={title} description={description}>
    <div className="flex flex-wrap gap-3">
      {types.map((type) => (
        <IconTile key={type} type={type} />
      ))}
    </div>
  </Section>
);

const sizes = [
  { px: 16, className: "size-4" },
  { px: 20, className: "size-5" },
  { px: 24, className: "size-6" },
  { px: 32, className: "size-8" },
];

const tints = [
  { token: "black", className: "text-black" },
  { token: "grey-500", className: "text-grey-500" },
  { token: "moss-700", className: "text-moss-700" },
  { token: "purple-500", className: "text-purple-500" },
  { token: "red-700", className: "text-red-700" },
];

const total = heroIcons.length + customIcons.length + networkIcons.length + socialMediaIcons.length;

export const Iconography: StoryObj = {
  render: () => (
    <Canvas
      eyebrow="Foundations"
      title="Iconography"
      description={`${total} icons in four sets, all available through a single <Icon type="…" /> component. Interface icons are Heroicons; product, chain and social marks are custom.`}
    >
      <FrameRow>
        <Frame name="Sizes" meta="default size-5 · 20px" width={560}>
          <Section title="Sizes">
            <div className="flex items-end gap-10">
              {sizes.map((s) => (
                <Spec key={s.px} label={`${s.px}px`} sublabel={s.className}>
                  <Icon type={IconType.SPARKLES} className={s.className} />
                </Spec>
              ))}
            </div>
          </Section>
        </Frame>
        <Frame name="Color" meta="icons inherit currentColor" width={640}>
          <Section title="Color">
            <div className="flex items-end gap-10">
              {tints.map((t) => (
                <Spec key={t.token} label={t.token}>
                  <Icon type={IconType.CHECK} className={`size-8 ${t.className}`} />
                </Spec>
              ))}
            </div>
          </Section>
        </Frame>
      </FrameRow>

      <Frame name="Interface" meta={`Heroicons · ${heroIcons.length}`}>
        <IconSet
          title="Interface icons"
          description="Outline and solid Heroicons for actions, navigation and status."
          types={heroIcons}
        />
      </Frame>

      <Frame name="Custom" meta={`${customIcons.length} icons`}>
        <IconSet
          title="Custom icons"
          description="Product marks and editor controls drawn for Gitcoin."
          types={customIcons}
        />
      </Frame>

      <FrameRow>
        <Frame name="Networks" meta={`${networkIcons.length} chains`} width={880}>
          <IconSet
            title="Networks"
            description="Chains a funding round can run on."
            types={networkIcons}
          />
        </Frame>
        <Frame name="Social" meta={`${socialMediaIcons.length} platforms`} width={520}>
          <IconSet
            title="Social"
            description="Project links on profiles and cards."
            types={socialMediaIcons}
          />
        </Frame>
      </FrameRow>
    </Canvas>
  ),
};
