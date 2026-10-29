import type { Meta, StoryObj } from "@storybook/react";

import { CheckerIcon } from "@/assets/icons";
import { ManagerLogo } from "@/assets/logos/manager";
import { Navbar } from "@/components/Navbar";
import { SideNav } from "@/components/SideNav";
import type { SideNavItem } from "@/components/SideNav";
import { Canvas, ComponentSet, Frame, FrameRow, Section, Spec } from "@/design-system/_canvas";
import { Breadcrumb } from "@/primitives/Breadcrumb";
import { Button } from "@/primitives/Button";
import { Icon, IconType } from "@/primitives/Icon";
import { Pagination } from "@/primitives/Pagination";
import { VerticalTabs } from "@/primitives/VerticalTabs";

import { Fixed } from "./_helpers";

const meta = {
  title: "Design System/Components/Navigation",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  tags: ["!autodocs"],
} satisfies Meta;

export default meta;

const noop = () => undefined;

const breadcrumbItems = [
  { label: "My Programs", href: "#programs" },
  { label: "Gitcoin Grants", href: "#program" },
  { label: "GG22 OSS Round", href: "#round" },
];

const TabPanel = ({ title, body }: { title: string; body: string }) => (
  <div className="flex h-60 flex-col justify-start gap-6 rounded-3xl bg-[#f7f7f7] p-6">
    <div className="text-2xl font-medium leading-loose text-black">{title}</div>
    <div className="text-base font-normal leading-7 text-grey-900">{body}</div>
  </div>
);

const roundTabs = [
  {
    tabKey: "overview",
    tabTitle: "Round overview",
    tabSubtitle: "Name, dates and funding",
    tabIcon: <Icon type={IconType.HOME} />,
    tabContent: (
      <TabPanel
        title="Round overview"
        body="GG22 OSS Round runs from Oct 15 to Oct 29 with a 250,000 USDC matching pool on Optimism."
      />
    ),
  },
  {
    tabKey: "applications",
    tabTitle: "Applications",
    tabSubtitle: "Review and approve applications",
    tabIcon: <Icon type={IconType.DOCUMENT_DUPLICATE} />,
    tabContent: (
      <TabPanel
        title="Applications"
        body="142 projects applied. 31 are waiting for review by at least two reviewers."
      />
    ),
  },
  {
    tabKey: "voters",
    tabTitle: "Voters",
    tabSubtitle: "Configure voter eligibility",
    tabIcon: <Icon type={IconType.USERS} />,
    tabContent: (
      <TabPanel
        title="Voters"
        body="Donors need a Passport score of 20 or more for their donations to be matched."
      />
    ),
  },
  {
    tabKey: "payouts",
    tabTitle: "Payouts",
    tabSubtitle: "Distribute the matching pool",
    tabIcon: <Icon type={IconType.CASH} />,
    tabContent: (
      <TabPanel
        title="Payouts"
        body="Payouts unlock once the round has ended and the results are finalized."
      />
    ),
  },
];

const sideNavItems: SideNavItem[] = [
  { content: "Home", id: "/home", iconType: IconType.HOME },
  {
    content: "My Programs",
    id: "/my-programs",
    iconType: IconType.BRIEFCASE,
    items: [
      { content: "Gitcoin Grants", id: "/my-programs/gitcoin-grants" },
      { content: "Citizens Retro", id: "/my-programs/citizens-retro" },
    ],
  },
  {
    content: "My Rounds",
    id: "/my-rounds",
    iconType: IconType.COLLECTION,
    items: [
      { content: "Active Rounds", isSeparator: true },
      { content: "GG22 OSS Round", id: "/my-rounds/gg22-oss" },
      { content: "GG22 Climate Round", id: "/my-rounds/gg22-climate" },
      { content: "Draft Rounds", isSeparator: true },
      { content: "GG23 Community Round", id: "/my-rounds/gg23-community" },
    ],
  },
  { content: "Settings", id: "/settings", iconType: IconType.USER_CIRCLE },
];

