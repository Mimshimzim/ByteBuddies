import type { ComponentType, ReactNode } from "react";

/** Original inline-SVG teaching illustrations, themed through CSS variables (see .dg in globals.css). */
function Svg({ title, children, h = 300 }: { title: string; children: ReactNode; h?: number }) {
  return (
    <svg className="dg" viewBox={`0 0 600 ${h}`} role="img" aria-label={title} direction="rtl" xmlns="http://www.w3.org/2000/svg">
      <title>{title}</title>
      {children}
    </svg>
  );
}
const T = ({ x, y, children, cls = "" }: { x: number; y: number; children: ReactNode; cls?: string }) => (
  <text x={x} y={y} textAnchor="middle" className={cls}>
    {children}
  </text>
);
const Arrow = ({ d }: { d: string }) => <path d={d} className="ln anim-flow" markerEnd="url(#ah)" />;
const Defs = () => (
  <defs>
    <marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--brand)" />
    </marker>
  </defs>
);

export function ComputerOverview() {
  return (
    <Svg title="اجزای اصلی یک رایانه: صفحه‌نمایش، کیس، صفحه‌کلید و موشواره">
      <Defs />
      <rect x="170" y="30" width="260" height="170" rx="16" className="box-brand" />
      <rect x="186" y="46" width="228" height="134" rx="8" className="box-sky" />
      <T x={300} y={105} cls="t-b">صفحه‌نمایش</T>
      <T x={300} y={128} cls="t-sm">خروجی: نشان می‌دهد</T>
      <rect x="280" y="200" width="40" height="22" className="box-brand" />
      <rect x="240" y="222" width="120" height="12" rx="6" className="box-brand" />
      <rect x="40" y="130" width="90" height="130" rx="12" className="box-sun" />
      <T x={85} y={185} cls="t-b">کیس</T>
      <T x={85} y={207} cls="t-sm">مغز رایانه</T>
      <rect x="170" y="252" width="200" height="36" rx="8" className="box-mint" />
      <T x={270} y={276} cls="t-sm t-b">صفحه‌کلید (ورودی)</T>
      <ellipse cx="470" cy="270" rx="26" ry="18" className="box-coral" />
      <T x={470} y={274} cls="t-sm t-b">موشواره</T>
      <path d="M130 195 H165" className="ln-muted" />
    </Svg>
  );
}

export function InputProcessOutputStorage() {
  const boxes = [
    { x: 460, label: "ورودی", sub: "صفحه‌کلید، موشواره", c: "box-mint" },
    { x: 310, label: "پردازش", sub: "پردازنده فکر می‌کند", c: "box-sun" },
    { x: 160, label: "خروجی", sub: "صفحه‌نمایش، بلندگو", c: "box-sky" },
  ];
  return (
    <Svg title="چرخه ورودی، پردازش، خروجی و ذخیره‌سازی">
      <Defs />
      {boxes.map((b) => (
        <g key={b.label}>
          <rect x={b.x - 60} y="70" width="120" height="90" rx="16" className={b.c} />
          <T x={b.x} y={110} cls="t-b">{b.label}</T>
          <T x={b.x} y={134} cls="t-sm">{b.sub}</T>
        </g>
      ))}
      <Arrow d="M395 115 H375" />
      <Arrow d="M245 115 H225" />
      <rect x="250" y="200" width="120" height="70" rx="16" className="box-coral" />
      <T x={310} y={232} cls="t-b">ذخیره‌سازی</T>
      <T x={310} y={254} cls="t-sm">نگه‌داری برای بعد</T>
      <Arrow d="M310 162 V196" />
      <T x={300} y={36} cls="t-b">داده‌ها همیشه همین مسیر را می‌روند</T>
    </Svg>
  );
}

export function Cpu() {
  return (
    <Svg title="پردازنده: مغز رایانه با هسته‌ها و حافظه نهان">
      <rect x="190" y="50" width="220" height="200" rx="20" className="box-brand" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x={215 + i * 36} y="30" width="12" height="20" className="box-sun" />
          <rect x={215 + i * 36} y="250" width="12" height="20" className="box-sun" />
          <rect x="170" y={80 + i * 32} width="20" height="12" className="box-sun" />
          <rect x="410" y={80 + i * 32} width="20" height="12" className="box-sun" />
        </g>
      ))}
      <rect x="225" y="85" width="150" height="130" rx="12" className="box-sky" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={240 + (i % 2) * 70} y={100 + Math.floor(i / 2) * 55} width="60" height="45" rx="8" className="box-mint" />
      ))}
      <T x={270} y={127} cls="t-sm t-b">هسته ۱</T>
      <T x={340} y={127} cls="t-sm t-b">هسته ۲</T>
      <T x={270} y={182} cls="t-sm t-b">هسته ۳</T>
      <T x={340} y={182} cls="t-sm t-b">هسته ۴</T>
      <T x={500} y={140} cls="t-b">پردازنده</T>
      <T x={500} y={164} cls="t-sm">دستورها را اجرا می‌کند</T>
      <T x={100} y={140} cls="t-b">فکر کردن</T>
      <T x={100} y={164} cls="t-sm">میلیاردها بار در ثانیه</T>
    </Svg>
  );
}

