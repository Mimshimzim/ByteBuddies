/**
 * Pure state machine for the simulated Windows desktop lab.
 * Everything here is virtual: no real windows, files or messages are touched.
 */

export type AppId = "files" | "notes" | "calculator" | "settings" | "mail";
export type MissionId = "start" | "open-app" | "minimize" | "restore" | "switch" | "settings" | "mail" | "close";
export type Wallpaper = "sky" | "forest" | "sunset";

export interface AppInfo {
  id: AppId;
  title: string;
  icon: string;
}

export const APPS: AppInfo[] = [
  { id: "files", title: "پوشه‌ها", icon: "📁" },
  { id: "notes", title: "یادداشت", icon: "📝" },
  { id: "calculator", title: "ماشین‌حساب", icon: "🧮" },
  { id: "settings", title: "تنظیمات", icon: "⚙️" },
  { id: "mail", title: "ایمیل", icon: "✉️" },
];

export const MISSIONS: { id: MissionId; text: string }[] = [
  { id: "start", text: "منوی شروع را باز کن." },
  { id: "open-app", text: "یک برنامه را باز کن (از منوی شروع یا آیکن‌های دسکتاپ)." },
  { id: "minimize", text: "یک پنجره را کوچک کن." },
  { id: "restore", text: "پنجرهٔ کوچک‌شده را از نوار وظیفه دوباره برگردان." },
  { id: "switch", text: "با دکمهٔ جابه‌جایی برنامه‌ها (شبیه Alt+Tab) میان دو برنامه بگرد." },
  { id: "settings", text: "در تنظیمات ساختگی تصویر زمینه را عوض کن." },
  { id: "mail", text: "یک ایمیل ساختگی با گیرنده، موضوع و متن بنویس و ارسال کن." },
  { id: "close", text: "یک پنجره را ببند." },
];

export const RECIPIENTS = [
  { value: "teacher.demo@example.com", label: "معلم نمونه (teacher.demo@example.com)" },
  { value: "friend.demo@example.com", label: "دوست نمونه (friend.demo@example.com)" },
];

export interface WinState {
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  z: number;
}

export interface MailDraft {
  to: string;
  subject: string;
  body: string;
  attached: boolean;
}

export interface DesktopState {
  windows: Record<AppId, WinState>;
  zCounter: number;
  startOpen: boolean;
  done: Record<MissionId, boolean>;
  wallpaper: Wallpaper;
  mail: MailDraft;
  sentCount: number;
  feedback: string;
  completed: boolean;
}

export type DesktopAction =
  | { type: "toggle-start" }
  | { type: "close-start" }
  | { type: "open"; app: AppId }
  | { type: "close"; app: AppId }
  | { type: "minimize"; app: AppId }
  | { type: "toggle-maximize"; app: AppId }
  | { type: "taskbar"; app: AppId }
  | { type: "focus"; app: AppId }
  | { type: "switch-next" }
  | { type: "set-wallpaper"; wallpaper: Wallpaper }
  | { type: "mail-edit"; field: "to" | "subject" | "body"; value: string }
  | { type: "mail-toggle-attach" }
  | { type: "mail-send" }
  | { type: "reset" };

export function initialDesktopState(): DesktopState {
  const windows = Object.fromEntries(APPS.map((a) => [a.id, { open: false, minimized: false, maximized: false, z: 0 }])) as Record<AppId, WinState>;
  const done = Object.fromEntries(MISSIONS.map((m) => [m.id, false])) as Record<MissionId, boolean>;
  return {
    windows,
    zCounter: 1,
    startOpen: false,
    done,
    wallpaper: "sky",
    mail: { to: "", subject: "", body: "", attached: false },
    sentCount: 0,
    feedback: "به ویندوز شبیه‌سازی‌شده خوش آمدی! ماموریت‌ها را یکی‌یکی انجام بده.",
    completed: false,
  };
}

export const appTitle = (id: AppId) => APPS.find((a) => a.id === id)!.title;
export const openApps = (s: DesktopState): AppId[] => APPS.map((a) => a.id).filter((id) => s.windows[id].open);
export const missionsDone = (s: DesktopState) => MISSIONS.filter((m) => s.done[m.id]).length;

/** The window that currently has focus: highest z among open, non-minimized windows. */
export function focusedApp(s: DesktopState): AppId | null {
  const visible = openApps(s).filter((id) => !s.windows[id].minimized);
  if (visible.length === 0) return null;
  return visible.reduce((a, b) => (s.windows[a].z >= s.windows[b].z ? a : b));
}

function finish(s: DesktopState): DesktopState {
  const completed = MISSIONS.every((m) => s.done[m.id]);
  if (completed && !s.completed) return { ...s, completed: true, feedback: "آفرین! همهٔ ماموریت‌ها انجام شد. حالا با دسکتاپ ویندوز دوست شدی. یادت باشد این یک شبیه‌سازی بود." };
  return s;
}

function bringToFront(s: DesktopState, app: AppId): DesktopState {
  const z = s.zCounter + 1;
  return { ...s, zCounter: z, windows: { ...s.windows, [app]: { ...s.windows[app], z, minimized: false } } };
}

