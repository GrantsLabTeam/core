import type { Meta, StoryObj } from "@storybook/react";

import { CreateButton } from "@/components/CreateButton";
import { ShareButton } from "@/components/ShareButton";
import {
  Canvas,
  Caption,
  ComponentSet,
  Frame,
  FrameRow,
  Section,
  Spec,
  VariantGrid,
} from "@/design-system/_canvas";
import { Button } from "@/primitives/Button";
import { Icon, IconType } from "@/primitives/Icon";

const meta = {
  title: "Design System/Components/Buttons",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  tags: ["!autodocs"],
} satisfies Meta;

export default meta;

const variants = [
  "primary",
  "secondary",
  "grey",
  "subtle",
  "error",
  "success",
  "light-purple",
  "light-green",
  "outlined-primary",
  "outlined-secondary",
  "outlined-error",
  "outlined-success",
  "outlined-error-filled",
  "outlined-success-filled",
  "disabled",
  "outlined-disabled",
] as const;

const sizes = ["sm", "md", "lg"] as const;

const labels: Record<(typeof variants)[number], string> = {
  primary: "Approve application",
  secondary: "View round",
  grey: "Edit profile",
  subtle: "Cancel",
  error: "Reject application",
  success: "Approve application",
  "light-purple": "Add to ballot",
  "light-green": "Fund round",
  "outlined-primary": "Create round",
  "outlined-secondary": "View details",
  "outlined-error": "Reject",
  "outlined-success": "Approve",
  "outlined-error-filled": "Rejected",
  "outlined-success-filled": "Approved",
  disabled: "Submit ballot",
  "outlined-disabled": "Submit ballot",
};

const stateVariants = [
  "primary",
  "secondary",
  "grey",
  "error",
  "success",
  "outlined-primary",
  "outlined-error",
  "outlined-success",
] as const;

const states = ["default", "icon left", "icon right", "disabled"] as const;

const stateIcon: Record<(typeof stateVariants)[number], IconType> = {
  primary: IconType.CHECK,
  secondary: IconType.EXTERNAL_LINK,
  grey: IconType.PENCIL,
  error: IconType.X,
  success: IconType.CHECK,
  "outlined-primary": IconType.PLUS,
  "outlined-error": IconType.X,
  "outlined-success": IconType.CHECK,
};

export const Buttons: StoryObj = {
  render: () => (
    <Canvas
      eyebrow="Components"
      title="Buttons"
      description="Buttons trigger an action — approving an application, funding a round, submitting a ballot. Sixteen visual variants share one shape and three heights."
    >
      <Frame name="Button" meta="16 variants × 3 sizes">
        <Section
          title="Variants × sizes"
          description="Filled and outlined variants in three heights: 24, 32 and 40 px."
        >
          <ComponentSet>
            <VariantGrid
              corner="variant / size"
              rows={variants}
              columns={sizes}
              columnLabel={(s) => `size=${s}`}
              render={(variant, size) => (
                <Button variant={variant} size={size} value={labels[variant]} />
              )}
            />
          </ComponentSet>
        </Section>
      </Frame>

      <Frame name="Button / states" meta="icon & disabled">
        <Section
          title="States & icons"
          description="Icons sit 8 px from the label, on either side. Passing disabled collapses any filled variant to the neutral disabled style and any outlined variant to outlined-disabled."
        >
          <ComponentSet>
            <VariantGrid
              corner="variant / state"
              rows={stateVariants}
              columns={states}
              render={(variant, state) => {
                const icon = <Icon type={stateIcon[variant]} className="size-4" />;
                switch (state) {
                  case "icon left":
                    return <Button variant={variant} value={labels[variant]} icon={icon} />;
                  case "icon right":
                    return (
                      <Button
                        variant={variant}
                        value={labels[variant]}
                        icon={<Icon type={IconType.ARROW_RIGHT} className="size-4" />}
                        iconPosition="right"
                      />
                    );
                  case "disabled":
                    return <Button variant={variant} value={labels[variant]} disabled />;
                  default:
                    return <Button variant={variant} value={labels[variant]} />;
                }
              }}
            />
          </ComponentSet>
        </Section>
        <Section title="Icon only" description="An icon without a label, for dense toolbars.">
          <ComponentSet>
            <div className="flex items-end gap-10">
              {(["primary", "secondary", "grey", "outlined-primary"] as const).map((v) => (
                <Spec key={v} label={v} sublabel="size=md">
                  <Button
                    variant={v}
                    aria-label="Copy link"
                    icon={<Icon type={IconType.LINK} className="size-4" />}
                  />
                </Spec>
              ))}
            </div>
          </ComponentSet>
        </Section>
      </Frame>

      <FrameRow>
        <Frame name="CreateButton" meta="program · round" width={640}>
          <Section
            title="Create button"
            description="A large call-to-action tile used at the top of program and round lists."
          >
            <ComponentSet className="w-full">
              <div className="flex flex-col gap-6">
                <Spec label="variant=program">
                  <CreateButton variant="program">Create new program</CreateButton>
                </Spec>
                <Spec label="variant=round">
                  <CreateButton variant="round">Create new round</CreateButton>
                </Spec>
              </div>
            </ComponentSet>
          </Section>
        </Frame>
        <Frame name="ShareButton" meta="trigger" width={400}>
          <Section
            title="Share button"
            description="Opens a dialog to share a round's stats on X or Warpcast."
          >
            <ComponentSet>
              <Spec label="default" sublabel="opens share dialog">
                <ShareButton shareText="I just funded 12 projects in Gitcoin Grants Round 22!" />
              </Spec>
            </ComponentSet>
          </Section>
        </Frame>
      </FrameRow>

      <Caption muted>
        Hover and focus states are produced by the browser (90% opacity on hover, 2 px black focus
        ring) and are not drawn on this page.
      </Caption>
    </Canvas>
  ),
};
