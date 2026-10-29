import type { Meta, StoryObj } from "@storybook/react";

import { ManagerLogoWordmark } from "@/assets";
import { Navbar } from "@/components/Navbar";
import { Canvas, Frame, FrameRow, Section } from "@/design-system/_canvas";
import {
  PoolBadge,
  PoolCard,
  PoolCardGroup,
  PoolList,
  PoolStatusBadge,
  PoolSummary,
  PoolTypeBadge,
  StakePoolCard,
  StakePoolDataCardProps,
} from "@/features/pool";
import * as PoolCardStories from "@/features/pool/components/PoolCard/PoolCard.stories";
import * as StakePoolCardStories from "@/features/pool/components/StakePoolCard/StakePoolCard.stories";
import { ProgramCard, ProgramCardGroup, ProgramList } from "@/features/program";
import * as ProgramCardStories from "@/features/program/components/ProgramCard/ProgramCard.stories";
import { createQueryState } from "@/lib";
import { Button } from "@/primitives/Button";
import { PoolStatus, PoolType } from "@/types";

import { argsOf, PageColumn, ScreenHeading, Specimen } from "./_helpers";

const noop = () => undefined;
const DAY = 24 * 60 * 60 * 1000;
const now = Date.now();
const daysFromNow = (days: number) => new Date(now + days * DAY);

const GITCOIN_LOGO =
  "https://cdn.prod.website-files.com/6433c5d029c6bb75f3f00bd5/66f47dd26d8ec8d0e48a22d0_gitcoin-profile.png";
const UNISWAP_LOGO = "https://thegivingblock.com/wp-content/uploads/2021/07/Uniswap-Logo.png";

const basePool = argsOf(PoolCard, PoolCardStories.Default.args);

const pools = [
  {
    roundName: "GG24: Open Source Software",
    roundId: "90",
    chainId: 10,
    poolType: PoolType.QuadraticFunding,
    poolStatus: PoolStatus.ApplicationsInProgress,
    logoImg: GITCOIN_LOGO,
    operatorsCount: 10,
  },
  {
    roundName: "Uniswap Builder Grants",
    roundId: "91",
    chainId: 8453,
    poolType: PoolType.DirectGrants,
    poolStatus: PoolStatus.FundingPending,
    logoImg: UNISWAP_LOGO,
    operatorsCount: 5,
  },
  {
    roundName: "Climate Solutions Retro",
    roundId: "92",
    chainId: 42161,
    poolType: PoolType.Retrofunding,
    poolStatus: PoolStatus.RoundInProgress,
    logoImg: GITCOIN_LOGO,
    operatorsCount: 3,
  },
  {
    roundName: "Developer Tooling Q4",
    roundId: "93",
    chainId: 1,
    poolType: PoolType.QuadraticFunding,
    poolStatus: PoolStatus.PreRound,
    logoImg: UNISWAP_LOGO,
    operatorsCount: 7,
  },
].map((pool, index) => ({
  ...pool,
  applicationStartDate: daysFromNow(-5 + index * 3),
  applicationEndDate: daysFromNow(9 + index * 3),
  votingStartDate: daysFromNow(10 + index * 3),
  votingEndDate: daysFromNow(24 + index * 3),
  createdAtBlock: 1000000 + index,
  onClick: noop,
}));

const programs = [
  { id: "0x1", title: "Gitcoin Grants Stack", operatorsCount: 6, roundsCount: 24, chainId: 10 },
  { id: "0x2", title: "Allo Protocol", operatorsCount: 4, roundsCount: 9, chainId: 1 },
  { id: "0x3", title: "Arbitrum DAO", operatorsCount: 8, roundsCount: 5, chainId: 42161 },
  { id: "0x4", title: "Base Ecosystem", operatorsCount: 3, roundsCount: 2, chainId: 8453 },
].map((program, index) => ({ ...program, createdAtBlock: 1000000 + index, onClick: noop }));

const stakeBase = argsOf(StakePoolCard, StakePoolCardStories.Default.args).data;
const stakeRound: StakePoolDataCardProps = {
  ...stakeBase,
  roundName: "GG24: Open Source Software",
  roundDescription:
    "Stake GTC on the open source projects you believe in. Stakers share in the round's rewards once voting closes and results are finalized.",
  matchingPoolAmount: 250000,
  totalProjects: 148,
  totalStaked: 182400,
  stakedAmount: 0,
  onClick: noop,
};
const stakedProjects = (stakeBase.stakedProjects ?? []).map((project, index) => ({
  ...project,
  name: ["Ethers.js", "Hardhat"][index] ?? project.name,
}));

const stakeVariants: { label: string; data: StakePoolDataCardProps }[] = [
  {
    label: "Upcoming",
    data: { ...stakeRound, votingStartDate: daysFromNow(6), votingEndDate: daysFromNow(20) },
  },
  {
    label: "Active",
    data: { ...stakeRound, votingStartDate: daysFromNow(-4), votingEndDate: daysFromNow(10) },
  },
  {
    label: "Staked · pending",
    data: {
      ...stakeRound,
      votingStartDate: daysFromNow(-4),
      votingEndDate: daysFromNow(10),
      stakedAmount: 1200,
      lastStakeDate: daysFromNow(-1),
      stakedProjects,
    },
  },
  {
    label: "Staked · ready to claim",
    data: {
      ...stakeRound,
      votingStartDate: daysFromNow(-40),
      votingEndDate: daysFromNow(-12),
      stakedAmount: 1200,
      lastStakeDate: daysFromNow(-20),
      isClaimable: true,
      stakedProjects,
    },
  },
];

