"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { AgeBand, AttemptRecord, LabId, Profile, ProgressState } from "@/lib/types";
import {
  completeLab as pCompleteLab,
  completeStep as pCompleteStep,
  emptyProgress,
  loadProgress,
  recordAttempt as pRecordAttempt,
  saveProgress,
  STORAGE_KEY,
} from "@/lib/progress";
import { applyAchievements } from "@/hooks/useAchievements";

interface Ctx {
  progress: ProgressState;
  /** false until client-side storage has been read (avoid flashing defaults / overwriting saved data). */
  ready: boolean;
  storageOk: boolean;
  streakDays: number;
  ageBand: AgeBand;
  completeStep: (topicId: string, stepId: string) => void;
  completeLab: (labId: LabId) => void;
  recordAttempt: (
    examId: string,
    kind: "topic" | "checkpoint" | "capstone",
    attempt: AttemptRecord,
    concepts: { concept: string; correct: boolean }[],
  ) => void;
  setProfile: (p: Pick<Profile, "nickname" | "avatar" | "ageBand">) => void;
  resetAll: () => void;
}

const ProgressCtx = createContext<Ctx | null>(null);
const VISIT_KEY = "bytebuddies.visit.v1";

function dayNumber(d: Date) {
  return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000);
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(emptyProgress);
  const [ready, setReady] = useState(false);
  const [storageOk, setStorageOk] = useState(true);
  const [streakDays, setStreakDays] = useState(0);
  const readyRef = useRef(false);

  useEffect(() => {
    const loaded = loadProgress();
    setProgress(applyAchievements(loaded));
    // Gentle streak: kept in its own key; a missed day just restarts quietly at 1.
    try {
      const today = dayNumber(new Date());
      const raw = JSON.parse(window.localStorage.getItem(VISIT_KEY) ?? "null") as { day: number; streak: number } | null;
      let streak = 1;
      if (raw && Number.isFinite(raw.day) && Number.isFinite(raw.streak)) {
        if (raw.day === today) streak = Math.max(1, raw.streak);
        else if (raw.day === today - 1) streak = raw.streak + 1;
      }
      window.localStorage.setItem(VISIT_KEY, JSON.stringify({ day: today, streak }));
      setStreakDays(streak);
    } catch {
      setStorageOk(false);
    }
    readyRef.current = true;
    setReady(true);
  }, []);

  // Persist after the initial read only.
  useEffect(() => {
    if (!ready) return;
    setStorageOk(saveProgress(progress));
  }, [progress, ready]);

  // Keep multiple tabs in sync (last write wins, but we adopt the latest saved data).
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && readyRef.current) setProgress(loadProgress());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const update = useCallback((fn: (s: ProgressState) => ProgressState) => {
    if (!readyRef.current) return;
    setProgress((s) => applyAchievements(fn(s)));
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      progress,
      ready,
      storageOk,
      streakDays,
      ageBand: progress.profile?.ageBand ?? "7-10",
      completeStep: (t, s) => update((st) => pCompleteStep(st, t, s)),
      completeLab: (l) => update((st) => pCompleteLab(st, l)),
      recordAttempt: (e, k, a, c) => update((st) => pRecordAttempt(st, e, k, a, c)),
      setProfile: (p) =>
        update((st) => ({
          ...st,
          profile: { ...p, nickname: p.nickname.trim().slice(0, 20), createdAt: st.profile?.createdAt ?? new Date().toISOString() },
        })),
      resetAll: () => update(() => emptyProgress()),
    }),
    [progress, ready, storageOk, streakDays, update],
  );

  return <ProgressCtx.Provider value={value}>{children}</ProgressCtx.Provider>;
}

export function useProgress(): Ctx {
  const c = useContext(ProgressCtx);
  if (!c) throw new Error("useProgress must be used inside ProgressProvider");
  return c;
}
