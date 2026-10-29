import type { Meta, StoryObj } from "@storybook/react";

import { RetrofundingLogoWordmark, RetrofundingVoteLogoWordmark } from "@/assets";
import { ConnectButton } from "@/components/ConnectButton/ConnectButton";
import { CreateButton } from "@/components/CreateButton";
import { Navbar } from "@/components/Navbar";
import { Canvas, Frame, FrameRow } from "@/design-system/_canvas";
import { BallotForm } from "@/features/retrofunding/components/BallotForm";
import * as BallotFormStories from "@/features/retrofunding/components/BallotForm/BallotForm.stories";
import { Distribute } from "@/features/retrofunding/components/Distribute";
import * as DistributeStories from "@/features/retrofunding/components/Distribute/Distribute.stories";
import { LandingPage } from "@/features/retrofunding/components/Landing";
import { Leaderboard } from "@/features/retrofunding/components/Leaderboard";
import * as LeaderboardStories from "@/features/retrofunding/components/Leaderboard/Leaderboard.stories";
import { MetricCard } from "@/features/retrofunding/components/MetricCard";
import { MetricsBallot } from "@/features/retrofunding/components/MetricsBallot";
import * as MetricsBallotStories from "@/features/retrofunding/components/MetricsBallot/MetricsBallot.stories";
import { ProgramPickerModal } from "@/features/retrofunding/components/ProgramPickerModal";
import { Button } from "@/primitives/Button";

import { argsOf, Artboard, ModalSnapshot, PageColumn, ScreenHeading, Specimen } from "./_helpers";

const noop = () => undefined;

const ballotArgs = argsOf(BallotForm, BallotFormStories.AlreadyVoted.args);
const metricsBallotArgs = argsOf(MetricsBallot, MetricsBallotStories.Default.args);
const distributeArgs = argsOf(Distribute, DistributeStories.NoFinalizedProjects.args);

const programs = [
  { id: "1", title: "Gitcoin Grants Stack", operatorsCount: 4, roundsCount: 12 },
  { id: "2", title: "Optimism RetroPGF", operatorsCount: 6, roundsCount: 5 },
  { id: "3", title: "Allo Protocol", operatorsCount: 3, roundsCount: 8 },
  { id: "4", title: "Public Goods Lab", operatorsCount: 2, roundsCount: 3 },
].map((program) => ({ ...program, chainId: 10, createdAtBlock: 1000000, onClick: noop }));

const leaderboardArgs = argsOf(Leaderboard, LeaderboardStories.FourMetrics.args);
const leaderboardMetrics = Object.fromEntries(
  Object.entries(leaderboardArgs.metrics ?? {}).filter(([id]) => id !== "innovation"),
);
const submittedMetricsBallotArgs = argsOf(MetricsBallot, MetricsBallotStories.AlreadyVoted.args);

const metrics = (metricsBallotArgs.availableMetrics ?? []).slice(0, 4);

const RetroNavbar = ({ vote }: { vote?: boolean }) => (
  <Navbar
    className="border-b border-grey-100 bg-white"
    secondaryLogo={{
      img: vote ? RetrofundingVoteLogoWordmark : RetrofundingLogoWordmark,
      size: "h-6 w-auto",
    }}
  >
    <ConnectButton type={vote ? "vote" : "admin"} />
  </Navbar>
);

/** Landing pages use an absolutely positioned 100vh grid; pin it to the artboard instead. */
const landingFit =
  "[&_.background-grid-green]:!min-h-full [&_.background-grid-green]:h-full [&_.background-grid-purple]:!min-h-full [&_.background-grid-purple]:h-full";

const meta = {
  title: "Design System/Patterns & Screens/Retrofunding",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  tags: ["!autodocs"],
} satisfies Meta;

export default meta;

