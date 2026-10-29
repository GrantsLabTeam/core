import type { Meta, StoryObj } from "@storybook/react";

import { CheckerIcon } from "@/assets/icons";
import { Navbar } from "@/components/Navbar";
import { Canvas, Frame, FrameRow, Section } from "@/design-system/_canvas";
import { ApplicationBadgeStatus } from "@/features/application";
import { checkerApplicationEvaluations } from "@/mocks/mockData/checkerApplicationEvaluations";
import { Button } from "@/primitives/Button";

import {
  ApplicationHistoryList,
  ApplicationsSection,
  EvaluationList,
  ProjectEvaluationAction,
  ProjectEvaluationList,
  ProjectReviewList,
  ReviewDropdown,
  ReviewDropdownList,
  ReviewsCounterLabel,
  ReviewsCounterLabelWithTooltip,
} from "~checker/components";
import { mockEvaluations } from "~checker/components/EvaluationList/mocks";
import { CheckerProvider } from "~checker/store";
import { ProjectReview } from "~checker/types";

import { PageColumn, ScreenHeading, Specimen } from "./_helpers";

const noop = () => undefined;

const REVIEWER = "0x5A1b56f30E94c16287A70e1D9D218c7A64A1b6E8" as const;
const OTHER_REVIEWERS = [
  "0x0D1781F0b693b35939A49831A6C799B938Bd2F80",
  "0x4614291bb169905074Da4aFaA39784D175162f79",
  "0x1234567890123456789012345678901234567890",
] as const;

const avatar = (seed: string) => `https://picsum.photos/seed/${seed}/96`;

const review = (approved: boolean, reviewer: `0x${string}`) => ({ approved, reviewer });

const readyToSubmit: ProjectReview[] = [
  {
    id: "11",
    name: "Ethers.js",
    date: new Date(2025, 8, 3, 15, 0),
    avatarUrl: avatar("ethers"),
    reviews: [
      review(true, REVIEWER),
      review(true, OTHER_REVIEWERS[0]),
      review(true, OTHER_REVIEWERS[1]),
    ],
    aiSuggestion: 92,
    scoreAverage: 94,
  },
  {
    id: "12",
    name: "Hypercerts",
    date: new Date(2025, 8, 4, 9, 30),
    avatarUrl: avatar("hypercerts"),
    reviews: [review(true, OTHER_REVIEWERS[0]), review(false, OTHER_REVIEWERS[1])],
    aiSuggestion: 78,
    scoreAverage: 71,
  },
  {
    id: "13",
    name: "L2BEAT",
    date: new Date(2025, 8, 5, 11, 45),
    avatarUrl: avatar("l2beat"),
    reviews: [
      review(true, OTHER_REVIEWERS[0]),
      review(true, OTHER_REVIEWERS[1]),
      review(false, OTHER_REVIEWERS[2]),
    ],
    aiSuggestion: 85,
    scoreAverage: 80,
  },
];

const pendingReview: ProjectReview[] = [
  {
    id: "21",
    name: "Giveth",
    date: new Date(2025, 8, 6, 14, 10),
    avatarUrl: avatar("giveth"),
    reviews: [review(true, OTHER_REVIEWERS[2])],
    aiSuggestion: 66,
    scoreAverage: 66,
  },
  {
    id: "22",
    name: "Protocol Guild",
    date: new Date(2025, 8, 7, 8, 5),
    avatarUrl: avatar("protocolguild"),
    reviews: [],
    aiSuggestion: 88,
    scoreAverage: 88,
  },
  {
    id: "23",
    name: "Free Airdrop Hub",
    date: new Date(2025, 8, 8, 17, 50),
    avatarUrl: avatar("airdrop"),
    reviews: [review(false, OTHER_REVIEWERS[1])],
    aiSuggestion: 12,
    scoreAverage: 12,
  },
];

const history = [
  {
    id: 1,
    name: "Ethers.js",
    date: new Date(2025, 8, 3, 15, 0),
    status: ApplicationBadgeStatus.Pending,
    round: "GG24: Open Source Software",
  },
  {
    id: 2,
    name: "Ethers.js",
    date: new Date(2025, 3, 14, 10, 0),
    status: ApplicationBadgeStatus.Approved,
    round: "GG23: Developer Tooling",
  },
  {
    id: 3,
    name: "Ethers.js",
    date: new Date(2024, 10, 2, 12, 0),
    status: ApplicationBadgeStatus.Rejected,
    round: "GG22: Web3 Infrastructure",
  },
];

const CheckerNavbar = () => (
  <Navbar
    className="border-b border-grey-100 bg-white"
    secondaryLogo={{ img: CheckerIcon, size: "h-8 w-8" }}
    text={{ text: "Checker" }}
  >
    <Button variant="secondary" value="0x5A1b…b6E8" />
  </Navbar>
);

