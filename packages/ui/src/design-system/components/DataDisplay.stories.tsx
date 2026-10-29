import type { Meta, StoryObj } from "@storybook/react";

import { DefaultLogo } from "@/assets";
import { IconLabel } from "@/components/IconLabel";
import { IconWithTooltip } from "@/components/IconWithTooltip";
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
import { Accordion } from "@/primitives/Accordion";
import { Avatar } from "@/primitives/Avatar";
import { Badge } from "@/primitives/Badge";
import { IconType } from "@/primitives/Icon";
import { ListGrid } from "@/primitives/ListGrid";
import type { ListGridColumn } from "@/primitives/ListGrid";
import { Markdown } from "@/primitives/Markdown";
import { StatCard } from "@/primitives/StatCard";
import { StatCardGroup } from "@/primitives/StatCardGroup";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/primitives/Table";

import { Fixed, SpecGrid } from "./_helpers";

const meta = {
  title: "Design System/Components/Data Display",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  tags: ["!autodocs"],
} satisfies Meta;

export default meta;

/* ----------------------------------------------------------------------------------------------
   Mock content
---------------------------------------------------------------------------------------------- */

const appliedOn = new Date("2024-12-09T19:22:56.413Z");
const roundStart = new Date("2024-10-15T12:00:00.000Z");
const roundEnd = new Date("2024-10-29T23:59:00.000Z");

/** A square project logo (inline SVG), standing in for an IPFS-hosted image. */
const projectLogo = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="#25594c"/><circle cx="34" cy="38" r="18" fill="#cdf6d3"/><circle cx="62" cy="58" r="22" fill="#7fe0a4" fill-opacity="0.85"/></svg>`,
)}`;

/** An image URL that fails to load, so the Avatar shows its initials fallback. */
const brokenImage = "/__design-system__/missing-avatar.png";

const applications = [
  { project: "Solidity Guild", status: "Approved", variant: "success", donors: 1284, match: 18420 },
  {
    project: "Open Climate Data",
    status: "Approved",
    variant: "success",
    donors: 956,
    match: 12115,
  },
  { project: "WalletConnect Docs", status: "Pending", variant: "info", donors: 402, match: 0 },
  { project: "zkEdu Collective", status: "Rejected", variant: "warning", donors: 0, match: 0 },
] as const;

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

interface RoundRow {
  id: number;
  name: string;
  network: string;
  pool: string;
  applications: number;
}

const rounds: RoundRow[] = [
  { id: 1, name: "GG22 OSS Round", network: "Optimism", pool: "250,000 USDC", applications: 142 },
  {
    id: 2,
    name: "GG22 Climate Round",
    network: "Arbitrum",
    pool: "100,000 USDC",
    applications: 87,
  },
  { id: 3, name: "GG22 Community Round", network: "Base", pool: "50,000 USDC", applications: 64 },
];

const roundColumns: ListGridColumn<RoundRow>[] = [
  { header: "Round", key: "name", width: "2fr", render: (r) => <span>{r.name}</span> },
  { header: "Network", key: "network", render: (r) => <span>{r.network}</span> },
  { header: "Matching pool", key: "pool", render: (r) => <span>{r.pool}</span> },
  {
    header: "Applications",
    key: "applications",
    position: "right",
    render: (r) => <span className="text-right">{r.applications}</span>,
  },
];

const projectMarkdown = `
## Solidity Guild

An open-source curriculum that has onboarded **2,400+ developers** to smart-contract security.

### What this grant funds
- Three new audit-practice modules
- Translations into *Spanish* and *Portuguese*
- Monthly office hours with [OpenZeppelin](https://openzeppelin.com) reviewers

> "The best on-ramp to security research we've seen." — GG21 reviewer

Install the starter kit with \`npx solidity-guild init\`.
`;

const statCards = [
  { label: "Applications approved", value: "96", subvalue: "68% of total" },
  { label: "Pending review", value: "31" },
  { label: "Applications rejected", value: "15" },
  { label: "Total applications", value: "142" },
];

/* ----------------------------------------------------------------------------------------------
   Page
---------------------------------------------------------------------------------------------- */

