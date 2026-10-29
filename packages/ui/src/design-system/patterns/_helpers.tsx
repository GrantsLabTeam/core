import * as React from "react";

import { http } from "msw";

import { cn } from "@/lib/utils";
import { handlers } from "@/mocks/handlers";

/**
 * Local layout helpers for the "Patterns & Screens" pages.
 * They only add presentation chrome around real feature components.
 */

/** Reads a story's `args` as the full props of the component it was written for. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const argsOf = <C extends React.JSXElementConstructor<any>>(_component: C, args: unknown) =>
  args as React.ComponentProps<C>;

/** A fixed-size artboard body. Clips content and contains `position: fixed` children. */
export const Artboard = ({
  height,
  className,
  children,
}: {
  height?: number;
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={cn("relative overflow-hidden", className)}
    style={{ height, transform: "translateZ(0)" }}
  >
    {children}
  </div>
);

/** Constrains page content to a centered column, like a real product layout grid. */
export const PageColumn = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => <div className={cn("mx-auto w-full max-w-[1200px]", className)}>{children}</div>;

/** Simple page heading used inside artboards to give screens context. */
export const ScreenHeading = ({
  title,
  description,
  className,
  children,
}: {
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}) => (
  <div className={cn("flex items-end justify-between gap-6", className)}>
    <div className="flex flex-col gap-2">
      <h2 className="font-ui-sans text-[32px] font-medium leading-[40px]">{title}</h2>
      {description && (
        <p className="max-w-screen-sm font-ui-sans text-[16px] leading-[26px] text-grey-900">
          {description}
        </p>
      )}
    </div>
    {children}
  </div>
);

/** A labelled specimen on a canvas (mono caption above the component). */
export const Specimen = ({
  label,
  className,
  children,
}: {
  label: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) => (
  <div className={cn("flex flex-col gap-3", className)}>
    <span className="font-ui-mono text-[11px] uppercase leading-[16px] tracking-[0.08em] text-grey-500">
      {label}
    </span>
    {children}
  </div>
);

// ---------------------------------------------------------------------------
// ModalSnapshot
// ---------------------------------------------------------------------------

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Modals are opened one at a time so their portals can be told apart. */
let modalQueue: Promise<void> = Promise.resolve();

/**
 * Shows a real Radix-based modal *inside* a frame.
 *
 * The modal component is briefly opened (it portals to `document.body`), its
 * rendered DOM is cloned into this artboard, and it is closed again. This keeps
 * the real markup and styles while avoiding the modal's page-wide side effects
 * (scroll lock, focus trap, full-viewport overlay) on the showcase canvas.
 * The snapshot is static (not interactive).
 */
export const ModalSnapshot = ({
  height,
  background,
  render,
}: {
  height: number;
  /** Screen rendered underneath the modal. */
  background?: React.ReactNode;
  /** Render the modal; `open` is controlled by the snapshot. */
  render: (open: boolean) => React.ReactNode;
}) => {
  const [open, setOpen] = React.useState(false);
  const layerRef = React.useRef<HTMLDivElement>(null);
  const hostRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let cancelled = false;
    const layer = layerRef.current;

    modalQueue = modalQueue.then(async () => {
      if (cancelled) return;
      const before = new Set(document.querySelectorAll('[role="dialog"]'));
      setOpen(true);

      let dialog: Element | undefined;
      for (let i = 0; i < 100 && !dialog; i++) {
        await wait(50);
        dialog = Array.from(document.querySelectorAll('[role="dialog"]')).find(
          (node) => !before.has(node),
        );
      }
      // Let the enter animation and images settle before cloning.
      await wait(500);

      if (dialog && layer && !cancelled) {
        const inlineOverlay = hostRef.current?.querySelector("[data-state]");
        const nodes = [inlineOverlay, dialog]
          .filter((node): node is Element => Boolean(node))
          .map((node) => node.cloneNode(true) as HTMLElement);
        nodes.forEach((node) => {
          // Removing data-state disables the enter/exit animations on the copy.
          node.removeAttribute("data-state");
          node.removeAttribute("id");
          node.setAttribute("inert", "");
        });
        layer.replaceChildren(...nodes);
      }

      setOpen(false);
      await wait(300);
    });

    return () => {
      cancelled = true;
      layer?.replaceChildren();
    };
  }, []);

  return (
    <Artboard height={height}>
      {background}
      <div ref={layerRef} className="absolute inset-0" />
      <div ref={hostRef} className="hidden">
        {render(open)}
      </div>
    </Artboard>
  );
};

// ---------------------------------------------------------------------------
// IPFS images
// ---------------------------------------------------------------------------

/**
 * Public IPFS gateways are slow and rate-limited, which leaves broken images on
 * the showcase. Serve every `ipfs.io` image from a stable placeholder instead,
 * seeded by CID so each project keeps the same picture.
 */
export const ipfsImageHandler = http.get("https://ipfs.io/ipfs/:cid", ({ params }) =>
  Response.redirect(`https://picsum.photos/seed/${String(params.cid).slice(-12)}/1200/480`, 302),
);

/** Mocks the checker's passport check so verified-credential badges render offline. */
export const passportHandler = http.post(
  "https://api.checker.gitcoin.co/api/passport/validate",
  () =>
    Response.json({
      provider: { twitter: { isVerified: true }, github: { isVerified: true } },
    }),
);

/** Global mock handlers plus the showcase-only mocks above. */
export const patternHandlers = [ipfsImageHandler, passportHandler, ...handlers];
