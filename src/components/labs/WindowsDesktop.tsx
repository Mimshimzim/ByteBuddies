"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import {
  APPS,
  MISSIONS,
  RECIPIENTS,
  appTitle,
  desktopReducer,
  focusedApp,
  initialDesktopState,
  missionsDone,
  openApps,
  type AppId,
  type DesktopAction,
  type DesktopState,
  type Wallpaper,
} from "./desktopState";
import type { LabProps } from "./types";

const WALLPAPERS: { id: Wallpaper; label: string; cls: string }[] = [
  { id: "sky", label: "آسمان", cls: "bg-gradient-to-br from-sky-300 to-indigo-400" },
  { id: "forest", label: "جنگل", cls: "bg-gradient-to-br from-emerald-300 to-teal-600" },
  { id: "sunset", label: "غروب", cls: "bg-gradient-to-br from-amber-300 to-rose-400" },
];

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600";

function Calculator() {
  const [display, setDisplay] = useState("0");
  const [acc, setAcc] = useState<number | null>(null);
  const [op, setOp] = useState<"+" | "-" | null>(null);
  const [fresh, setFresh] = useState(true);
  const digit = (d: string) => {
    setDisplay((cur) => (fresh || cur === "0" ? d : cur.length < 9 ? cur + d : cur));
    setFresh(false);
  };
  const compute = (a: number, b: number, o: "+" | "-") => (o === "+" ? a + b : a - b);
  const operate = (o: "+" | "-") => {
    const cur = Number(display);
    setAcc(acc !== null && op && !fresh ? compute(acc, cur, op) : cur);
    if (acc !== null && op && !fresh) setDisplay(String(compute(acc, cur, op)));
    setOp(o);
    setFresh(true);
  };
  const equals = () => {
    if (acc !== null && op) {
      setDisplay(String(compute(acc, Number(display), op)));
      setAcc(null);
      setOp(null);
      setFresh(true);
    }
  };
  const clear = () => {
    setDisplay("0");
    setAcc(null);
    setOp(null);
    setFresh(true);
  };
  const btn = `min-h-11 rounded-lg border border-slate-300 bg-white text-base font-semibold hover:bg-slate-100 ${focusRing}`;
  return (
    <div dir="ltr" className="mx-auto w-full max-w-60 space-y-2">
      <output aria-label="صفحهٔ ماشین‌حساب" className="block rounded-lg bg-slate-900 px-3 py-2 text-end text-xl text-white">
        {display}
      </output>
      <div className="grid grid-cols-4 gap-1">
        {["7", "8", "9"].map((d) => (
          <button key={d} type="button" className={btn} onClick={() => digit(d)}>{d}</button>
        ))}
        <button type="button" className={btn} aria-label="جمع" onClick={() => operate("+")}>+</button>
        {["4", "5", "6"].map((d) => (
          <button key={d} type="button" className={btn} onClick={() => digit(d)}>{d}</button>
        ))}
        <button type="button" className={btn} aria-label="تفریق" onClick={() => operate("-")}>−</button>
        {["1", "2", "3"].map((d) => (
          <button key={d} type="button" className={btn} onClick={() => digit(d)}>{d}</button>
        ))}
        <button type="button" className={btn} aria-label="مساوی" onClick={equals}>=</button>
        <button type="button" className={btn} aria-label="پاک کردن" onClick={clear}>C</button>
        <button type="button" className={btn} onClick={() => digit("0")}>0</button>
      </div>
    </div>
  );
}