export const DataDisplay: StoryObj = {
  name: "Data Display",
  render: () => (
    <Canvas
      eyebrow="Components"
      title="Data Display"
      description="Components that present round and application data: tables and lists for comparison, stat cards for headline numbers, and labels, avatars and rich text for project profiles."
    >
      <Frame name="Table" meta="header · rows · footer · caption">
        <Section
          title="Table"
          description="For dense, comparable rows such as applications in a round. Rows highlight on hover; numeric columns align right."
        >
          <ComponentSet className="w-full">
            <Table>
              <TableCaption>Applications to GG22 OSS Round, sorted by matching amount</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Donors</TableHead>
                  <TableHead className="text-right">Estimated match</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((a) => (
                  <TableRow key={a.project}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar fallbackName={a.project} url={brokenImage} size={32} />
                        <span className="font-medium">{a.project}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={a.variant} size="sm">
                        {a.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-ui-mono">
                      {a.donors.toLocaleString("en-US")}
                    </TableCell>
                    <TableCell className="text-right font-ui-mono">{usd(a.match)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell className="text-right font-ui-mono">2,642</TableCell>
                  <TableCell className="text-right font-ui-mono">{usd(30535)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </ComponentSet>
        </Section>

        <Section
          title="List grid"
          description="A lighter, borderless list for overviews. Column widths are set per column; headers can align left, center or right."
        >
          <ComponentSet className="w-full">
            <ListGrid
              data={rounds}
              columns={roundColumns}
              getRowKey={(r) => r.id}
              rowClassName="rounded-lg odd:bg-grey-50"
            />
          </ComponentSet>
        </Section>
      </Frame>

      <Frame name="StatCard" meta="3 sizes · subvalue · loading">
        <Section
          title="Stat card"
          description="A headline number with its label underneath. Leaving out the value shows a loading skeleton."
        >
          <ComponentSet>
            <VariantGrid
              corner="size / content"
              rows={["sm", "md", "lg"] as const}
              columns={["value", "value + subvalue", "loading"] as const}
              rowLabel={(s) => `size=${s}`}
              render={(size, content) => (
                <StatCard
                  size={size}
                  label="Total applications"
                  value={content === "loading" ? undefined : "142"}
                  subvalue={content === "value + subvalue" ? "+12 this week" : undefined}
                />
              )}
            />
          </ComponentSet>
        </Section>
        <Section
          title="Stat card group"
          description="Cards wrap with a 24 px gutter and share a size."
        >
          <ComponentSet>
            <StatCardGroup stats={statCards} />
          </ComponentSet>
        </Section>
      </Frame>

      <FrameRow>
        <Frame name="Avatar" meta="sizes · image · fallback · variants" width={720}>
          <Section
            title="Avatar"
            description="Project and profile images. When the image is missing it falls back to initials; with no source at all it shows the default logo."
          >
            <ComponentSet>
              <VariantGrid
                corner="source / size"
                rows={["image", "initials fallback", "default logo"] as const}
                columns={["24", "32", "40", "64", "96"] as const}
                columnLabel={(s) => `size=${s}`}
                render={(source, size) => (
                  <Avatar
                    size={Number(size)}
                    url={
                      source === "image"
                        ? projectLogo
                        : source === "initials fallback"
                          ? brokenImage
                          : undefined
                    }
                    fallbackName="Solidity Guild"
                  />
                )}
              />
              <div className="mt-10 flex items-end gap-10 rounded-[8px] bg-grey-100 p-6">
                <Spec label="variant=default" sublabel="shadow">
                  <Avatar size={64} fallbackName="Open Climate" url={brokenImage} />
                </Spec>
                <Spec label="variant=bordered" sublabel="4 px white ring">
                  <Avatar
                    size={64}
                    fallbackName="Open Climate"
                    url={brokenImage}
                    variant="bordered"
                  />
                </Spec>
                <Spec label="noPadding">
                  <Avatar size={64} url={DefaultLogo} noPadding />
                </Spec>
              </div>
            </ComponentSet>
          </Section>
        </Frame>

        <Frame name="IconWithTooltip" meta="rest · open" width={712}>
          <Section
            title="Icon with tooltip"
            description="A small icon that explains itself on hover — used next to scores and terms that need context."
          >
            <ComponentSet>
              <div className="flex items-start gap-24 pb-2 pr-32 pt-14">
                <Spec label="state=rest">
                  <IconWithTooltip
                    iconType={IconType.INFORMATION_CIRCLE}
                    tooltipText="Matching estimates update every 10 minutes"
                  />
                </Spec>
                <Spec label="state=open" sublabel="side=top">
                  <IconWithTooltip
                    iconType={IconType.INFORMATION_CIRCLE}
                    tooltipText="Matching estimates update every 10 minutes"
                    forceMount
                  />
                </Spec>
                <Spec label="state=open" sublabel="side=right">
                  <IconWithTooltip
                    iconType={IconType.SOLID_QUESTION_MARK_CIRCLE}
                    tooltipText="Passport score ≥ 20"
                    side="right"
                    forceMount
                  />
                </Spec>
              </div>
            </ComponentSet>
          </Section>
        </Frame>
      </FrameRow>

      <Frame name="IconLabel" meta="9 types + loading">
        <Section
          title="Icon label"
          description="An icon paired with a short piece of metadata. Each type formats its own data — dates, addresses, social handles and AI review scores."
        >
          <ComponentSet>
            <SpecGrid columns={3}>
              <Spec label="type=default">
                <IconLabel
                  type="default"
                  iconType={IconType.GLOBE}
                  label="Gitcoin Grants Round 22"
                />
              </Spec>
              <Spec label="type=address" sublabel="ens">
                <IconLabel
                  type="address"
                  address="0xE307051C410e970b861CC55CBFD5Acc7BB477750"
                  ens="solidityguild.eth"
                />
              </Spec>
              <Spec label="type=address" sublabel="truncated">
                <IconLabel type="address" address="0xE307051C410e970b861CC55CBFD5Acc7BB477750" />
              </Spec>
              <Spec label="type=social" sublabel="website">
                <IconLabel type="social" platform="website" link="https://solidityguild.xyz" />
              </Spec>
              <Spec label="type=social" sublabel="github, verified">
                <IconLabel
                  type="social"
                  platform="github"
                  link="https://github.com/solidity-guild"
                  isVerified
                />
              </Spec>
              <Spec label="type=social" sublabel="twitter, verified">
                <IconLabel
                  type="social"
                  platform="twitter"
                  link="https://twitter.com/solidityguild"
                  isVerified
                />
              </Spec>
              <Spec label="type=date">
                <IconLabel type="date" date={appliedOn} />
              </Spec>
              <Spec label="type=dateWithPrefix">
                <IconLabel type="dateWithPrefix" date={appliedOn} prefix="Applied on:" />
              </Spec>
              <Spec label="type=period">
                <IconLabel type="period" startDate={roundStart} endDate={roundEnd} />
              </Spec>
            </SpecGrid>
            <div className="mt-10 flex flex-col gap-8">
              <Spec label="type=roundPeriod">
                <IconLabel type="roundPeriod" startDate={roundStart} endDate={roundEnd} />
              </Spec>
              <Spec label="type=roundPeriod" sublabel="open round, no end date">
                <IconLabel type="roundPeriod" startDate={roundStart} label="Donations" />
              </Spec>
            </div>
            <div className="mt-10">
              <Caption muted>type=ai-evaluation — thresholds at 40% and 60%</Caption>
              <div className="mt-4 flex flex-wrap items-start gap-10">
                {[77, 52, 18].map((percent) => (
                  <Spec key={percent} label={`percent=${percent}`}>
                    <IconLabel type="ai-evaluation" percent={percent} />
                  </Spec>
                ))}
                <Spec label="isLoading">
                  <IconLabel type="ai-evaluation" isLoading />
                </Spec>
                <Spec label="type=date" sublabel="isLoading">
                  <IconLabel type="date" date={appliedOn} isLoading />
                </Spec>
              </div>
            </div>
          </ComponentSet>
        </Section>
      </Frame>

      <FrameRow>
        <Frame name="Accordion" meta="3 variants × 3 borders · open/closed" width={960}>
          <Section
            title="Accordion"
            description="Collapsible sections for application details and grouped navigation. The chevron flips when open."
          >
            <ComponentSet>
              <VariantGrid
                corner="variant / border"
                rows={["default", "light", "blue"] as const}
                columns={["none", "sm", "md"] as const}
                columnLabel={(b) => `border=${b}`}
                render={(variant, border) => (
                  <Fixed width={180}>
                    <Accordion
                      variant={variant}
                      border={border}
                      isOpen={false}
                      header="Eligibility"
                      content="Open-source projects with a public repository."
                    />
                  </Fixed>
                )}
              />
              <div className="mt-10">
                <Spec label="isOpen" sublabel="variant=default, border=sm, paddingX=md">
                  <Fixed width={640}>
                    <Accordion
                      border="sm"
                      paddingX="md"
                      header={
                        <IconLabel
                          type="default"
                          label="Solidity Guild"
                          iconType={IconType.GLOBE}
                          iconVariant="text-lg font-medium"
                        />
                      }
                      content={
                        <div className="flex flex-col gap-4 px-4">
                          <span className="font-ui-sans text-[16px]/[24px] font-normal">
                            An open-source curriculum for smart-contract security, applying to GG22
                            OSS Round.
                          </span>
                          <div className="flex flex-wrap items-start gap-10">
                            <div className="flex flex-col gap-4">
                              <IconLabel type="address" ens="solidityguild.eth" />
                              <IconLabel
                                type="social"
                                platform="github"
                                link="https://github.com/solidity-guild"
                                isVerified
                              />
                            </div>
                            <IconLabel
                              type="dateWithPrefix"
                              prefix="Applied on:"
                              date={appliedOn}
                            />
                          </div>
                        </div>
                      }
                    />
                  </Fixed>
                </Spec>
              </div>
            </ComponentSet>
          </Section>
        </Frame>

        <Frame name="Markdown" meta="GFM · project description" width={472}>
          <Section
            title="Markdown"
            description="Project descriptions are written in GitHub-flavoured Markdown and rendered as-is."
          >
            <ComponentSet className="w-full">
              <div className="flex flex-col gap-3 text-[14px] leading-[22px] [&_a]:text-moss-700 [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-grey-100 [&_blockquote]:pl-3 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-grey-50 [&_code]:px-1 [&_code]:font-ui-mono [&_h2]:text-[20px] [&_h2]:font-semibold [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-5">
                <Markdown>{projectMarkdown}</Markdown>
              </div>
              <div className="mt-6">
                <Caption muted>
                  Typography here is applied by the page that hosts the Markdown; the component
                  itself renders unstyled HTML.
                </Caption>
              </div>
            </ComponentSet>
          </Section>
        </Frame>
      </FrameRow>
    </Canvas>
  ),
};