export function desktopReducer(state: DesktopState, action: DesktopAction): DesktopState {
  switch (action.type) {
    case "reset":
      return initialDesktopState();
    case "toggle-start": {
      const startOpen = !state.startOpen;
      return finish({ ...state, startOpen, done: startOpen ? { ...state.done, start: true } : state.done, feedback: startOpen ? "منوی شروع باز شد. از اینجا می‌توانی برنامه‌ها را پیدا کنی." : "منوی شروع بسته شد." });
    }
    case "close-start":
      return state.startOpen ? { ...state, startOpen: false } : state;
    case "open": {
      const w = state.windows[action.app];
      const wasMinimized = w.open && w.minimized;
      const base = bringToFront({ ...state, startOpen: false, windows: { ...state.windows, [action.app]: { ...w, open: true } } }, action.app);
      return finish({
        ...base,
        done: { ...base.done, "open-app": true, restore: base.done.restore || wasMinimized },
        feedback: `پنجرهٔ «${appTitle(action.app)}» باز شد.`,
      });
    }
    case "close": {
      const w = state.windows[action.app];
      if (!w.open) return state;
      return finish({ ...state, windows: { ...state.windows, [action.app]: { ...w, open: false, minimized: false, maximized: false } }, done: { ...state.done, close: true }, feedback: `پنجرهٔ «${appTitle(action.app)}» بسته شد. برنامه تمام شد.` });
    }
    case "minimize": {
      const w = state.windows[action.app];
      if (!w.open || w.minimized) return state;
      return finish({ ...state, windows: { ...state.windows, [action.app]: { ...w, minimized: true } }, done: { ...state.done, minimize: true }, feedback: `«${appTitle(action.app)}» کوچک شد، اما هنوز باز است. روی دکمه‌اش در نوار وظیفه بزن تا برگردد.` });
    }
    case "toggle-maximize": {
      const w = state.windows[action.app];
      if (!w.open) return state;
      const maximized = !w.maximized;
      return { ...state, windows: { ...state.windows, [action.app]: { ...w, maximized } }, feedback: maximized ? "پنجره تمام‌صفحه شد." : "اندازهٔ پنجره به حالت قبل برگشت." };
    }
    case "taskbar": {
      const w = state.windows[action.app];
      if (!w.open) return state;
      if (w.minimized) {
        const s = bringToFront(state, action.app);
        return finish({ ...s, done: { ...s.done, restore: true }, feedback: `«${appTitle(action.app)}» از نوار وظیفه برگشت.` });
      }
      if (focusedApp(state) === action.app) {
        return desktopReducer(state, { type: "minimize", app: action.app });
      }
      return { ...bringToFront(state, action.app), feedback: `«${appTitle(action.app)}» در جلو قرار گرفت.` };
    }
    case "focus": {
      const w = state.windows[action.app];
      if (!w.open || focusedApp(state) === action.app) return state;
      return bringToFront(state, action.app);
    }
    case "switch-next": {
      const open = openApps(state);
      if (open.length < 2) return { ...state, feedback: "برای جابه‌جایی باید حداقل دو برنامه باز باشد. یک برنامهٔ دیگر هم باز کن." };
      const bottom = open.reduce((a, b) => (state.windows[a].z <= state.windows[b].z ? a : b));
      const s = bringToFront(state, bottom);
      return finish({ ...s, done: { ...s.done, switch: true }, feedback: `به «${appTitle(bottom)}» رفتی. در ویندوز واقعی با نگه داشتن Alt و زدن Tab همین کار را می‌کنی.` });
    }
    case "set-wallpaper": {
      if (!state.windows.settings.open) return state;
      const changed = action.wallpaper !== state.wallpaper;
      return finish({ ...state, wallpaper: action.wallpaper, done: changed ? { ...state.done, settings: true } : state.done, feedback: changed ? "تصویر زمینه عوض شد. این تغییر فقط در این شبیه‌سازی است." : "این تصویر همین الان انتخاب شده است." });
    }
    case "mail-edit":
      return { ...state, mail: { ...state.mail, [action.field]: action.value } };
    case "mail-toggle-attach":
      return { ...state, mail: { ...state.mail, attached: !state.mail.attached } };
    case "mail-send": {
      const m = state.mail;
      if (!m.to) return { ...state, feedback: "هنوز گیرنده را انتخاب نکرده‌ای. ایمیل بدون گیرنده به جایی نمی‌رسد." };
      if (!m.subject.trim()) return { ...state, feedback: "موضوع خالی است. یک موضوع کوتاه و روشن بنویس تا گیرنده بداند ایمیل درباره چیست." };
      if (!m.body.trim()) return { ...state, feedback: "متن ایمیل خالی است. چند جملهٔ مؤدبانه بنویس." };
      const greeted = /سلام|درود/.test(m.body);
      return finish({
        ...state,
        mail: { to: "", subject: "", body: "", attached: false },
        sentCount: state.sentCount + 1,
        done: { ...state.done, mail: true },
        feedback: greeted ? "ایمیل ساختگی ارسال شد. سلام و موضوع روشن، ایمیل را مؤدبانه می‌کند. این ایمیل جایی نرفت." : "ایمیل ساختگی ارسال شد. نکته: ایمیل مؤدبانه با «سلام» شروع می‌شود. دفعهٔ بعد حتماً سلام کن. این ایمیل جایی نرفت.",
      });
    }
    default:
      return state;
  }
}
