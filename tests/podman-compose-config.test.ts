import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

describe("deployment files", () => {
  const compose = read("compose.yaml");
  it("compose uses Containerfile, healthcheck, restart, no source mounts", () => {
    expect(compose).toMatch(/dockerfile:\s*Containerfile/);
    expect(compose).toMatch(/healthcheck:/);
    expect(compose).toMatch(/restart:\s*unless-stopped/);
    expect(compose).not.toMatch(/\n\s*volumes:/);
    expect(compose).not.toMatch(/:latest/);
  });
  it("Containerfile pins base, runs non-root production server", () => {
    const cf = read("Containerfile");
    expect(cf).toMatch(/node:\d+\.\d+-alpine\d/);
    expect(cf).toMatch(/npm ci/);
    expect(cf).toMatch(/USER 10001/);
    expect(cf).toMatch(/CMD \["node", "server\.js"\]/);
    expect(cf).not.toMatch(/next dev/);
  });
  it(".env.example has no secrets and .containerignore excludes env/node_modules", () => {
    expect(read(".env.example")).not.toMatch(/(PASSWORD|SECRET|TOKEN|KEY)=/i);
    const ig = read(".containerignore");
    expect(ig).toMatch(/node_modules/);
    expect(ig).toMatch(/\.env/);
  });
});
