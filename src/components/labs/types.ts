import type { AgeBand } from "@/lib/types";

/** Props shared by every lab component. `onComplete` is called once when the mastery goal is met. */
export interface LabProps {
  onComplete: () => void;
  ageBand: AgeBand;
}
