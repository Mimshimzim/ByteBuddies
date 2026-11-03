import type { ComponentType } from "react";
import type { LabId } from "@/lib/types";
import ComputerAssembly from "./ComputerAssembly";
import WindowsDesktop from "./WindowsDesktop";
import type { LabProps } from "./types";

export type { LabProps } from "./types";

/** Registry of implemented labs. Other engineers add more LabIds here as they are built. */
export const LABS: Partial<Record<LabId, { title: string; Component: ComponentType<LabProps> }>> = {
  "computer-assembly": { title: "آزمایشگاه مونتاژ رایانه", Component: ComputerAssembly },
  "windows-desktop": { title: "دسکتاپ ویندوز شبیه‌سازی‌شده", Component: WindowsDesktop },
};
