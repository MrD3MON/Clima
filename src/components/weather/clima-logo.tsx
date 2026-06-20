"use client";

import React from "react";
import { cn } from "~/lib/utils";

interface ClimaLogoProps {
  className?: string;
}

export function ClimaLogo({ className }: ClimaLogoProps) {
  return (
    <svg
      viewBox="10 44 68 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-9 w-9 text-primary select-none", className)}
    >
      {/* Dynamic breathing animation on the entire Cloud Cluster */}
      <g className="animate-pulse">
        {/* Back Left Cloud (themed primary color accent) */}
        <path
          d="M 20 55 a 10 10 0 0 1 12 -9.5 a 14 14 0 0 1 24 -4.5 a 11 11 0 0 1 12 14 H 20 z"
          transform="translate(0, 14) scale(0.8)"
          className="fill-primary/20 stroke-primary"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Back Right Cloud (themed muted color) */}
        <path
          d="M 20 55 a 10 10 0 0 1 12 -9.5 a 14 14 0 0 1 24 -4.5 a 11 11 0 0 1 12 14 H 20 z"
          transform="translate(18, 17) scale(0.8)"
          className="fill-muted/75 stroke-foreground"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Front Center Cloud (main card color) */}
        <path
          d="M 20 55 a 10 10 0 0 1 12 -9.5 a 14 14 0 0 1 24 -4.5 a 11 11 0 0 1 12 14 H 20 z"
          transform="translate(6, 22) scale(1)"
          className="fill-card/95 stroke-foreground"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
