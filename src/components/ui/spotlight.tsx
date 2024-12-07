"use client";

import { cn } from "@/lib/utils";

interface SpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  fill?: string;
}

export function Spotlight({ className, fill = "white", ...props }: SpotlightProps) {
  return (
    <svg
      className={cn("animate-spotlight pointer-events-none absolute z-0 h-[169%] w-[138%] opacity-0", className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
      {...props}
    >
      <g filter="url(#filter)">
        <ellipse cx="1924" cy="273" rx="1924" ry="273" fill={fill} fillOpacity="0.1" />
      </g>
      <defs>
        <filter id="filter" x="0" y="-1000" width="3787" height="3842" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="500" result="effect1_foregroundBlur_1065_8" />
        </filter>
      </defs>
    </svg>
  );
}