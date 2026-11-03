/**
 * Pure state machine for the computer-assembly lab.
 * No React or DOM here so tests can cover every transition.
 */

export type PartId = "motherboard" | "cpu" | "ram" | "ssd" | "hdd" | "psu" | "monitor" | "keyboard" | "mouse";
export type SlotId = "case" | "cpu-socket" | "ram-slot" | "storage-bay" | "psu-bay" | "monitor-port" | "keyboard-port" | "mouse-port";

export interface PartInfo {
  id: PartId;
  name: string;
  /** Short explanation shown after a correct placement. */
  role: string;
  /** Extra detail for ages 11-14. */
  older: string;
}

export interface SlotInfo {
  id: SlotId;
  name: string;
  accepts: PartId[];
  /** Slot that must be filled first (e.g. motherboard before CPU). */
  requires?: SlotId;
  group: "inside" | "outside";
}

export const PARTS: PartInfo[] = [
  { id: "motherboard", name: "مادربرد", role: "مادربرد مثل شهری است که همهٔ قطعه‌ها در آن جا می‌گیرند و با هم ارتباط دارند.", older: "مادربرد برد مدارچاپی اصلی است؛ مسیرهای ارتباطی (باس) میان پردازنده، رم، حافظهٔ ذخیره‌سازی و درگاه‌ها را فراهم می‌کند." },
  { id: "cpu", name: "پردازنده (CPU)", role: "پردازنده مغز رایانه است و دستورهای برنامه‌ها را اجرا می‌کند.", older: "پردازنده با چرخهٔ خواندن، رمزگشایی و اجرا دستورها را انجام می‌دهد و معمولاً زیر یک خنک‌کننده قرار دارد." },
  { id: "ram", name: "رم (RAM)", role: "رم میز کار سریع و موقت است: برنامه‌های در حال استفاده در آن قرار می‌گیرند و با خاموشی پاک می‌شوند.", older: "رم حافظهٔ ناپایدار با دسترسی تصادفی است؛ ظرفیت بیشتر آن اجازه می‌دهد برنامه‌های بیشتری هم‌زمان بی‌کندی کار کنند." },
  { id: "ssd", name: "حافظهٔ SSD", role: "SSD جای نگه‌داری دائمی ویندوز، برنامه‌ها و فایل‌هاست و قطعهٔ متحرک ندارد، پس معمولاً سریع‌تر است.", older: "SSD روی تراشه‌های فلش اطلاعات را نگه می‌دارد؛ تأخیر کمتر و مقاومت بیشتر در برابر ضربه نسبت به HDD دارد." },
  { id: "hdd", name: "دیسک سخت (HDD)", role: "HDD هم جای نگه‌داری دائمی است و با صفحه‌های مغناطیسی چرخان کار می‌کند؛ معمولاً ارزان‌تر و کندتر از SSD است.", older: "HDD با سر خواندن‌ونوشتن روی دیسک‌های چرخان کار می‌کند و به‌خاطر قطعهٔ متحرک نسبت به ضربه حساس‌تر است." },
  { id: "psu", name: "منبع تغذیه", role: "منبع تغذیه برق خانه را به برق مناسب قطعه‌ها تبدیل می‌کند و می‌رساند. داخلش خطرناک است و نباید بازش کرد.", older: "منبع تغذیه برق متناوب را به ولتاژهای مستقیم و کم (مثل ۵ و ۱۲ ولت) تبدیل می‌کند و با کابل‌هایی به قطعه‌ها می‌رساند." },
  { id: "monitor", name: "نمایشگر", role: "نمایشگر دستگاه خروجی است و تصویر را نشان می‌دهد.", older: "نمایشگر از طریق درگاهی مثل HDMI تصویر را از کارت گرافیک یا پردازنده می‌گیرد." },
  { id: "keyboard", name: "صفحه‌کلید", role: "صفحه‌کلید دستگاه ورودی برای تایپ حرف‌ها و دستورهاست.", older: "صفحه‌کلید برای هر کلید کدی می‌فرستد و ویندوز با آن می‌فهمد کدام حرف زده شده است." },
  { id: "mouse", name: "ماوس", role: "ماوس دستگاه ورودی برای حرکت دادن اشاره‌گر و کلیک کردن است.", older: "ماوس حرکت و کلیک را به شکل داده به رایانه می‌فرستد و ویندوز اشاره‌گر را به آن شکل حرکت می‌دهد." },
];

export const SLOTS: SlotInfo[] = [
  { id: "case", name: "جای مادربرد در کیس", accepts: ["motherboard"], group: "inside" },
  { id: "cpu-socket", name: "سوکت پردازنده روی مادربرد", accepts: ["cpu"], requires: "case", group: "inside" },
  { id: "ram-slot", name: "شکاف رم روی مادربرد", accepts: ["ram"], requires: "case", group: "inside" },
  { id: "storage-bay", name: "محل حافظهٔ ذخیره‌سازی", accepts: ["ssd", "hdd"], requires: "case", group: "inside" },
  { id: "psu-bay", name: "جای منبع تغذیه در کیس", accepts: ["psu"], group: "inside" },
  { id: "monitor-port", name: "درگاه نمایشگر", accepts: ["monitor"], requires: "case", group: "outside" },
  { id: "keyboard-port", name: "درگاه صفحه‌کلید", accepts: ["keyboard"], requires: "case", group: "outside" },
  { id: "mouse-port", name: "درگاه ماوس", accepts: ["mouse"], requires: "case", group: "outside" },
];