export function RamVsStorage() {
  return (
    <Svg title="مقایسه رم (میز کار، موقت) و حافظه ذخیره‌سازی (کمد، دائمی)">
      <rect x="40" y="40" width="240" height="200" rx="18" className="box-sun" />
      <T x={160} y={80} cls="t-b">رم (RAM)</T>
      <T x={160} y={104} cls="t-sm">مثل میز کار</T>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={65 + i * 52} y="125" width="40" height="46" rx="6" className="box-brand" />
      ))}
      <T x={160} y={205} cls="t-sm">سریع، اما با خاموشی پاک می‌شود</T>
      <rect x="320" y="40" width="240" height="200" rx="18" className="box-mint" />
      <T x={440} y={80} cls="t-b">ذخیره‌سازی</T>
      <T x={440} y={104} cls="t-sm">مثل کمد و قفسه</T>
      <rect x="360" y="122" width="160" height="62" rx="10" className="box-sky" />
      <circle cx="400" cy="153" r="16" className="box-brand" />
      <T x={470} y={158} cls="t-sm">فایل‌ها و برنامه‌ها</T>
      <T x={440} y={205} cls="t-sm">بزرگ‌تر و ماندگار</T>
      <T x={300} y={270} cls="t-sm t-b">برای کار کردن، برنامه از کمد به میز می‌آید</T>
    </Svg>
  );
}

export function Motherboard() {
  return (
    <Svg title="مادربرد: صفحه‌ای که همه قطعه‌ها روی آن به هم وصل می‌شوند">
      <rect x="60" y="20" width="480" height="260" rx="18" className="box-mint" />
      <rect x="230" y="70" width="90" height="90" rx="10" className="box-brand" />
      <T x={275} y={120} cls="t-b">پردازنده</T>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={360 + i * 22} y="50" width="14" height="100" rx="3" className="box-sun" />
      ))}
      <T x={425} y={175} cls="t-sm t-b">جای رم</T>
      <rect x="90" y="60" width="100" height="70" rx="8" className="box-sky" />
      <T x={140} y={100} cls="t-sm t-b">درگاه‌های USB</T>
      <rect x="110" y="195" width="260" height="22" rx="6" className="box-coral" />
      <T x={240} y={211} cls="t-sm t-b">شکاف کارت گرافیک</T>
      <rect x="400" y="215" width="110" height="40" rx="8" className="box-sun" />
      <T x={455} y={240} cls="t-sm t-b">اتصال برق</T>
      <path d="M190 95 H230 M320 115 H355 M275 160 V195" className="ln" />
    </Svg>
  );
}

export function HardwareVsSoftware() {
  return (
    <Svg title="سخت‌افزار قطعه‌های دیدنی است و نرم‌افزار دستورهایی که رایانه را راه می‌اندازد">
      <rect x="30" y="30" width="250" height="230" rx="18" className="box-sun" />
      <T x={155} y={68} cls="t-b">سخت‌افزار</T>
      <T x={155} y={92} cls="t-sm">چیزهایی که می‌شود لمس کرد</T>
      <rect x="70" y="120" width="170" height="26" rx="8" className="box" />
      <T x={155} y={138} cls="t-sm">پردازنده و رم</T>
      <rect x="70" y="156" width="170" height="26" rx="8" className="box" />
      <T x={155} y={174} cls="t-sm">صفحه‌کلید و موشواره</T>
      <rect x="70" y="192" width="170" height="26" rx="8" className="box" />
      <T x={155} y={210} cls="t-sm">صفحه‌نمایش</T>
      <rect x="320" y="30" width="250" height="230" rx="18" className="box-brand" />
      <T x={445} y={68} cls="t-b">نرم‌افزار</T>
      <T x={445} y={92} cls="t-sm">برنامه‌هایی که کار انجام می‌دهند</T>
      <rect x="360" y="120" width="170" height="26" rx="8" className="box" />
      <T x={445} y={138} cls="t-sm">ویندوز</T>
      <rect x="360" y="156" width="170" height="26" rx="8" className="box" />
      <T x={445} y={174} cls="t-sm">مرورگر وب</T>
      <rect x="360" y="192" width="170" height="26" rx="8" className="box" />
      <T x={445} y={210} cls="t-sm">بازی و نقاشی</T>
      <T x={300} y={150} cls="t-b">+</T>
    </Svg>
  );
}

