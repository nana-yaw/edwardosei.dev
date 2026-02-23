"use client";

import Image from "next/image";

// ---------------------------------------------------------------------------
// DeviceMockup
// ---------------------------------------------------------------------------
// Pure-CSS device frames for project screenshots. Two variants:
//   desktop -- 16/10 aspect ratio, dark bezel with traffic-light dots
//   mobile  -- 9/19.5 aspect ratio, rounded shell with a centered notch
//
// If `src` is empty or the image hasn't been added yet, a subtle gray
// placeholder with "Screenshot" text is shown instead.
// ---------------------------------------------------------------------------

interface DeviceMockupProps {
  device: "desktop" | "mobile";
  /** Path or URL to the screenshot image */
  src: string;
  alt: string;
  className?: string;
}

// -- Shared frame shadow (works on dark and light backgrounds) --------------

const frameShadow =
  "shadow-[0_8px_30px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)]";

// -- Placeholder shown when no screenshot exists ----------------------------

function Placeholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-neutral-200 dark:bg-neutral-800">
      <span className="text-sm text-neutral-400 dark:text-neutral-500 select-none">
        Screenshot
      </span>
    </div>
  );
}

// -- Desktop ----------------------------------------------------------------

function DesktopFrame({ src, alt, className = "" }: Omit<DeviceMockupProps, "device">) {
  const hasSrc = src.length > 0;

  return (
    <div
      className={[
        "relative w-full rounded-xl overflow-hidden",
        "bg-[#1e1e1e]",       // dark bezel color
        frameShadow,
        className,
      ].join(" ")}
      style={{ aspectRatio: "16 / 10" }}
    >
      {/* --- Top bezel with traffic lights -------------------------------- */}
      <div className="flex items-center gap-1.5 px-3 h-8 bg-[#2a2a2a]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]/70" />
      </div>

      {/* --- Screen area -------------------------------------------------- */}
      <div className="relative w-full" style={{ height: "calc(100% - 2rem)" }}>
        {hasSrc ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <Placeholder />
        )}
      </div>
    </div>
  );
}

// -- Mobile -----------------------------------------------------------------

function MobileFrame({ src, alt, className = "" }: Omit<DeviceMockupProps, "device">) {
  const hasSrc = src.length > 0;

  return (
    <div
      className={[
        "relative w-full rounded-[2rem] overflow-hidden",
        "bg-[#1e1e1e]",
        frameShadow,
        className,
      ].join(" ")}
      style={{ aspectRatio: "9 / 19.5" }}
    >
      {/* --- Top bezel with notch ----------------------------------------- */}
      <div className="relative flex items-start justify-center pt-2 h-10 bg-[#1e1e1e]">
        <div className="w-24 h-5 rounded-b-2xl bg-[#0a0a0a]" />
      </div>

      {/* --- Screen area -------------------------------------------------- */}
      <div className="relative w-full" style={{ height: "calc(100% - 2.5rem)" }}>
        {hasSrc ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 30vw"
          />
        ) : (
          <Placeholder />
        )}
      </div>
    </div>
  );
}

// -- Public component -------------------------------------------------------

export default function DeviceMockup({ device, ...rest }: DeviceMockupProps) {
  return device === "desktop" ? (
    <DesktopFrame {...rest} />
  ) : (
    <MobileFrame {...rest} />
  );
}
