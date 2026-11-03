"use client";

import { useEffect, useReducer, useRef } from "react";
import {
  PARTS,
  SLOTS,
  assemblyReducer,
  filledCount,
  initialAssemblyState,
  partInfo,
  placedSlotOf,
  type PartId,
  type SlotId,
} from "./assemblyState";
import type { LabProps } from "./types";

const feedbackStyle = {
  info: "border-sky-300 bg-sky-50 text-sky-900",
  ok: "border-emerald-300 bg-emerald-50 text-emerald-900",
  error: "border-amber-400 bg-amber-50 text-amber-900",
  done: "border-emerald-500 bg-emerald-100 text-emerald-950",
} as const;

export default function ComputerAssembly({ onComplete, ageBand }: LabProps) {
  const [state, dispatch] = useReducer(assemblyReducer, undefined, initialAssemblyState);
  const reported = useRef(false);

  useEffect(() => {
    if (state.completed && !reported.current) {
      reported.current = true;
      onComplete();
    }
  }, [state.completed, onComplete]);

  const total = SLOTS.length;
  const filled = filledCount(state);
  const older = ageBand === "11-14";

  const onDragStart = (e: React.DragEvent, part: PartId) => {
    e.dataTransfer.setData("text/plain", part);
    e.dataTransfer.effectAllowed = "move";
    dispatch({ type: "select", part });
  };
  const onDrop = (e: React.DragEvent, slot: SlotId) => {
    e.preventDefault();
    const part = e.dataTransfer.getData("text/plain") as PartId;
    dispatch({ type: "place", slot, part: PARTS.some((p) => p.id === part) ? part : undefined });
  };

  const renderSlot = (slotId: SlotId) => {
    const slot = SLOTS.find((s) => s.id === slotId)!;
    const part = state.placed[slot.id];
    return (
      <button
        key={slot.id}
        type="button"
        onClick={() => dispatch({ type: "place", slot: slot.id })}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => onDrop(e, slot.id)}
        aria-label={part ? `${slot.name}: ${partInfo(part).name} نصب شده است` : `${slot.name}: خالی. برای گذاشتن قطعهٔ انتخاب‌شده فعال کن`}
        className={`min-h-14 w-full min-w-0 rounded-xl border-2 px-3 py-2 text-start text-sm transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
          part ? "border-emerald-500 bg-emerald-50 text-emerald-900" : state.selected ? "border-dashed border-indigo-400 bg-indigo-50 text-slate-800 hover:bg-indigo-100" : "border-dashed border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
        }`}
      >
        <span className="block font-semibold">{slot.name}</span>
        <span className="block break-words">{part ? `✓ ${partInfo(part).name}` : "خالی"}</span>
      </button>
    );
  };

  return (
    <section dir="rtl" lang="fa" aria-label="آزمایشگاه مونتاژ رایانه (شبیه‌سازی)" className="w-full min-w-0 max-w-full space-y-4 rounded-2xl border border-slate-200 bg-white p-3 text-slate-800 sm:p-4">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-lg font-bold">رایانه را سرهم کن</h3>
          <p className="text-sm text-slate-600">
            <span className="me-2 rounded-full bg-slate-800 px-2 py-0.5 text-xs text-white">شبیه‌سازی</span>
            قطعه را بکش و رها کن، یا آن را انتخاب کن و روی جایش بزن.
          </p>
        </div>
        <button
          type="button"
          onClick={() => dispatch({ type: "reset" })}
          className="min-h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"
        >
          از اول
        </button>
      </header>

      <div role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={filled} aria-label="پیشرفت مونتاژ" className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div className="h-full bg-emerald-500 transition-all motion-reduce:transition-none" style={{ width: `${(filled / total) * 100}%` }} />
      </div>

      <div role="status" aria-live="polite" className={`rounded-xl border-2 p-3 text-sm leading-7 ${feedbackStyle[state.feedback.kind]}`}>
        {state.feedback.text}
      </div>

      <div>
        <h4 className="mb-2 text-sm font-bold">سبد قطعه‌ها</h4>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {PARTS.map((p) => {
            const done = placedSlotOf(state, p.id) !== null;
            const sel = state.selected === p.id;
            return (
              <button
                key={p.id}
                type="button"
                draggable={!done}
                disabled={done}
                aria-pressed={sel}
                aria-label={done ? `${p.name}: نصب شده` : `${p.name}${sel ? " (انتخاب‌شده)" : ""}`}
                onClick={() => dispatch({ type: "select", part: p.id })}
                onDragStart={(e) => onDragStart(e, p.id)}
                className={`min-h-12 min-w-0 rounded-xl border-2 px-2 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                  done ? "border-slate-200 bg-slate-100 text-slate-400" : sel ? "border-indigo-600 bg-indigo-100 text-indigo-900" : "cursor-grab border-slate-300 bg-white hover:bg-slate-50"
                }`}
              >
                {done ? "✓ " : ""}
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2 rounded-xl bg-slate-50 p-3">
          <h4 className="text-sm font-bold">داخل کیس</h4>
          {SLOTS.filter((s) => s.group === "inside").map((s) => renderSlot(s.id))}
        </div>
        <div className="space-y-2 rounded-xl bg-slate-50 p-3">
          <h4 className="text-sm font-bold">بیرون کیس (لوازم جانبی)</h4>
          {SLOTS.filter((s) => s.group === "outside").map((s) => renderSlot(s.id))}
        </div>
      </div>

      {state.selected && (
        <div className="rounded-xl border border-slate-200 p-3 text-sm leading-7">
          <p className="font-semibold">{partInfo(state.selected).name}</p>
          <p>{older ? partInfo(state.selected).older : partInfo(state.selected).role}</p>
          <button type="button" onClick={() => dispatch({ type: "deselect" })} className="mt-2 min-h-11 rounded-lg border border-slate-300 px-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600">
            رها کردن انتخاب
          </button>
        </div>
      )}

      <p className="text-xs leading-6 text-slate-600">
        نکته: SSD و HDD هر دو حافظهٔ دائمی‌اند؛ یکی از آن‌ها را نصب کن. این فقط یک شبیه‌سازی است و به رایانهٔ واقعی تو دست نمی‌زند. باز کردن رایانهٔ واقعی را فقط با کمک یک بزرگ‌تر انجام بده.
        {older ? " در مونتاژ واقعی اتصال کابل‌های برق قطعه‌ها از منبع تغذیه و نصب خنک‌کنندهٔ پردازنده هم لازم است." : ""}
      </p>
      {state.mistakes > 0 && <p className="text-xs text-slate-500">تعداد تلاش‌های ناموفق: {state.mistakes.toLocaleString("fa-IR")}. ایرادی ندارد!</p>}
    </section>
  );
}
