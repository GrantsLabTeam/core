import type { Meta, StoryObj } from "@storybook/react";

import { ExplorerLogoWordmark } from "@/assets";
import { Navbar } from "@/components/Navbar";
import { Canvas, Frame, FrameRow, Section } from "@/design-system/_canvas";
import {
  ApplicationBadge,
  ApplicationBadgeStatus,
  ApplicationSummary,
} from "@/features/application";
import * as ApplicationSummaryStories from "@/features/application/components/ApplicationSummary/ApplicationSummary.stories";
import { ProjectBanner, ProjectCard, ProjectSummary, StakeProjectCard } from "@/features/project";
import * as ProjectBannerStories from "@/features/project/components/ProjectBanner/ProjectBanner.stories";
import * as ProjectCardStories from "@/features/project/components/ProjectCard/ProjectCard.stories";
import * as ProjectSummaryStories from "@/features/project/components/ProjectSummary/ProjectSummary.stories";
import * as StakeProjectCardStories from "@/features/project/components/StakeProjectCard/StakeProjectCard.stories";
import { createQueryState } from "@/lib";
import { Button } from "@/primitives/Button";

import { argsOf, PageColumn, ScreenHeading, Specimen, patternHandlers } from "./_helpers";

const bannerArgs = argsOf(ProjectBanner, ProjectBannerStories.CenteredAvatar.args);
const cardArgs = argsOf(ProjectCard, ProjectCardStories.Default.args);
const summaryArgs = argsOf(ApplicationSummary, ApplicationSummaryStories.Default.args);
const projectSummaryArgs = argsOf(ProjectSummary, ProjectSummaryStories.Default.args);

const projects = [
  {
    title: "Gitcoin Grants Stack",
    description:
      "A protocol-enabled solution that enables any community to easily create, manage and grow a grants program.",
  },
  {
    title: "Ethers.js",
    description:
      "A complete, compact library for interacting with the Ethereum blockchain and its ecosystem, used by thousands of dapps.",
  },
  {
    title: "Hypercerts",
    description:
      "An open protocol for tracking and rewarding impact — a shared ledger of who did what, when, and what it achieved.",
  },
  {
    title: "Protocol Guild",
    description:
      "A collective of Ethereum core contributors funded through a vesting contract that anyone can contribute to.",
  },
  {
    title: "L2BEAT",
    description:
      "An analytics and research site for Ethereum layer 2 scaling solutions, focused on risks and trust assumptions.",
  },
  {
    title: "Giveth",
    description:
      "A donation platform that rewards giving to public goods and makes philanthropy transparent and accountable.",
  },
].map((project, index) => ({
  ...cardArgs,
  ...project,
  // Placeholder CIDs; the page's MSW handler maps each to a stable image.
  logoImg: `ds-logo-${index}-${project.title.toLowerCase().replace(/[^a-z]/g, "")}`,
  bannerImg: `ds-banner-${index}-${project.title.toLowerCase().replace(/[^a-z]/g, "")}`,
  id: `0x${index + 1}`,
}));

const projectMetadata = {
  ...summaryArgs.project,
  title: "Ethers.js",
  description:
    "Ethers.js is a complete and compact library for interacting with the Ethereum blockchain and its ecosystem. It powers wallets, dapps and developer tooling across the ecosystem.",
  website: "https://ethers.org",
  projectTwitter: "ethersproject",
  projectGithub: "ethers-io",
  userGithub: "ricmoo",
  createdAt: new Date("2024-03-04T10:00:00Z").getTime(),
  lastUpdated: new Date("2025-08-19T15:30:00Z").getTime(),
  logoImg: projects[1].logoImg,
  bannerImg: projects[1].bannerImg,
};

const stakeImage = "https://picsum.photos/seed/gitcoin/200";

const ExplorerNavbar = () => (
  <Navbar
    className="border-b border-grey-100 bg-white"
    secondaryLogo={{ img: ExplorerLogoWordmark, size: "h-6 w-auto" }}
  >
    <Button value="Connect wallet" />
  </Navbar>
);

const meta = {
  title: "Design System/Patterns & Screens/Projects & Applications",
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
    msw: { handlers: patternHandlers },
  },
  tags: ["!autodocs"],
} satisfies Meta;

export default meta;