export const Navigation: StoryObj = {
  render: () => (
    <Canvas
      eyebrow="Components"
      title="Navigation"
      description="Wayfinding across programs, rounds and applications: a persistent top bar, a side menu for the manager, tabs for round settings, and breadcrumbs and pagination for deep lists."
    >
      <Frame name="Navbar" meta="64 px · shown static" bleed>
        <div className="flex flex-col gap-10 bg-grey-50 py-10">
          <Spec label="default" sublabel="logo + title" className="px-10">
            <div className="w-full bg-white">
              <Navbar className="static" text={{ text: "Grants Stack", link: "#" }} />
            </div>
          </Spec>
          <Spec label="secondary logo + actions" className="px-10">
            <div className="w-full bg-white">
              <Navbar
                className="static"
                secondaryLogo={{ img: ManagerLogo, link: "#", size: "h-8 w-8" }}
                text={{ text: "Manager", link: "#" }}
              >
                <Button variant="secondary" value="Docs" />
                <Button variant="primary" value="0xE307…7750" />
              </Navbar>
            </div>
          </Spec>
          <Spec label="without divider" sublabel="showDivider=false" className="px-10">
            <div className="w-full bg-white">
              <Navbar
                className="static"
                showDivider={false}
                secondaryLogo={{ img: CheckerIcon, link: "#", size: "h-7 w-7" }}
                text={{ text: "Checker", link: "#" }}
              >
                <Button variant="primary" value="Connect wallet" />
              </Navbar>
            </div>
          </Spec>
        </div>
      </Frame>

      <FrameRow>
        <Frame name="SideNav" meta="nested · active item" width={420}>
          <Section
            title="Side navigation"
            description="Groups expand to reveal rounds; separators label sections. The active item takes the hover fill."
          >
            <ComponentSet>
              <Fixed width={300}>
                <SideNav
                  items={sideNavItems}
                  activeId="/my-rounds/gg22-oss"
                  onClick={noop}
                  accordionProps={{ radius: "sm", isOpen: true }}
                />
              </Fixed>
            </ComponentSet>
          </Section>
        </Frame>

        <Frame name="VerticalTabs" meta="withIcons · first tab active" width={1012}>
          <Section
            title="Vertical tabs"
            description="Settings pages split into tabs with a title and a one-line subtitle. Icons are optional."
          >
            <ComponentSet className="w-full">
              <VerticalTabs tabs={roundTabs} withIcons listClassName="w-[280px]" />
            </ComponentSet>
          </Section>
        </Frame>
      </FrameRow>

      <FrameRow>
        <Frame name="Breadcrumb" meta="default · loading" width={560}>
          <Section title="Breadcrumb" description="Shows where a page sits in the hierarchy.">
            <ComponentSet>
              <div className="flex flex-col gap-8">
                <Spec label="default">
                  <Breadcrumb items={breadcrumbItems} />
                </Spec>
                <Spec label="isLoading" sublabel="links disabled, pulsing">
                  <Breadcrumb items={breadcrumbItems} isLoading />
                </Spec>
              </div>
            </ComponentSet>
          </Section>
        </Frame>

        <Frame name="Pagination" meta="first · middle · last page" width={872}>
          <Section
            title="Pagination"
            description="Pages through long application lists. First/previous disable on page 1 and next/last on the final page."
          >
            <ComponentSet className="w-full">
              <div className="flex flex-col gap-4">
                {[
                  { label: "first page", page: 1 },
                  { label: "middle page", page: 7 },
                  { label: "last page", page: 15 },
                ].map(({ label, page }) => (
                  <Spec key={label} label={label} sublabel={`currentPage=${page}, totalPages=15`}>
                    <Fixed width={720}>
                      <Pagination
                        currentPage={page}
                        totalPages={15}
                        rowsPerPage={10}
                        onPageChange={noop}
                        onRowsChange={noop}
                      />
                    </Fixed>
                  </Spec>
                ))}
              </div>
            </ComponentSet>
          </Section>
        </Frame>
      </FrameRow>
    </Canvas>
  ),
};
