import * as React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/test";

import { DefaultBanner } from "@/assets";
import { MultipleSelect } from "@/components/MultipleSelect";
import type { MultipleSelectGroup } from "@/components/MultipleSelect";
import { RadioGroupList } from "@/components/RadioGroupList";
import {
  Canvas,
  ComponentSet,
  Frame,
  FrameRow,
  Section,
  Spec,
  VariantGrid,
} from "@/design-system/_canvas";
import { Checkbox } from "@/primitives/Checkbox";
import { FileUpload } from "@/primitives/FileUpload";
import { Input } from "@/primitives/Input";
import { Label } from "@/primitives/Label";
import { RadioGroup, RadioGroupItem } from "@/primitives/RadioGroup";
import { Select } from "@/primitives/Select";
import { Switch } from "@/primitives/Switch";
import { TextArea } from "@/primitives/TextArea";

import { Fixed, SpecGrid, Surface } from "./_helpers";

const meta = {
  title: "Design System/Components/Form Controls",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  tags: ["!autodocs"],
} satisfies Meta;

export default meta;

const noop = () => undefined;

/* ----------------------------------------------------------------------------------------------
   Mock content
---------------------------------------------------------------------------------------------- */

const networkOptions = [
  {
    items: [
      { label: "Ethereum", value: "1" },
      { label: "Optimism", value: "10" },
      { label: "Arbitrum", value: "42161" },
      { label: "Polygon", value: "137" },
    ],
  },
];

const filterOptions: MultipleSelectGroup[] = [
  {
    multiple: false,
    items: [{ label: "All", value: "All-id", exclusive: true, exclusiveScope: "global" }],
  },
  {
    groupLabel: "Network",
    multiple: true,
    collapsible: true,
    items: [
      { label: "Rounds on Ethereum", value: "1" },
      { label: "Rounds on Polygon", value: "137" },
      { label: "Rounds on Optimism", value: "10" },
    ],
  },
  {
    groupLabel: "Status",
    multiple: true,
    collapsible: true,
    items: [
      { label: "Active", value: "active" },
      { label: "Taking applications", value: "applications" },
      { label: "Finished", value: "finished" },
    ],
  },
];

const orderOptions: MultipleSelectGroup[] = [
  {
    groupLabel: "ORDER BY TIME",
    multiple: false,
    items: ["Recent", "Oldest"].map((value) => ({
      label: value,
      value,
      exclusive: true,
      exclusiveScope: "global" as const,
    })),
  },
  {
    groupLabel: "ORDER BY NAME",
    multiple: false,
    items: ["A-Z", "Z-A"].map((value) => ({
      label: value,
      value,
      exclusive: true,
      exclusiveScope: "global" as const,
    })),
  },
];

const checkboxColors = ["moss", "black", "purple", "white"] as const;
const checkboxStates = ["unchecked", "checked", "disabled", "disabled checked"] as const;
const checkboxSizes = ["sm", "md", "lg"] as const;
const switchColors = ["moss", "black", "purple", "white"] as const;
const switchStates = ["off", "on", "disabled off", "disabled on"] as const;
const selectVariants = ["default", "outlined", "filled"] as const;
const selectStates = ["placeholder", "selected", "disabled"] as const;

/** FileUpload with a real image loaded as its value, to show the preview state. */
const FileUploadWithPreview = () => {
  const [file, setFile] = React.useState<Blob | null>(null);
  React.useEffect(() => {
    let cancelled = false;
    fetch(DefaultBanner)
      .then((r) => r.blob())
      .then((blob) => !cancelled && setFile(blob))
      .catch(noop);
    return () => {
      cancelled = true;
    };
  }, []);
  return <FileUpload value={file} />;
};

/* ----------------------------------------------------------------------------------------------
   Page
---------------------------------------------------------------------------------------------- */