function AppBody({ app, state, dispatch }: { app: AppId; state: DesktopState; dispatch: (a: DesktopAction) => void }) {
  const [volume, setVolume] = useState(50);
  switch (app) {
    case "files":
      return (
        <div className="space-y-2 text-sm">
          <p className="text-slate-600">پوشه‌های ساختگی (فایل واقعی نیستند):</p>
          <ul className="grid grid-cols-2 gap-2">
            {["تصاویر", "اسناد", "موسیقی", "بازی‌ها"].map((n) => (
              <li key={n} className="rounded-lg border border-slate-200 bg-slate-50 p-2">📁 {n}</li>
            ))}
          </ul>
        </div>
      );
    case "notes":
      return (
        <div className="space-y-2 text-sm">
          <label htmlFor="sim-notes" className="font-semibold">یادداشت ساختگی</label>
          <textarea id="sim-notes" rows={5} className="w-full rounded-lg border border-slate-300 p-2" placeholder="اینجا چیزی بنویس. هیچ جا ذخیره نمی‌شود." />
        </div>
      );
    case "calculator":
      return <Calculator />;
    case "settings":
      return (
        <div className="space-y-3 text-sm">
          <fieldset>
            <legend className="mb-1 font-semibold">تصویر زمینه (ساختگی)</legend>
            <div className="flex flex-wrap gap-2">
              {WALLPAPERS.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  aria-pressed={state.wallpaper === w.id}
                  onClick={() => dispatch({ type: "set-wallpaper", wallpaper: w.id })}
                  className={`min-h-11 rounded-lg border-2 px-3 font-semibold ${focusRing} ${state.wallpaper === w.id ? "border-indigo-600 bg-indigo-50" : "border-slate-300 bg-white"}`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor="sim-volume" className="font-semibold">بلندی صدا (ساختگی): {volume.toLocaleString("fa-IR")}</label>
            <input id="sim-volume" type="range" min={0} max={100} value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="mt-1 w-full" />
          </div>
          <p className="text-xs text-slate-600">در ویندوز واقعی، تغییر تنظیمات سیستم را با دقت و ترجیحاً با اجازهٔ یک بزرگ‌تر انجام بده.</p>
        </div>
      );
    case "mail":
      return (
        <form
          className="space-y-2 text-sm"
          onSubmit={(e) => {
            e.preventDefault();
            dispatch({ type: "mail-send" });
          }}
        >
          <div>
            <label htmlFor="sim-to" className="font-semibold">به</label>
            <select id="sim-to" value={state.mail.to} onChange={(e) => dispatch({ type: "mail-edit", field: "to", value: e.target.value })} className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-2">
              <option value="">یک گیرندهٔ نمونه انتخاب کن</option>
              {RECIPIENTS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sim-subject" className="font-semibold">موضوع</label>
            <input id="sim-subject" value={state.mail.subject} maxLength={80} onChange={(e) => dispatch({ type: "mail-edit", field: "subject", value: e.target.value })} className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 px-2" />
          </div>
          <div>
            <label htmlFor="sim-body" className="font-semibold">متن پیام</label>
            <textarea id="sim-body" rows={4} value={state.mail.body} maxLength={400} onChange={(e) => dispatch({ type: "mail-edit", field: "body", value: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 p-2" placeholder="سلام ... با تشکر" />
          </div>
          <label className="flex min-h-11 items-center gap-2">
            <input type="checkbox" checked={state.mail.attached} onChange={() => dispatch({ type: "mail-toggle-attach" })} />
            <span>افزودن پیوست ساختگی (نقاشی-من.png)</span>
          </label>
          <p className="text-xs text-slate-600">هیچ نام واقعی، شماره یا رمزی وارد نکن. این ایمیل جایی فرستاده نمی‌شود.</p>
          <button type="submit" className={`min-h-11 rounded-lg bg-indigo-600 px-4 font-semibold text-white hover:bg-indigo-700 ${focusRing}`}>ارسال (ساختگی)</button>
          {state.sentCount > 0 && <p className="text-xs text-emerald-800">ایمیل‌های ساختگی ارسال‌شده: {state.sentCount.toLocaleString("fa-IR")}</p>}
        </form>
      );
  }
}

export default function WindowsDesktop({ onComplete, ageBand }: LabProps) {
  const [state, dispatch] = useReducer(desktopReducer, undefined, initialDesktopState);
  const reported = useRef(false);

  useEffect(() => {
    if (state.completed && !reported.current) {
      reported.current = true;
      onComplete();
    }
  }, [state.completed, onComplete]);

  const focused = focusedApp(state);
  const open = openApps(state);
  const wall = WALLPAPERS.find((w) => w.id === state.wallpaper)!.cls;
  const done = missionsDone(state);
  const older = ageBand === "11-14";

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && state.startOpen) {
      dispatch({ type: "close-start" });
    } else if (e.altKey && e.code === "KeyW") {
      e.preventDefault();
      dispatch({ type: "switch-next" });
    }
  };

  return (
    <section dir="rtl" lang="fa" aria-label="آزمایشگاه ویندوز شبیه‌سازی‌شده" onKeyDown={onKeyDown} className="w-full min-w-0 max-w-full space-y-3 rounded-2xl border border-slate-200 bg-white p-3 text-slate-800 sm:p-4">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-lg font-bold">دسکتاپ ویندوز</h3>
          <p className="text-sm text-slate-600">
            <span className="me-2 rounded-full bg-slate-800 px-2 py-0.5 text-xs text-white">شبیه‌سازی</span>
            این ویندوز ساختگی است و به رایانهٔ واقعی تو دست نمی‌زند.
          </p>
        </div>
        <button type="button" onClick={() => dispatch({ type: "reset" })} className={`min-h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold hover:bg-slate-50 ${focusRing}`}>
          از اول
        </button>
      </header>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <h4 className="mb-1 text-sm font-bold">ماموریت‌ها ({done.toLocaleString("fa-IR")} از {MISSIONS.length.toLocaleString("fa-IR")})</h4>
        <ul className="space-y-1 text-sm">
          {MISSIONS.map((m) => (
            <li key={m.id} className={state.done[m.id] ? "text-emerald-800" : "text-slate-700"}>
              <span aria-hidden="true">{state.done[m.id] ? "✅ " : "⬜ "}</span>
              <span className="sr-only">{state.done[m.id] ? "انجام شد: " : "انجام نشده: "}</span>
              {m.text}
            </li>
          ))}
        </ul>
        {older && <p className="mt-2 text-xs text-slate-600">میان‌بر آزمایشگاه: Alt+W هم مثل دکمهٔ جابه‌جایی برنامه‌ها عمل می‌کند. در ویندوز واقعی Alt+Tab را می‌زنی.</p>}
      </div>

      <div role="status" aria-live="polite" className="rounded-xl border-2 border-sky-300 bg-sky-50 p-3 text-sm leading-7 text-sky-900">
        {state.feedback}
      </div>

      <div className={`relative h-[26rem] w-full overflow-hidden rounded-xl border border-slate-300 sm:h-[30rem] ${wall}`}>
        <ul className="absolute inset-y-0 start-0 z-0 flex w-20 flex-col gap-1 p-1">
          {APPS.map((a) => (
            <li key={a.id}>
              <button type="button" onClick={() => dispatch({ type: "open", app: a.id })} aria-label={`باز کردن ${a.title}`} className={`flex min-h-14 w-full flex-col items-center justify-center rounded-lg px-1 text-xs font-semibold text-white hover:bg-white/20 ${focusRing}`}>
                <span aria-hidden="true" className="text-2xl">{a.icon}</span>
                <span className="drop-shadow">{a.title}</span>
              </button>
            </li>
          ))}
        </ul>

        {APPS.map((a, i) => {
          const w = state.windows[a.id];
          if (!w.open) return null;
          const isFocus = focused === a.id;
          return (
            <div
              key={a.id}
              role="dialog"
              aria-label={`پنجرهٔ ${a.title}`}
              hidden={w.minimized}
              style={{ zIndex: w.z + 10, ...(w.maximized ? {} : { top: `${0.5 + i * 0.6}rem` }) }}
              onMouseDown={() => dispatch({ type: "focus", app: a.id })}
              className={`absolute flex flex-col overflow-hidden rounded-lg border bg-white shadow-lg ${isFocus ? "border-indigo-500" : "border-slate-300"} ${
                w.maximized ? "inset-x-0 top-0 bottom-12" : "bottom-16 end-2 start-2 sm:start-24"
              }`}
            >
              <div className={`flex items-center justify-between gap-2 px-2 py-1 ${isFocus ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-700"}`}>
                <span className="min-w-0 truncate text-sm font-semibold">{a.icon} {a.title}</span>
                <span className="flex shrink-0 gap-1">
                  <button type="button" onClick={() => dispatch({ type: "minimize", app: a.id })} aria-label={`کوچک کردن ${a.title}`} className={`min-h-11 min-w-11 rounded bg-white/20 text-lg hover:bg-white/40 ${focusRing}`}>–</button>
                  <button type="button" onClick={() => dispatch({ type: "toggle-maximize", app: a.id })} aria-label={w.maximized ? `بازگرداندن اندازهٔ ${a.title}` : `بزرگ کردن ${a.title}`} className={`min-h-11 min-w-11 rounded bg-white/20 text-lg hover:bg-white/40 ${focusRing}`}>{w.maximized ? "❐" : "▢"}</button>
                  <button type="button" onClick={() => dispatch({ type: "close", app: a.id })} aria-label={`بستن ${a.title}`} className={`min-h-11 min-w-11 rounded bg-rose-500 text-lg text-white hover:bg-rose-600 ${focusRing}`}>✕</button>
                </span>
              </div>
              <div className="min-h-0 flex-1 overflow-auto p-3">
                <AppBody app={a.id} state={state} dispatch={dispatch} />
              </div>
            </div>
          );
        })}

        {state.startOpen && (
          <div role="menu" aria-label="منوی شروع" className="absolute bottom-14 end-2 z-[200] w-60 max-w-[calc(100%-1rem)] rounded-xl border border-slate-300 bg-white p-2 shadow-xl">
            <p className="px-2 pb-1 text-xs font-bold text-slate-500">برنامه‌ها</p>
            {APPS.map((a) => (
              <button key={a.id} type="button" role="menuitem" onClick={() => dispatch({ type: "open", app: a.id })} className={`flex min-h-11 w-full items-center gap-2 rounded-lg px-2 text-start text-sm hover:bg-slate-100 ${focusRing}`}>
                <span aria-hidden="true">{a.icon}</span>
                {a.title}
              </button>
            ))}
            <p className="mt-1 border-t border-slate-200 px-2 pt-2 text-xs text-slate-500">خاموش کردن در این شبیه‌سازی وجود ندارد.</p>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 z-[210] flex min-h-12 items-center gap-1 overflow-x-auto bg-slate-900/90 px-1">
          <button type="button" aria-expanded={state.startOpen} aria-haspopup="menu" onClick={() => dispatch({ type: "toggle-start" })} className={`min-h-11 shrink-0 rounded-lg bg-indigo-500 px-3 text-sm font-bold text-white hover:bg-indigo-400 ${focusRing}`}>
            شروع
          </button>
          <button type="button" onClick={() => dispatch({ type: "switch-next" })} aria-label="جابه‌جایی میان برنامه‌های باز (شبیه Alt+Tab)" className={`min-h-11 shrink-0 rounded-lg bg-slate-700 px-3 text-sm text-white hover:bg-slate-600 ${focusRing}`}>
            جابه‌جایی
          </button>
          <div className="flex min-w-0 flex-1 gap-1" role="toolbar" aria-label="نوار وظیفه، برنامه‌های باز">
            {open.map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={focused === id}
                aria-label={`${appTitle(id)}${state.windows[id].minimized ? " (کوچک‌شده)" : ""}`}
                onClick={() => dispatch({ type: "taskbar", app: id })}
                className={`min-h-11 shrink-0 rounded-lg px-3 text-sm text-white ${focusRing} ${focused === id ? "bg-slate-500" : "bg-slate-700 hover:bg-slate-600"} ${state.windows[id].minimized ? "opacity-70" : ""}`}
              >
                {appTitle(id)}
              </button>
            ))}
          </div>
          <span className="shrink-0 px-2 text-xs text-white" aria-label="ساعت ساختگی">۱۰:۳۰</span>
        </div>
      </div>
    </section>
  );
}
