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
import type { ToasterToast } from "@/hooks/useToast";
import { Badge } from "@/primitives/Badge";
import { Button } from "@/primitives/Button";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/primitives/Dialog";
import { Icon, IconType } from "@/primitives/Icon";
import { CircleStat } from "@/primitives/Indicators";
import { ProgressBar } from "@/primitives/ProgressBar";
import { Skeleton } from "@/primitives/Skeleton";
import { Spinner } from "@/primitives/Spinner";
import { Toast, ToastProvider, ToastViewport } from "@/primitives/Toast/Toast";
import type { ToastStatus } from "@/primitives/Toast/types";

import { Fixed, SpecGrid } from "./_helpers";

const meta = {
  title: "Design System/Components/Feedback",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  tags: ["!autodocs"],
} satisfies Meta;

export default meta;

/* ----------------------------------------------------------------------------------------------
   Toast — rendered statically through the real Toast primitives, without the toaster hook.
   The status → icon mapping mirrors components/Toaster.
---------------------------------------------------------------------------------------------- */

const toastIcon: Record<ToastStatus, JSX.Element> = {
  success: <Icon type={IconType.SOLID_CHECK} className="size-5 rounded-full fill-moss-700" />,
  error: <Icon type={IconType.SOLID_X} className="size-5 rounded-full fill-red-700" />,
  info: <Icon type={IconType.EXCLAMATION_CIRCLE} className="size-5 rounded-full fill-yellow-300" />,
  warning: (
    <Icon type={IconType.EXCLAMATION_TRIANGLE} className="size-5 rounded-full fill-red-700" />
  ),
};

const toastCopy: Record<ToastStatus, string> = {
  success: "Application approved for Gitcoin Grants Round 22.",
  error: "Transaction failed. Your ballot was not submitted.",
  info: "Your review has been saved as a draft.",
  warning: "This round ends in 2 hours. Submit your ballot soon.",
};

const StaticToasts = ({ toasts }: { toasts: ToasterToast[] }) => (
  <ToastProvider duration={Infinity}>
    <ToastViewport className="static z-auto flex max-w-none flex-col gap-6 space-y-0 p-0 sm:max-w-none md:max-w-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </ToastViewport>
  </ToastProvider>
);

const toastFor = (status: ToastStatus, overrides: Partial<ToasterToast> = {}): ToasterToast => ({
  id: `${status}-${overrides.toastSize ?? "medium"}`,
  status,
  description: toastCopy[status],
  icon: toastIcon[status],
  open: true,
  toastCloseVariant: "alwaysVisible",
  ...overrides,
});

const statuses: ToastStatus[] = ["success", "error", "info", "warning"];

/* ----------------------------------------------------------------------------------------------
   Dialog — Radix renders dialog content in a fixed, full-screen portal, which can't be placed
   inside a frame. The content panel below is drawn statically with the panel's own styles
   (from primitives/Dialog) and the real DialogHeader / Title / Description / Footer.
---------------------------------------------------------------------------------------------- */

const DialogStage = ({ children }: { children: React.ReactNode }) => (
  <div className="relative h-[420px] overflow-hidden rounded-[4px] bg-white">
    {/* The page underneath the overlay */}
    <div className="flex flex-col gap-4 p-8" aria-hidden>
      <div className="flex items-center gap-3">
        <span className="text-[24px] font-medium">Gitcoin Grants Round 22</span>
        <Badge variant="success-strong">Active</Badge>
      </div>
      <p className="max-w-[460px] text-[14px] leading-[22px] text-grey-900">
        142 applications · 96 approved · 31 pending review. Matching pool of 250,000 USDC on
        Optimism.
      </p>
      <ProgressBar variant="green-md" value={68} withLabel />
      <div className="mt-2 grid grid-cols-3 gap-3">
        {["Approved", "Pending", "Rejected"].map((label) => (
          <div key={label} className="h-20 rounded-2xl bg-grey-50 p-4 text-[14px] font-bold">
            {label}
          </div>
        ))}
      </div>
    </div>
    {/* overlayVariant="blur" from primitives/Modal */}
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 px-8 backdrop-blur-sm">
      <Dialog>{children}</Dialog>
    </div>
  </div>
);

const dialogPanel =
  "relative grid w-full gap-4 rounded-lg border border-grey-100 bg-white p-6 shadow-lg";

/* ----------------------------------------------------------------------------------------------
   Page
---------------------------------------------------------------------------------------------- */

const progressValues = ["0", "25", "60", "100"] as const;
const progressVariants = ["default", "green", "green-md", "green-sm"] as const;

