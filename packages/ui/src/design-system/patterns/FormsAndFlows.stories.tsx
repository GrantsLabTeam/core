import type { Meta, StoryObj } from "@storybook/react";

import { ManagerLogoWordmark } from "@/assets";
import { CheckerIcon } from "@/assets/icons";
import { AllocationSidebar } from "@/components/AllocationSidebar";
import * as AllocationSidebarStories from "@/components/AllocationSidebar/AllocationSidebar.stories";
import { EvaluationForm } from "@/components/EvaluationForm";
import { Form } from "@/components/Form";
import * as FormStories from "@/components/Form/Form.stories";
import { Navbar } from "@/components/Navbar";
import { ProgressForm } from "@/components/ProgressForm";
import { roundSetupSteps } from "@/components/ProgressForm/mocks/RoundSetup";
import { ProgressModal } from "@/components/ProgressModal";
import * as ProgressModalStories from "@/components/ProgressModal/ProgressModal.stories";
import { Canvas, Frame, FrameRow } from "@/design-system/_canvas";
import { Button } from "@/primitives/Button";
import { ProgressStatus } from "@/types";

import { argsOf, ModalSnapshot, PageColumn, ScreenHeading, Specimen } from "./_helpers";

const noop = () => undefined;
const noopAsync = async () => undefined;

const evaluationGroups = [
  {
    id: "open-source",
    heading: "Is the project's code open source under an OSI-approved license?",
  },
  {
    id: "eligibility",
    heading: "Does the project meet this round's eligibility criteria?",
  },
  {
    id: "impact",
    heading: "Has the project demonstrated measurable impact in the last 6 months?",
  },
  {
    id: "team",
    heading: "Is the team publicly identifiable or does it have a verifiable track record?",
  },
];

// Use showcase-only persist keys so this page never shares drafts with other stories.
const steps = roundSetupSteps.map((step) => ({
  ...step,
  formProps: {
    ...step.formProps,
    persistKey: step.formProps.persistKey?.replace("storybook-", "ds-patterns-"),
  },
}));

const sidebarArgs = argsOf(AllocationSidebar, AllocationSidebarStories.WithProjects.args);
const sidebarNames = [
  "Ethers.js",
  "Hypercerts",
  "L2BEAT",
  "Protocol Guild",
  "Giveth",
  "Hardhat",
  "Foundry",
  "Viem",
  "Safe",
  "ENS",
  "Snapshot",
];
const allocations = (sidebarArgs.projects ?? [])
  .map((project, index) => ({ ...project, name: sidebarNames[index] ?? project.name }))
  .sort((a, b) => b.amount - a.amount);
const chartData = allocations.map((project, index) => ({ x: index, y: project.amount }));

const progressArgs = argsOf(ProgressModal, ProgressModalStories.Default.args);
const modalStates = [
  {
    name: "In progress",
    heading: "Submitting your evaluation",
    subheading: "Please hold while we record your evaluation onchain.",
    steps: [
      {
        name: "Signing",
        description: "Signature confirmed in your wallet.",
        status: ProgressStatus.IS_SUCCESS,
      },
      {
        name: "Submitting",
        description: "Sending the evaluation to Checker.",
        status: ProgressStatus.IN_PROGRESS,
      },
      {
        name: "Indexing",
        description: "Waiting for the indexer to pick it up.",
        status: ProgressStatus.NOT_STARTED,
      },
    ],
  },
  { name: "Success", ...argsOf(ProgressModal, ProgressModalStories.AllStepsSuccess.args) },
  { name: "Error", ...argsOf(ProgressModal, ProgressModalStories.WithError.args) },
];

const AppNavbar = ({ checker }: { checker?: boolean }) => (
  <Navbar
    className="border-b border-grey-100 bg-white"
    secondaryLogo={
      checker
        ? { img: CheckerIcon, size: "h-8 w-8" }
        : { img: ManagerLogoWordmark, size: "h-6 w-auto" }
    }
    text={checker ? { text: "Checker" } : undefined}
  >
    <Button variant="secondary" value="0x5A1b…b6E8" />
  </Navbar>
);

const EvaluationScreen = () => (
  <>
    <AppNavbar checker />
    <PageColumn className="flex flex-col gap-8 py-14">
      <ScreenHeading
        title="Evaluate Ethers.js"
        description="Answer each question, add a short summary and approve or reject the application."
      />
      <div className="max-w-[880px] rounded-2xl border border-grey-100">
        <EvaluationForm groups={evaluationGroups} onSubmit={noop} />
      </div>
    </PageColumn>
  </>
);

const meta = {
  title: "Design System/Patterns & Screens/Forms & Flows",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  tags: ["!autodocs"],
} satisfies Meta;

export default meta;

export const FormsAndFlows: StoryObj = {
  name: "Forms & Flows",
  render: () => (
    <Canvas
      eyebrow="Patterns & Screens"
      title="Forms & Flows"
      description="Multi-step forms, evaluation forms and progress feedback. Long flows are split into steps with progress that persists between sessions; onchain actions report each step as it happens."
    >
      <FrameRow>
        <Frame name="Manager / Create round" meta="Desktop · 1440" width={1440} bleed>
          <AppNavbar />
          <PageColumn className="py-14">
            <ProgressForm
              name="Create round"
              steps={steps}
              onSubmit={noopAsync}
              dbName="ds-patterns-formDB"
              storeName="formDrafts"
              stepsPersistKey="ds-patterns-roundSetup"
            />
          </PageColumn>
        </Frame>
      </FrameRow>

      <FrameRow>
        <Frame name="Checker / Evaluate application" meta="Desktop · 1440" width={1440} bleed>
          <EvaluationScreen />
        </Frame>
      </FrameRow>

      <FrameRow>
        <Frame
          name="Checker / Submitting evaluation"
          meta="Desktop · 1440 × 900 · modal"
          width={1440}
          bleed
        >
          <ModalSnapshot
            height={900}
            background={<EvaluationScreen />}
            render={(open) => <ProgressModal {...modalStates[0]} isOpen={open} />}
          />
        </Frame>
      </FrameRow>

      <FrameRow>
        {modalStates.map(({ name, ...state }) => (
          <Frame key={name} name={`Progress modal · ${name}`} meta="Component" width={464} bleed>
            <ModalSnapshot
              height={440}
              render={(open) => <ProgressModal {...progressArgs} {...state} isOpen={open} />}
            />
          </Frame>
        ))}
      </FrameRow>

      <FrameRow>
        <Frame name="Form" meta="Component · single step" width={900}>
          <Form {...argsOf(Form, FormStories.Default.args)} onSubmit={noopAsync} />
        </Frame>
      </FrameRow>

      <FrameRow>
        <Frame name="Allocation sidebar" meta="Component · states">
          <div className="flex flex-wrap items-start gap-12">
            <Specimen label="With allocations">
              <AllocationSidebar
                {...sidebarArgs}
                title="Your allocation"
                description="How your ballot distributes funds across projects."
                projects={allocations}
                chartData={chartData}
                sortConfig={{ isAscending: false, onClick: noop }}
              />
            </Specimen>
            <Specimen label="Loading">
              <AllocationSidebar
                {...sidebarArgs}
                title="Your allocation"
                description="How your ballot distributes funds across projects."
                projects={[]}
                chartData={[]}
                isLoading
                sortConfig={{ isAscending: false, onClick: noop }}
              />
            </Specimen>
          </div>
        </Frame>
      </FrameRow>
    </Canvas>
  ),
};
