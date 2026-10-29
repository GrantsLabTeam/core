import type { Meta, StoryObj } from "@storybook/react";

import {
  Canvas,
  ComponentSet,
  Frame,
  FrameRow,
  Section,
  Spec,
  VariantGrid,
} from "@/design-system/_canvas";
import {
  ApplicationBadge,
  ApplicationBadgeStatus,
} from "@/features/application/components/ApplicationBadge";
import { PoolStatusBadge } from "@/features/pool/components/PoolStatusBadge";
import { PoolTypeBadge } from "@/features/pool/components/PoolTypeBadge";
import { Badge } from "@/primitives/Badge";
import { PoolStatus, PoolType } from "@/types";

const meta = {
  title: "Design System/Components/Badges",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  tags: ["!autodocs"],
} satisfies Meta;

export default meta;

const variants = [
  "info",
  "success",
  "warning",
  "info-strong",
  "success-strong",
  "warning-strong",
  "error-strong",
  "outlined-info",
  "outlined-success",
  "outlined-warning",
  "outlined-info-strong",
  "outlined-success-strong",
  "outlined-warning-strong",
  "outlined-error",
] as const;

const sizes = ["xs", "sm", "md", "lg"] as const;

const labels: Record<(typeof variants)[number], string> = {
  info: "Pending",
  success: "Approved",
  warning: "Rejected",
  "info-strong": "In review",
  "success-strong": "Funded",
  "warning-strong": "Appeal",
  "error-strong": "Fraud",
  "outlined-info": "Pending",
  "outlined-success": "Approved",
  "outlined-warning": "Rejected",
  "outlined-info-strong": "In review",
  "outlined-success-strong": "Funded",
  "outlined-warning-strong": "Appeal",
  "outlined-error": "Error",
};

const poolStatuses = [
  PoolStatus.PreRound,
  PoolStatus.ApplicationsInProgress,
  PoolStatus.RoundInProgress,
  PoolStatus.FundingPending,
  PoolStatus.Ended,
];

const poolTypes = [PoolType.QuadraticFunding, PoolType.DirectGrants, PoolType.Retrofunding];

const poolTypeNames: Record<PoolType, string> = {
  [PoolType.QuadraticFunding]: "QuadraticFunding",
  [PoolType.DirectGrants]: "DirectGrants",
  [PoolType.Retrofunding]: "Retrofunding",
};

export const Badges: StoryObj = {
  render: () => (
    <Canvas
      eyebrow="Components"
      title="Badges"
      description="Badges label the status of a round, a pool or an application at a glance. Each status colour comes in soft, strong and outlined styles."
    >
      <Frame name="Badge" meta="14 variants × 4 sizes + skeleton">
        <Section
          title="Variants × sizes"
          description="Sizes set a minimum width (68, 82, 112, 142 px) so badges line up in tables and lists; the height stays 22 px."
        >
          <ComponentSet>
            <VariantGrid
              corner="variant / size"
              rows={[...variants, "skeleton"] as const}
              columns={sizes}
              columnLabel={(s) => `size=${s}`}
              render={(variant, size) =>
                variant === "skeleton" ? (
                  <Badge skeleton size={size} />
                ) : (
                  <Badge variant={variant} size={size}>
                    {labels[variant]}
                  </Badge>
                )
              }
            />
          </ComponentSet>
        </Section>
      </Frame>

      <FrameRow>
        <Frame name="PoolStatusBadge" meta="5 statuses + loading" width={520}>
          <Section title="Round status" description="Where a funding round is in its lifecycle.">
            <ComponentSet>
              <div className="flex flex-col gap-5">
                {poolStatuses.map((status) => (
                  <Spec key={status} label={`value=${status}`}>
                    <PoolStatusBadge value={status} />
                  </Spec>
                ))}
                <Spec label="isLoading">
                  <PoolStatusBadge isLoading />
                </Spec>
              </div>
            </ComponentSet>
          </Section>
        </Frame>

        <Frame name="PoolTypeBadge" meta="3 types + loading" width={420}>
          <Section title="Round type" description="The funding mechanism behind a round.">
            <ComponentSet>
              <div className="flex flex-col gap-5">
                {poolTypes.map((type) => (
                  <Spec key={type} label={`value=${poolTypeNames[type]}`}>
                    <PoolTypeBadge value={type} />
                  </Spec>
                ))}
                <Spec label="isLoading">
                  <PoolTypeBadge isLoading />
                </Spec>
              </div>
            </ComponentSet>
          </Section>
        </Frame>

        <Frame name="ApplicationBadge" meta="3 statuses" width={420}>
          <Section title="Application status" description="A project's application to a round.">
            <ComponentSet>
              <div className="flex flex-col gap-5">
                {Object.values(ApplicationBadgeStatus).map((status) => (
                  <Spec key={status} label={`status=${status}`}>
                    <ApplicationBadge status={status} />
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
