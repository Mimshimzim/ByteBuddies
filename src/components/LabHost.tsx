"use client";
import { LABS } from "@/components/labs";
import type { LabId } from "@/lib/types";
import { useProgress } from "./ProgressProvider";
import { Notice } from "./ui";

/** Renders a lab from the registry; shows a friendly message when a lab is not available yet. */
export function LabHost({ labId, onComplete }: { labId: LabId; onComplete?: () => void }) {
  const { ageBand, completeLab } = useProgress();
  const lab = (LABS as Record<string, (typeof LABS)[LabId] | undefined>)[labId];
  if (!lab) {
    return (
      <Notice title="این تمرین هنوز آماده نیست">
        بایتی دارد آن را می‌سازد. فعلاً درس را ادامه بده و بعداً دوباره سر بزن.
      </Notice>
    );
  }
  const { Component } = lab;
  return (
    <Component
      ageBand={ageBand}
      onComplete={() => {
        completeLab(labId);
        onComplete?.();
      }}
    />
  );
}