export type FeedbackKind = "info" | "ok" | "error" | "done";
export interface Feedback {
  kind: FeedbackKind;
  text: string;
}

export interface AssemblyState {
  placed: Record<SlotId, PartId | null>;
  selected: PartId | null;
  feedback: Feedback;
  mistakes: number;
  completed: boolean;
}

export type AssemblyAction =
  | { type: "select"; part: PartId }
  | { type: "deselect" }
  | { type: "place"; slot: SlotId; part?: PartId }
  | { type: "reset" };

export const partInfo = (id: PartId): PartInfo => PARTS.find((p) => p.id === id)!;
export const slotInfo = (id: SlotId): SlotInfo => SLOTS.find((s) => s.id === id)!;

export function initialAssemblyState(): AssemblyState {
  const placed = Object.fromEntries(SLOTS.map((s) => [s.id, null])) as Record<SlotId, PartId | null>;
  return {
    placed,
    selected: null,
    feedback: { kind: "info", text: "یک قطعه را بکش یا انتخاب کن و سپس روی جای مناسبش بگذار. از مادربرد شروع کن." },
    mistakes: 0,
    completed: false,
  };
}

export function placedSlotOf(state: AssemblyState, part: PartId): SlotId | null {
  const found = SLOTS.find((s) => state.placed[s.id] === part);
  return found ? found.id : null;
}

/** All slots filled with a correct part. SSD and HDD are alternatives: either one satisfies the storage bay. */
export function isComplete(state: AssemblyState): boolean {
  return SLOTS.every((s) => {
    const p = state.placed[s.id];
    return p !== null && s.accepts.includes(p);
  });
}

export function filledCount(state: AssemblyState): number {
  return SLOTS.filter((s) => state.placed[s.id] !== null).length;
}

const wrongSlotHint: Record<PartId, string> = {
  motherboard: "مادربرد باید داخل کیس نصب شود تا بقیهٔ قطعه‌ها روی آن بنشینند.",
  cpu: "پردازنده در سوکت مخصوص خودش روی مادربرد قرار می‌گیرد.",
  ram: "رم در شکاف‌های بلند و باریک مخصوص رم روی مادربرد جا می‌شود.",
  ssd: "حافظهٔ ذخیره‌سازی در محل مخصوص حافظه‌ها نصب می‌شود.",
  hdd: "حافظهٔ ذخیره‌سازی در محل مخصوص حافظه‌ها نصب می‌شود.",
  psu: "منبع تغذیه در جای مخصوص خودش در کیس قرار می‌گیرد.",
  monitor: "نمایشگر یک دستگاه بیرونی است و از طریق درگاه نمایشگر وصل می‌شود.",
  keyboard: "صفحه‌کلید یک دستگاه بیرونی است و به درگاه صفحه‌کلید وصل می‌شود.",
  mouse: "ماوس یک دستگاه بیرونی است و به درگاه ماوس وصل می‌شود.",
};

export function assemblyReducer(state: AssemblyState, action: AssemblyAction): AssemblyState {
  switch (action.type) {
    case "reset":
      return initialAssemblyState();
    case "deselect":
      return { ...state, selected: null };
    case "select": {
      if (placedSlotOf(state, action.part)) {
        return { ...state, selected: null, feedback: { kind: "info", text: `${partInfo(action.part).name} قبلاً جایش را پیدا کرده است. اگر می‌خواهی دوباره شروع کنی، دکمهٔ «از اول» را بزن.` } };
      }
      if (state.selected === action.part) return { ...state, selected: null };
      return { ...state, selected: action.part, feedback: { kind: "info", text: `«${partInfo(action.part).name}» انتخاب شد. حالا روی جای مناسبش بزن.` } };
    }
    case "place": {
      const part = action.part ?? state.selected;
      if (!part) {
        return { ...state, feedback: { kind: "info", text: "اول یک قطعه را از سبد انتخاب کن یا بکش." } };
      }
      if (placedSlotOf(state, part)) {
        return { ...state, selected: null, feedback: { kind: "info", text: `${partInfo(part).name} همین الان نصب شده است.` } };
      }
      const slot = slotInfo(action.slot);
      if (state.placed[slot.id] !== null) {
        return { ...state, selected: null, feedback: { kind: "info", text: "این جا قبلاً پر شده است." } };
      }
      const p = partInfo(part);
      if (!slot.accepts.includes(part)) {
        return {
          ...state,
          selected: null,
          mistakes: state.mistakes + 1,
          feedback: { kind: "error", text: `${p.name} اینجا جا نمی‌شود. ${wrongSlotHint[part]} دوباره امتحان کن، اشتباه کردن بخشی از یادگیری است.` },
        };
      }
      if (slot.requires && state.placed[slot.requires] === null) {
        return {
          ...state,
          selected: null,
          mistakes: state.mistakes + 1,
          feedback: { kind: "error", text: `جای درست است ولی زود است! اول باید مادربرد را داخل کیس بگذاری، چون ${p.name} به مادربرد وصل می‌شود.` },
        };
      }
      const placed = { ...state.placed, [slot.id]: part };
      const next: AssemblyState = { ...state, placed, selected: null, feedback: { kind: "ok", text: `درست است! ${p.role}` } };
      if (isComplete(next)) {
        return { ...next, completed: true, feedback: { kind: "done", text: "آفرین! رایانه کامل شد. هر قطعه کار خودش را دارد و همه با هم یک رایانه می‌سازند. این یک شبیه‌سازی بود و برای رایانهٔ واقعی باید از بزرگ‌ترها کمک بگیری." } };
      }
      return next;
    }
    default:
      return state;
  }
}