export const Retrofunding: StoryObj = {
  render: () => (
    <Canvas
      eyebrow="Patterns & Screens"
      title="Retrofunding"
      description="Retroactive funding lets a community reward projects for impact they have already created. Voters split 100% of their ballot across impact metrics; round operators review the resulting leaderboard and distribute the matching pool."
    >
      <FrameRow>
        <Frame name="Vote / Landing" meta="Desktop · 1440 × 820" width={1440} bleed>
          <RetroNavbar vote />
          <Artboard height={740} className={landingFit}>
            <LandingPage
              type="vote"
              roundName="Optimism Retro Funding: Onchain Builders"
              roundDescription="Help decide how 10M OP is distributed. Choose the impact metrics that matter most to you, weight them on your ballot, and the leaderboard will rank every project accordingly."
            >
              <ConnectButton type="vote" />
            </LandingPage>
          </Artboard>
        </Frame>
      </FrameRow>

      <FrameRow>
        <Frame name="Admin / Select program" meta="Desktop · 1440 × 820 · modal" width={1440} bleed>
          <ModalSnapshot
            height={820}
            background={
              <>
                <RetroNavbar />
                <Artboard height={740} className={landingFit}>
                  <LandingPage type="admin">
                    <ConnectButton type="admin" />
                  </LandingPage>
                </Artboard>
              </>
            }
            render={(open) => (
              <ProgramPickerModal
                programs={programs}
                isOpen={open}
                onOpenChange={noop}
                footer={<CreateButton variant="round">Create new round</CreateButton>}
              />
            )}
          />
        </Frame>
      </FrameRow>

      <FrameRow>
        <Frame name="Vote / Leaderboard" meta="Desktop · 1440" width={1440} bleed>
          <RetroNavbar vote />
          <PageColumn className="flex flex-col gap-8 px-0 py-14">
            <ScreenHeading
              title="Leaderboard"
              description="Projects ranked by the weighted average of every submitted ballot. Expand a row to see project details."
            />
            <Leaderboard projects={leaderboardArgs.projects} metrics={leaderboardMetrics} />
          </PageColumn>
        </Frame>
      </FrameRow>

      <FrameRow>
        <Frame name="Vote / Ballot · submitted" meta="Desktop · 1440" width={1440} bleed>
          <RetroNavbar vote />
          <PageColumn className="py-14">
            <MetricsBallot
              {...submittedMetricsBallotArgs}
              name="ds-patterns-metrics-ballot-submitted"
              onSubmit={noop}
              onFormChange={noop}
            />
          </PageColumn>
        </Frame>
      </FrameRow>

      <FrameRow>
        <Frame name="Vote / Ballot · empty" meta="Desktop · 1440" width={1440} bleed>
          <RetroNavbar vote />
          <PageColumn className="py-14">
            <MetricsBallot
              {...metricsBallotArgs}
              name="ds-patterns-metrics-ballot"
              onSubmit={noop}
              onFormChange={noop}
            />
          </PageColumn>
        </Frame>
      </FrameRow>

      <FrameRow>
        <Frame name="Ballot form · draft" meta="Component · 720" width={816}>
          <BallotForm
            {...ballotArgs}
            name="ds-patterns-ballot-draft"
            submittedBallot={undefined}
            onSubmit={noop}
            onChange={noop}
          />
        </Frame>
        <Frame name="Ballot form · submitted" meta="Component · 720 · shareable" width={816}>
          <BallotForm
            {...ballotArgs}
            name="ds-patterns-ballot-submitted"
            onSubmit={noop}
            onChange={noop}
            onShare={noop}
          />
        </Frame>
      </FrameRow>

      <FrameRow>
        <Frame name="Metric card · metric variant" meta="Component · 720" width={816}>
          <div className="flex flex-col gap-10">
            {metrics.slice(0, 2).map((metric, index) => (
              <Specimen key={metric.metricId} label={index ? "Added" : "Default"}>
                <MetricCard
                  title={metric.title}
                  identifier={`ds-${metric.metricId}`}
                  description={metric.description}
                  variant="metric"
                  isAdded={index === 1}
                  onClick={noop}
                  onReadMore={noop}
                />
              </Specimen>
            ))}
            <Specimen label="Custom action">
              <MetricCard
                title="Gas fees generated"
                identifier="ds-gas-fees"
                description="Total gas fees paid by users interacting with the project's contracts during the measurement window, a proxy for sustained, economically meaningful onchain activity."
                variant="metric"
                onClick={noop}
                onReadMore={noop}
                customButton={<Button variant="outlined-error" value="Remove metric" />}
              />
            </Specimen>
          </div>
        </Frame>
        <Frame name="Metric card · ballot variant" meta="Component · 720" width={816}>
          <div className="flex flex-col gap-10">
            {metrics.slice(2, 4).map((metric, index) => (
              <Specimen key={metric.metricId} label={index ? "Added" : "Default"}>
                <MetricCard
                  title={metric.title}
                  identifier={`ds-${metric.metricId}`}
                  description={metric.description}
                  variant="ballot"
                  isAdded={index === 1}
                  onClick={noop}
                  onReadMore={noop}
                />
              </Specimen>
            ))}
            <Specimen label="Loading">
              <MetricCard
                title=""
                identifier=""
                description=""
                onClick={noop}
                onReadMore={noop}
                isLoading
              />
            </Specimen>
          </div>
        </Frame>
      </FrameRow>

      <FrameRow>
        <Frame name="Admin / Distribute" meta="Desktop · 1440" width={1440} bleed>
          <RetroNavbar />
          <PageColumn className="flex flex-col gap-8 py-14">
            <ScreenHeading
              title="Distribute funds"
              description="Review the final payout for each project, adjust percentages if needed, and send funds from the round contract."
            />
            <Distribute {...distributeArgs} />
          </PageColumn>
        </Frame>
      </FrameRow>
    </Canvas>
  ),
};