export const ProjectsAndApplications: StoryObj = {
  name: "Projects & Applications",
  render: () => (
    <Canvas
      eyebrow="Patterns & Screens"
      title="Projects & Applications"
      description="Projects are the public profile of a team; applications are a project's submission to a specific round. These patterns cover discovery, project detail, staking and the application record reviewers rely on."
    >
      <FrameRow>
        <Frame name="Explorer / Projects" meta="Desktop · 1440" width={1440} bleed>
          <ExplorerNavbar />
          <PageColumn className="flex flex-col gap-10 py-14">
            <ScreenHeading
              title="Explore projects"
              description="148 projects building open source infrastructure for Ethereum."
            />
            <div className="grid grid-cols-3 justify-items-center gap-y-10">
              {projects.map((project) => (
                <ProjectCard key={project.id} {...project} />
              ))}
            </div>
          </PageColumn>
        </Frame>
      </FrameRow>

      <FrameRow>
        <Frame name="Explorer / Application detail" meta="Desktop · 1440" width={1440} bleed>
          <ExplorerNavbar />
          <PageColumn className="flex flex-col gap-10 py-14">
            <ProjectBanner
              bannerImg={projects[1].bannerImg}
              logoImg={projects[1].logoImg}
              avatarPosition="left"
            />
            <ApplicationSummary
              {...summaryArgs}
              project={projectMetadata}
              application={{
                ...summaryArgs.application,
                metadata: {
                  ...summaryArgs.application.metadata,
                  application: {
                    ...summaryArgs.application.metadata.application,
                    project: projectMetadata,
                    answers: [
                      {
                        type: "text",
                        hidden: false,
                        question: "What will you build with this funding?",
                        questionId: 1,
                        answer:
                          "Ship ethers v7 with first-class account abstraction support and a smaller bundle for mobile wallets.",
                      },
                      {
                        type: "text",
                        hidden: false,
                        question: "How will you measure impact?",
                        questionId: 2,
                        answer:
                          "Weekly npm downloads, dependent repositories on GitHub and migration rate from v5 to v7.",
                      },
                    ],
                  },
                },
              }}
              pastApplications={[
                {
                  ...summaryArgs.pastApplications[0],
                  round: { roundMetadata: { name: "GG23: Developer Tooling" } },
                },
                {
                  ...summaryArgs.pastApplications[1],
                  round: { roundMetadata: { name: "GG22: Open Source Software" } },
                },
              ]}
            />
          </PageColumn>
        </Frame>
      </FrameRow>

      <FrameRow>
        <Frame name="Project summary" meta="Component" width={1100}>
          <ProjectSummary {...projectSummaryArgs} />
        </Frame>
      </FrameRow>

      <FrameRow>
        <Frame name="Project banner" meta="Component · avatar position">
          <div className="grid grid-cols-3 gap-10">
            {(["left", "center", "right"] as const).map((position) => (
              <Specimen key={position} label={`avatarPosition=${position}`}>
                <ProjectBanner {...bannerArgs} avatarPosition={position} />
              </Specimen>
            ))}
          </div>
        </Frame>
      </FrameRow>

      <FrameRow>
        <Frame name="Project card" meta="Component · states">
          <div className="flex flex-wrap items-start gap-10">
            <Specimen label="Default" className="w-[384px]">
              <ProjectCard {...projects[0]} />
            </Specimen>
            <Specimen label="Loading" className="w-[384px]">
              <ProjectCard queryResult={createQueryState("pending")} />
            </Specimen>
          </div>
        </Frame>
      </FrameRow>

      <FrameRow>
        <Frame name="Stake project card" meta="Component · variants">
          <div className="flex flex-col gap-8">
            <Specimen label='variant="stake"'>
              <StakeProjectCard
                {...argsOf(StakeProjectCard, StakeProjectCardStories.StakeWithLongDescription.args)}
                image={stakeImage}
              />
            </Specimen>
            <Specimen label='variant="leaderboard"'>
              <StakeProjectCard
                {...argsOf(StakeProjectCard, StakeProjectCardStories.Leaderboard.args)}
                name="Protocol Guild"
                description="A collective of Ethereum core contributors funded through a vesting contract."
                image={stakeImage}
              />
            </Specimen>
            <Specimen label='variant="staked"'>
              <StakeProjectCard
                {...argsOf(StakeProjectCard, StakeProjectCardStories.StakedUnlockedUnclaimed.args)}
                name="L2BEAT"
                description="Research and analytics for Ethereum layer 2s."
                image={stakeImage}
              />
            </Specimen>
            <Specimen label='variant="claimed"'>
              <StakeProjectCard
                {...argsOf(StakeProjectCard, StakeProjectCardStories.Claimed.args)}
                name="Giveth"
                description="A donation platform that rewards giving to public goods."
                image={stakeImage}
              />
            </Specimen>
          </div>
        </Frame>
      </FrameRow>

      <FrameRow>
        <Frame name="Application badge" meta="Component · status">
          <Section title="Application status" description="Used in review lists and history.">
            <div className="flex flex-wrap items-start gap-10">
              {Object.values(ApplicationBadgeStatus).map((status) => (
                <Specimen key={status} label={status}>
                  <ApplicationBadge status={status} />
                </Specimen>
              ))}
            </div>
          </Section>
        </Frame>
      </FrameRow>
    </Canvas>
  ),
};