const meta = {
  title: "Design System/Patterns & Screens/Checker",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  tags: ["!autodocs"],
} satisfies Meta;

export default meta;

export const Checker: StoryObj = {
  render: () => (
    <CheckerProvider>
      <Canvas
        eyebrow="Patterns & Screens"
        title="Checker"
        description="Checker helps round operators review applications at scale. Human reviewers and an AI evaluator score every application; once enough reviews are in, the operator submits the final decision onchain."
      >
        <FrameRow>
          <Frame name="Checker / Review applications" meta="Desktop · 1440" width={1440} bleed>
            <CheckerNavbar />
            <PageColumn className="flex flex-col gap-14 py-14">
              <ScreenHeading
                title="GG24: Open Source Software"
                description="Review applications for this round. Applications with enough reviews move to Ready to submit."
              />
              <ApplicationsSection
                label="Ready to submit"
                zeroApplicationsLabel="No applications are ready to submit."
                isLoading={false}
                applications={readyToSubmit}
                action={noop}
                isPoolManager
                isReadyToSubmit
                keepAction
                actionLabel="View evaluations"
                goToSubmitFinalEvaluation={noop}
              />
              <ApplicationsSection
                label="Pending review"
                zeroApplicationsLabel="All applications have been reviewed."
                isLoading={false}
                applications={pendingReview}
                action={noop}
                isPoolManager
                actionLabel="Evaluate project"
              />
            </PageColumn>
          </Frame>
        </FrameRow>

        <FrameRow>
          <Frame name="Checker / Submit final evaluation" meta="Desktop · 1440" width={1440} bleed>
            <CheckerNavbar />
            <PageColumn className="flex flex-col gap-10 py-14">
              <ScreenHeading
                title="Submit final evaluation"
                description="Approve or reject each application. Decisions are recorded onchain when you submit."
              />
              <ProjectEvaluationList
                projects={[...readyToSubmit, ...pendingReview.slice(0, 2)]}
                action={noop}
                isPoolManager
              />
            </PageColumn>
          </Frame>
        </FrameRow>

        <FrameRow>
          <Frame name="Checker / Application evaluations" meta="Desktop · 1440" width={1440} bleed>
            <CheckerNavbar />
            <PageColumn className="flex flex-col gap-14 py-14">
              <ScreenHeading
                title="Ethers.js"
                description="Every review submitted for this application, from human reviewers and the AI evaluator."
              />
              <Section title="Reviews">
                <ReviewDropdownList evaluations={[...checkerApplicationEvaluations]} />
              </Section>
              <Section title="Review summary">
                <EvaluationList evaluations={mockEvaluations} />
              </Section>
              <Section title="Application history">
                <ApplicationHistoryList applications={history} />
              </Section>
            </PageColumn>
          </Frame>
        </FrameRow>

        <FrameRow>
          <Frame name="Project review list" meta="Component · loading">
            <ProjectReviewList projects={[]} isLoading reviewer={REVIEWER} />
          </Frame>
        </FrameRow>

        <FrameRow>
          <Frame name="Review dropdown" meta="Component · human & AI review" width={900}>
            <div className="flex flex-col gap-6">
              {checkerApplicationEvaluations.slice(0, 3).map((evaluation, index) => (
                <ReviewDropdown key={index} evaluation={evaluation} index={index + 1} />
              ))}
            </div>
          </Frame>
        </FrameRow>

        <FrameRow>
          <Frame name="Evaluation action" meta="Component · status">
            <div className="flex flex-wrap items-start gap-16">
              {(["pending", "approved", "rejected"] as const).map((status) => (
                <Specimen key={status} label={`status=${status}`}>
                  <ProjectEvaluationAction projectId="0x1" status={status} onEvaluate={noop} />
                </Specimen>
              ))}
            </div>
          </Frame>
          <Frame name="Reviews counter" meta="Component · counts">
            <div className="flex flex-wrap items-start gap-12">
              <Specimen label="No reviews">
                <ReviewsCounterLabel positiveReviews={0} negativeReviews={0} />
              </Specimen>
              <Specimen label="1 approve · 2 reject">
                <ReviewsCounterLabel positiveReviews={1} negativeReviews={2} />
              </Specimen>
              <Specimen label="3 approve · 2 reject">
                <ReviewsCounterLabel positiveReviews={3} negativeReviews={2} />
              </Specimen>
              <Specimen label="With tooltip">
                <ReviewsCounterLabelWithTooltip positiveReviews={3} negativeReviews={2} />
              </Specimen>
            </div>
          </Frame>
        </FrameRow>
      </Canvas>
    </CheckerProvider>
  ),
};