export const FormControls: StoryObj = {
  name: "Form Controls",
  render: () => (
    <Canvas
      eyebrow="Components"
      title="Form Controls"
      description="The inputs used to create rounds, apply for funding and review applications. Every control shares a 6 px radius, a grey-100 hairline and a muted disabled treatment."
    >
      <Frame name="Input & TextArea" meta="default · filled · disabled">
        <Section
          title="Text fields"
          description="Inputs are 40 px tall and fill their container. The placeholder hints at the expected format; disabled fields switch to a grey fill."
        >
          <ComponentSet>
            <VariantGrid
              corner="component / state"
              rows={["Input", "Label + Input"] as const}
              columns={["default", "filled", "disabled"] as const}
              render={(row, state) => {
                const input = (
                  <Input
                    id={`round-name-${row}-${state}`}
                    placeholder="e.g. Gitcoin Grants Round 22"
                    defaultValue={state === "default" ? undefined : "Gitcoin Grants Round 22"}
                    disabled={state === "disabled"}
                    readOnly={state !== "default"}
                  />
                );
                return (
                  <Fixed width={300}>
                    {row === "Input" ? (
                      input
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Label htmlFor={`round-name-${row}-${state}`}>Round name</Label>
                        {input}
                      </div>
                    )}
                  </Fixed>
                );
              }}
            />
          </ComponentSet>
        </Section>

        <Section
          title="TextArea"
          description="Five heights, from a one-line note (xs) to a long project description (xl). An optional heading renders above the field."
        >
          <ComponentSet>
            <SpecGrid columns={3}>
              {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
                <Spec key={size} label={`size=${size}`}>
                  <Fixed width={300}>
                    <TextArea
                      size={size}
                      placeholder="Describe what your project will build with this grant…"
                    />
                  </Fixed>
                </Spec>
              ))}
              <Spec label="heading + filled" sublabel="size=md">
                <Fixed width={300}>
                  <TextArea
                    size="md"
                    heading="Review feedback"
                    readOnly
                    defaultValue="Clear milestones and an active GitHub. Approving for Gitcoin Grants Round 22."
                  />
                </Fixed>
              </Spec>
            </SpecGrid>
            <div className="mt-8">
              <Spec label="disabled" sublabel="size=sm">
                <Fixed width={300}>
                  <TextArea size="sm" disabled defaultValue="Applications are closed." />
                </Fixed>
              </Spec>
            </div>
          </ComponentSet>
        </Section>
      </Frame>

      <Frame name="Select" meta="3 variants × 3 states · 2 sizes">
        <Section
          title="Select"
          description="A single-choice dropdown. The default trigger is white with no border, so it is shown here on a grey-50 stage — the surface it normally sits on."
        >
          <ComponentSet>
            <Surface>
              <VariantGrid
                corner="variant / state"
                rows={selectVariants}
                columns={selectStates}
                render={(variant, state) => (
                  <Fixed width={200}>
                    <Select
                      variant={variant}
                      options={networkOptions}
                      placeholder="Select network"
                      defaultValue={state === "placeholder" ? undefined : "10"}
                      disabled={state === "disabled"}
                    />
                  </Fixed>
                )}
              />
            </Surface>
            <div className="mt-8 flex items-start gap-10">
              <Spec label="size=sm">
                <Surface className="p-4">
                  <Select size="sm" options={networkOptions} defaultValue="1" />
                </Surface>
              </Spec>
              <Spec label="size=md">
                <Surface className="p-4">
                  <Select size="md" options={networkOptions} defaultValue="1" />
                </Surface>
              </Spec>
            </div>
          </ComponentSet>
        </Section>

        <Section
          title="MultipleSelect"
          description="Filter and sort menus with grouped, collapsible options. Exclusive items (like “All”) reset the rest of the selection."
        >
          <ComponentSet>
            <div className="flex items-start gap-16 pb-[280px]">
              <Spec label="filter" sublabel="default selection">
                <Fixed width={256}>
                  <MultipleSelect
                    options={filterOptions}
                    defaultValue={{ ungrouped: ["All-id"] }}
                    variants={{ triggerTextColor: "red" }}
                    placeholder="Filter by"
                    className="w-64"
                    onChange={noop}
                  />
                </Fixed>
              </Spec>
              <Spec label="order by" sublabel="triggerTextColor=green">
                <Fixed width={160}>
                  <MultipleSelect
                    options={orderOptions}
                    defaultValue={{ "ORDER BY TIME": ["Recent"] }}
                    variants={{
                      triggerTextColor: "green",
                      headerPosition: "end",
                      itemsPosition: "end",
                    }}
                    placeholder="Order by"
                    className="w-40"
                    onChange={noop}
                  />
                </Fixed>
              </Spec>
              <Spec label="filter" sublabel="open · multiple selected">
                <Fixed width={256} data-ds-open-trigger>
                  <MultipleSelect
                    options={filterOptions}
                    defaultValue={{ Network: ["1", "10"] }}
                    placeholder="Filter by"
                    className="w-64"
                    onChange={noop}
                  />
                </Fixed>
              </Spec>
            </div>
          </ComponentSet>
        </Section>
      </Frame>

      <Frame name="Checkbox" meta="4 colors × 4 states · 3 sizes">
        <Section
          title="Checkbox"
          description="Used for multi-select filters and review checklists. Available in moss, black, purple and white."
        >
          <FrameRow>
            <ComponentSet>
              <VariantGrid
                corner="color / state"
                rows={checkboxColors}
                columns={checkboxStates}
                render={(color, state) => (
                  <Checkbox
                    color={color}
                    size="md"
                    aria-label={`${color} ${state}`}
                    defaultChecked={state.includes("checked") && !state.includes("unchecked")}
                    disabled={state.startsWith("disabled")}
                  />
                )}
              />
            </ComponentSet>
            <ComponentSet>
              <VariantGrid
                corner="size / state"
                rows={checkboxSizes}
                columns={["unchecked", "checked"] as const}
                rowLabel={(s) => `size=${s}`}
                render={(size, state) => (
                  <Checkbox
                    size={size}
                    aria-label={`${size} ${state}`}
                    defaultChecked={state === "checked"}
                  />
                )}
              />
              <div className="mt-8 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox id="ds-terms" defaultChecked />
                  <Label htmlFor="ds-terms">I agree to the round’s eligibility terms</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="ds-terms-disabled" disabled />
                  <Label htmlFor="ds-terms-disabled">Notify me when payouts are sent</Label>
                </div>
              </div>
            </ComponentSet>
          </FrameRow>
        </Section>
      </Frame>

      <FrameRow>
        <Frame name="Switch" meta="4 colors × 4 states" width={720}>
          <Section title="Switch" description="An instant on/off setting, such as “Allow appeals”.">
            <ComponentSet>
              <VariantGrid
                corner="color / state"
                rows={switchColors}
                columns={switchStates}
                render={(color, state) => (
                  <Surface className="inline-flex p-2">
                    <Switch
                      color={color}
                      aria-label={`${color} ${state}`}
                      defaultChecked={state.endsWith("on")}
                      disabled={state.startsWith("disabled")}
                    />
                  </Surface>
                )}
              />
              <div className="mt-8 flex items-center gap-3">
                <Switch id="ds-appeals" defaultChecked />
                <Label htmlFor="ds-appeals">Allow applicants to appeal a rejection</Label>
              </div>
            </ComponentSet>
          </Section>
        </Frame>

        <Frame name="RadioGroup" meta="selected · disabled" width={712}>
          <Section
            title="Radio group"
            description="A single choice from a short list. Options flow into a grid of buttonsPerRow columns."
          >
            <ComponentSet>
              <div className="flex flex-col gap-10">
                <Spec label="buttonsPerRow=2" sublabel="with selection + disabled option">
                  <RadioGroup heading="Funding mechanism" defaultValue="qf" buttonsPerRow={2}>
                    <RadioGroupItem value="qf" label="Quadratic funding" />
                    <RadioGroupItem value="dg" label="Direct grants" />
                    <RadioGroupItem value="retro" label="Retro funding" />
                    <RadioGroupItem value="dg-lite" label="Milestones (soon)" disabled />
                  </RadioGroup>
                </Spec>
                <Spec label="RadioGroupList" sublabel="stacked groups, buttonsPerRow=3">
                  <RadioGroupList
                    groups={[
                      {
                        id: "eligibility",
                        heading: "Does the project meet the round’s eligibility criteria?",
                        options: [
                          { value: "yes", label: "Yes" },
                          { value: "no", label: "No" },
                          { value: "unsure", label: "Unsure" },
                        ],
                      },
                      {
                        id: "impact",
                        heading: "Is there evidence of open-source impact?",
                        options: [
                          { value: "yes", label: "Yes" },
                          { value: "no", label: "No" },
                          { value: "na", label: "N/A", disabled: true },
                        ],
                      },
                    ]}
                  />
                </Spec>
              </div>
            </ComponentSet>
          </Section>
        </Frame>
      </FrameRow>

      <Frame name="FileUpload" meta="empty · with preview">
        <Section
          title="File upload"
          description="A dashed drop zone for logos and banners. Once a file is chosen it previews in place; hovering the preview offers to replace it."
        >
          <ComponentSet>
            <SpecGrid columns={2}>
              <Spec label="state=empty">
                <Fixed width={480}>
                  <FileUpload />
                </Fixed>
              </Spec>
              <Spec label="state=preview" sublabel="round banner">
                <Fixed width={480}>
                  <FileUploadWithPreview />
                </Fixed>
              </Spec>
            </SpecGrid>
          </ComponentSet>
        </Section>
      </Frame>
    </Canvas>
  ),
  play: async ({ canvasElement }) => {
    // Open one MultipleSelect so the menu is visible on the page (non-modal popover).
    const wrapper = canvasElement.querySelector("[data-ds-open-trigger]");
    if (!wrapper) return;
    const trigger = within(wrapper as HTMLElement).getByText("Multiple");
    await userEvent.click(trigger);
  },
};