export const Feedback: StoryObj = {
  render: () => (
    <Canvas
      eyebrow="Components"
      title="Feedback"
      description="How the product talks back: toasts confirm what just happened, progress shows how far along a round or a review is, and skeletons hold the layout while data loads from the indexer."
    >
      <Frame name="Toast" meta="4 statuses · 3 sizes">
        <div className="flex flex-wrap items-start gap-16">
          <div>
            <Section
              title="Statuses"
              description="Toasts appear in the bottom-right corner after an action completes. The icon carries the status; the copy says what happened."
            >
              <ComponentSet>
                <div className="flex flex-col gap-6">
                  {statuses.map((status) => (
                    <Spec key={status} label={`status=${status}`}>
                      <StaticToasts toasts={[toastFor(status)]} />
                    </Spec>
                  ))}
                </div>
              </ComponentSet>
            </Section>
          </div>
          <div>
            <Section title="Sizes" description="Three sizes for the same message.">
              <ComponentSet>
                <div className="flex flex-col gap-6">
                  {(["small", "medium", "large"] as const).map((size) => (
                    <Spec key={size} label={`toastSize=${size}`}>
                      <StaticToasts
                        toasts={[
                          toastFor("success", {
                            toastSize: size,
                            descriptionSize: size,
                            description: "Ballot submitted.",
                          }),
                        ]}
                      />
                    </Spec>
                  ))}
                </div>
              </ComponentSet>
            </Section>
          </div>
        </div>
      </Frame>

      <Frame name="Dialog" meta="content panel, shown open">
        <Section
          title="Dialog"
          description="Modal dialogs confirm consequential actions. The overlay blurs and dims the page; the panel is 448 px wide with a 24 px inset."
        >
          <FrameRow>
            <Spec label="confirm" sublabel="overlayVariant=blur">
              <Fixed width={620}>
                <DialogStage>
                  <div className={`${dialogPanel} max-w-md`}>
                    <DialogHeader>
                      <DialogTitle>Approve application?</DialogTitle>
                      <DialogDescription>
                        Solidity Guild will be added to Gitcoin Grants Round 22 and will be visible
                        to donors immediately.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                      <Button variant="secondary" value="Cancel" />
                      <Button variant="primary" value="Approve application" />
                    </DialogFooter>
                  </div>
                </DialogStage>
              </Fixed>
            </Spec>
            <Spec label="destructive" sublabel="overlayVariant=blur, close button">
              <Fixed width={620}>
                <DialogStage>
                  <div className={`${dialogPanel} max-w-md`}>
                    <Icon
                      type={IconType.X}
                      className="absolute right-4 top-4 size-4 opacity-70"
                      aria-hidden
                    />
                    <DialogHeader>
                      <DialogTitle>Reject application</DialogTitle>
                      <DialogDescription>
                        The applicant will be notified and can appeal within 7 days.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                      <Button variant="subtle" value="Keep reviewing" />
                      <Button variant="error" value="Reject application" />
                    </DialogFooter>
                  </div>
                </DialogStage>
              </Fixed>
            </Spec>
          </FrameRow>
        </Section>
      </Frame>

      <Frame name="ProgressBar" meta="4 variants × 4 values">
        <Section
          title="Progress bar"
          description="Shows how much of a review, a budget or a ballot is complete. Green variants come in fixed widths for cards."
        >
          <ComponentSet>
            <VariantGrid
              corner="variant / value"
              rows={progressVariants}
              columns={progressValues}
              columnLabel={(v) => `${v}%`}
              render={(variant, value) => (
                <Fixed width={variant === "green-sm" ? 136 : 228}>
                  <ProgressBar variant={variant} value={Number(value)} />
                </Fixed>
              )}
            />
            <div className="mt-8">
              <Spec label="withLabel" sublabel="variant=green-md">
                <ProgressBar variant="green-md" value={72} withLabel />
              </Spec>
            </div>
          </ComponentSet>
        </Section>
      </Frame>

      <FrameRow>
        <Frame name="CircleStat" meta="3 sizes × 3 thresholds" width={600}>
          <Section
            title="Circle stat"
            description="A score indicator. Below 40% it reads red, below 60% yellow, otherwise green."
          >
            <ComponentSet>
              <VariantGrid
                corner="size / value"
                rows={["small", "medium", "large"] as const}
                columns={["24", "52", "87"] as const}
                rowLabel={(s) => `size=${s}`}
                columnLabel={(v) =>
                  `value=${v} (${Number(v) < 40 ? "low" : Number(v) < 60 ? "mid" : "high"})`
                }
                render={(size, value) => <CircleStat size={size} value={value} />}
              />
            </ComponentSet>
          </Section>
        </Frame>

        <Frame name="Spinner" meta="sm · md" width={300}>
          <Section title="Spinner" description="For inline waits, like a pending transaction.">
            <ComponentSet>
              <div className="flex items-end gap-12">
                <Spec label="size=sm" sublabel="16 px">
                  <Spinner size="sm" />
                </Spec>
                <Spec label="size=md" sublabel="32 px">
                  <Spinner size="md" />
                </Spec>
              </div>
            </ComponentSet>
          </Section>
          <Section title="In context">
            <ComponentSet>
              <div className="flex items-center gap-2 whitespace-nowrap font-ui-mono text-[14px]">
                <Spinner size="sm" />
                Submitting ballot…
              </div>
            </ComponentSet>
          </Section>
        </Frame>
      </FrameRow>

      <Frame name="Skeleton" meta="loading placeholders">
        <Section
          title="Skeleton"
          description="A pulsing grey-100 block that takes the shape of the content it replaces."
        >
          <ComponentSet>
            <SpecGrid columns={4}>
              <Spec label="text lines">
                <div className="flex w-[220px] flex-col gap-2">
                  <Skeleton className="h-6 w-40 rounded-lg" />
                  <Skeleton className="h-4 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4 rounded-lg" />
                </div>
              </Spec>
              <Spec label="avatar + label">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-full" />
                  <Skeleton className="h-5 w-32 rounded-lg" />
                </div>
              </Spec>
              <Spec label="round card">
                <div className="flex w-[260px] flex-col gap-4 rounded-2xl border border-grey-100 p-4">
                  <Skeleton className="h-24 w-full rounded-xl" />
                  <Skeleton className="h-5 w-3/4 rounded-lg" />
                  <div className="flex gap-2">
                    <Skeleton className="h-[22px] w-[82px] rounded-full" />
                    <Skeleton className="h-[22px] w-[112px] rounded-full" />
                  </div>
                </div>
              </Spec>
              <Spec label="stat">
                <Skeleton className="h-[132px] w-[220px] rounded-[24px]" />
              </Spec>
            </SpecGrid>
          </ComponentSet>
        </Section>
      </Frame>
    </Canvas>
  ),
};
