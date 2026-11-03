import type { ReactNode } from "react";

/** Isolates LTR technical strings (commands, paths, shortcuts, IPs) inside RTL text. */
export function Ltr({ children, block = false, className = "" }: { children: ReactNode; block?: boolean; className?: string }) {
  return (
    <bdi
      dir="ltr"
      style={{ unicodeBidi: "isolate", display: block ? "block" : "inline-block" }}
      className={className}
    >
      {children}
    </bdi>
  );
}