const ManagerNavbar = ({ staking }: { staking?: boolean }) => (
  <Navbar
    className="border-b border-grey-100 bg-white"
    secondaryLogo={staking ? undefined : { img: ManagerLogoWordmark, size: "h-6 w-auto" }}
    text={staking ? { text: "Staking" } : undefined}
  >
    <Button variant="secondary" value="0x4614…2f79" />
  </Navbar>
);

const meta = {
  title: "Design System/Patterns & Screens/Pools & Programs",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  tags: ["!autodocs"],
} satisfies Meta;

export default meta;

export const PoolsAndPrograms: StoryObj = {
  name: "Pools & Programs",
  render: () => (
    <Canvas
      eyebrow="Patterns & Screens"
      title="Pools & Programs"
      description="Programs group the funding rounds (pools) an organization runs. Pool cards, lists and summaries are the core of the round manager: they surface strategy, status and timeline at a glance."
    >
      <FrameRow>
        <Frame name="Manager / Home" meta="Desktop · 1440" width={1440} bleed>
          <ManagerNavbar />
          <PageColumn className="flex flex-col gap-16 py-14">
            <ScreenHeading
              title="Welcome back"
              description="Manage your programs and the rounds running inside them."
            />
            <ProgramList
              programs={programs}
              title="My programs"
              noProgramsPlaceholder="No programs yet"
            />
            <PoolList pools={pools} title="My rounds" />
          </PageColumn>
        </Frame>
      </FrameRow>

      <FrameRow>
        <Frame name="Manager / Round overview" meta="Desktop · 1440" width={1440} bleed>
          <ManagerNavbar />
          <PoolSummary
            chainId={10}
            poolId="90"
            programId="0x1"
            name="GG24: Open Source Software"
            strategyName={PoolType.QuadraticFunding}
            applicationsStartTime={daysFromNow(-5).toISOString()}
            applicationsEndTime={daysFromNow(9).toISOString()}
            donationsStartTime={daysFromNow(10).toISOString()}
            donationsEndTime={daysFromNow(24).toISOString()}
          />
          <PageColumn className="flex flex-col gap-6 py-14">
            <ScreenHeading
              title="Rounds in this program"
              description="Other rounds operated by Gitcoin Grants Stack."
            />
            <PoolCardGroup pools={pools.slice(1)} justify="start" />
          </PageColumn>
        </Frame>
      </FrameRow>

      <FrameRow>
        <Frame name="Stake / Pools" meta="Desktop · 1440" width={1440} bleed>
          <ManagerNavbar staking />
          <PageColumn className="flex flex-col gap-10 py-14">
            <ScreenHeading
              title="Staking pools"
              description="Every card reflects the round timeline: upcoming, active, and — once you have staked — your claim status. Expand a staked card to see the projects you backed."
            />
            <div className="grid grid-cols-2 gap-8">
              {stakeVariants.map(({ label, data }) => (
                <Specimen key={label} label={label}>
                  <StakePoolCard data={data} />
                </Specimen>
              ))}
            </div>
          </PageColumn>
        </Frame>
      </FrameRow>

      <FrameRow>
        <Frame name="Pool card" meta="Component · states">
          <div className="flex w-[920px] flex-col gap-10">
            <Specimen label="Default">
              <PoolCard {...basePool} {...pools[0]} />
            </Specimen>
            <Specimen label="No logo">
              <PoolCard
                queryResult={createQueryState("success", {
                  ...pools[1],
                  logoImg: "https://gateway.pinata.cloud/ipfs/undefined",
                })}
              />
            </Specimen>
            <Specimen label="Loading">
              <PoolCard queryResult={createQueryState("pending")} />
            </Specimen>
          </div>
        </Frame>
      </FrameRow>

      <FrameRow>
        <Frame name="Program card" meta="Component · states">
          <div className="flex flex-wrap items-start gap-10">
            <Specimen label="Default">
              <ProgramCard
                {...argsOf(ProgramCard, ProgramCardStories.Default.args)}
                onClick={noop}
              />
            </Specimen>
            <Specimen label="Loading">
              <ProgramCard queryResult={createQueryState("pending")} />
            </Specimen>
          </div>
          <Section title="Program card group" className="mt-14">
            <ProgramCardGroup programs={programs.slice(0, 3)} justify="start" />
          </Section>
        </Frame>
      </FrameRow>

      <FrameRow>
        <Frame name="Badges" meta="Component · pool status & strategy">
          <Section title="Pool status" description="Derived from the round timeline.">
            <div className="flex flex-wrap items-start gap-10">
              {Object.values(PoolStatus).map((status) => (
                <Specimen key={status} label={status}>
                  <PoolStatusBadge value={status} />
                </Specimen>
              ))}
            </div>
          </Section>
          <Section title="Pool type" description="The allocation strategy the round uses.">
            <div className="flex flex-wrap items-start gap-10">
              <Specimen label="Quadratic funding">
                <PoolTypeBadge value={PoolType.QuadraticFunding} />
              </Specimen>
              <Specimen label="Direct grants">
                <PoolTypeBadge value={PoolType.DirectGrants} />
              </Specimen>
              <Specimen label="Retrofunding">
                <PoolTypeBadge value={PoolType.Retrofunding} />
              </Specimen>
            </div>
          </Section>
          <Section title="PoolBadge" description="Generic wrapper that renders either badge type.">
            <div className="flex flex-wrap items-start gap-10">
              <Specimen label='type="poolStatus"'>
                <PoolBadge type="poolStatus" badge={PoolStatus.RoundInProgress} />
              </Specimen>
              <Specimen label='type="poolType"'>
                <PoolBadge type="poolType" badge={PoolType.Retrofunding} />
              </Specimen>
            </div>
          </Section>
        </Frame>
      </FrameRow>
    </Canvas>
  ),
};