export function OsLayers() {
  const layers = [
    { y: 30, label: "تو (کاربر)", c: "box-mint" },
    { y: 90, label: "برنامه‌ها", c: "box-sky" },
    { y: 150, label: "سیستم‌عامل (ویندوز)", c: "box-brand" },
    { y: 210, label: "سخت‌افزار", c: "box-sun" },
  ];
  return (
    <Svg title="لایه‌های رایانه: کاربر، برنامه‌ها، سیستم‌عامل و سخت‌افزار">
      <Defs />
      {layers.map((l, i) => (
        <g key={l.label}>
          <rect x={90 + i * 0} y={l.y} width="420" height="48" rx="14" className={l.c} />
          <T x={300} y={l.y + 30} cls="t-b">{l.label}</T>
        </g>
      ))}
      <Arrow d="M550 54 V230" />
      <T x={565} y={150} cls="t-sm">درخواست</T>
    </Svg>
  );
}

export function WindowsDesktopParts() {
  return (
    <Svg title="بخش‌های میزکار ویندوز: آیکن‌ها، پنجره، نوار وظیفه و منوی شروع">
      <rect x="30" y="15" width="540" height="270" rx="14" className="box-sky" />
      <rect x="50" y="35" width="50" height="46" rx="8" className="box" />
      <T x={75} y={102} cls="t-sm">آیکن</T>
      <rect x="150" y="40" width="270" height="150" rx="10" className="box" />
      <rect x="150" y="40" width="270" height="28" rx="10" className="box-brand" />
      <T x={285} y={60} cls="t-sm t-b">پنجره‌ی برنامه</T>
      <rect x="390" y="44" width="22" height="20" rx="4" className="box-coral" />
      <T x={285} y={130} cls="t-sm">اینجا کار می‌کنی</T>
      <rect x="30" y="245" width="540" height="40" rx="10" className="box-brand" />
      <rect x="520" y="251" width="40" height="28" rx="8" className="box-sun" />
      <T x={540} y={270} cls="t-sm t-b">شروع</T>
      <T x={285} y={270} cls="t-sm t-b">نوار وظیفه</T>
      <T x={80} y={270} cls="t-sm">ساعت</T>
      <path d="M470 150 L450 245" className="ln-muted" />
      <T x={500} y={140} cls="t-sm">منوی شروع</T>
    </Svg>
  );
}

export function EmailAnatomy() {
  return (
    <Svg title="بخش‌های یک نامه الکترونیکی: گیرنده، موضوع، متن و پیوست">
      <rect x="60" y="20" width="480" height="260" rx="16" className="box" />
      <rect x="60" y="20" width="480" height="40" rx="16" className="box-brand" />
      <T x={300} y={46} cls="t-b">نامه‌ی جدید</T>
      <rect x="80" y="76" width="440" height="30" rx="8" className="box-mint" />
      <T x={470} y={96} cls="t-sm t-b">به:</T>
      <text x="90" y="96" className="t-sm" direction="ltr">friend@example.com</text>
      <rect x="80" y="116" width="440" height="30" rx="8" className="box-sun" />
      <T x={455} y={136} cls="t-sm t-b">موضوع:</T>
      <T x={250} y={136} cls="t-sm">سلام از طرف من!</T>
      <rect x="80" y="156" width="440" height="70" rx="8" className="box-sky" />
      <T x={300} y={196} cls="t-sm">متن نامه اینجا نوشته می‌شود</T>
      <rect x="80" y="236" width="150" height="30" rx="15" className="box-coral" />
      <T x={155} y={256} cls="t-sm t-b">پیوست</T>
      <rect x="440" y="236" width="80" height="30" rx="15" className="box-brand" />
      <T x={480} y={256} cls="t-sm t-b">ارسال</T>
    </Svg>
  );
}

export function UnknownDiagram({ name }: { name?: string }) {
  return (
    <Svg title="تصویر آموزشی هنوز آماده نیست" h={160}>
      <rect x="40" y="20" width="520" height="120" rx="16" className="box-sun" strokeDasharray="8 6" />
      <T x={300} y={70} cls="t-b">این تصویر آموزشی به‌زودی آماده می‌شود</T>
      <T x={300} y={100} cls="t-sm">برای ادامه‌ی درس، فقط متن را بخوان.</T>
      {name && <text x="300" y="124" textAnchor="middle" className="t-sm" direction="ltr" opacity=".6">{name}</text>}
    </Svg>
  );
}

export const DIAGRAMS: Record<string, ComponentType> = {
  "computer-overview": ComputerOverview,
  "input-process-output-storage": InputProcessOutputStorage,
  cpu: Cpu,
  "ram-vs-storage": RamVsStorage,
  motherboard: Motherboard,
  "hardware-vs-software": HardwareVsSoftware,
  "os-layers": OsLayers,
  "windows-desktop-parts": WindowsDesktopParts,
  "email-anatomy": EmailAnatomy,
};

export function Diagram({ name }: { name: string }) {
  const C = DIAGRAMS[name];
  return C ? <C /> : <UnknownDiagram name={name} />;
}
