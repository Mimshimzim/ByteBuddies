import type { Achievement } from "@/lib/types";

export const achievements: Achievement[] = [
  { id: "ach-s1-t1", title: "کاوشگر رایانه", description: "اولین آزمون را با موفقیت گذراندی و فهمیدی رایانه چیست.", icon: "🔭", rule: { kind: "topic-passed", topicId: "s1-t1-what-is-computer" } },
  { id: "ach-s1-t2", title: "ردیاب داده", description: "مسیر ورودی، پردازش، خروجی و ذخیره را دنبال کردی.", icon: "🧭", rule: { kind: "topic-passed", topicId: "s1-t2-how-computers-work" } },
  { id: "ach-s1-t3", title: "استاد دسته‌بندی", description: "سخت‌افزار و نرم‌افزار را درست از هم جدا کردی.", icon: "🗂️", rule: { kind: "topic-passed", topicId: "s1-t3-hardware-software" } },
  { id: "ach-s1-t4", title: "کاوشگر سخت‌افزار", description: "قطعه‌های داخل رایانه و کارشان را شناختی.", icon: "🔧", rule: { kind: "topic-passed", topicId: "s1-t4-inside-computer" } },
  { id: "ach-s1-t5", title: "دوست سیستم‌عامل", description: "فهمیدی سیستم‌عامل مدیر پشت صحنهٔ رایانه است.", icon: "🪟", rule: { kind: "topic-passed", topicId: "s1-t5-operating-system" } },
  { id: "ach-s1-t6", title: "پیمایشگر ویندوز", description: "با دسکتاپ، منوی شروع و پنجره‌ها راحت کار می‌کنی.", icon: "🖱️", rule: { kind: "topic-passed", topicId: "s1-t6-navigating-windows" } },
  { id: "ach-s1-t7", title: "پیک امن ایمیل", description: "ایمیل را مؤدبانه و ایمن می‌شناسی.", icon: "✉️", rule: { kind: "topic-passed", topicId: "s1-t7-email" } },
  { id: "ach-lab-assembly", title: "مونتاژکار کوچک", description: "رایانهٔ مجازی را درست سرهم کردی.", icon: "🛠️", rule: { kind: "lab-completed", labId: "computer-assembly" } },
  { id: "ach-lab-desktop", title: "خلبان دسکتاپ", description: "همهٔ ماموریت‌های ویندوز شبیه‌سازی‌شده را انجام دادی.", icon: "🚀", rule: { kind: "lab-completed", labId: "windows-desktop" } },
  { id: "ach-s1-three", title: "سه قدم اول", description: "سه آزمون موضوعی را گذراندی.", icon: "👣", rule: { kind: "topics-passed-count", count: 3 } },
  { id: "ach-s1-five", title: "نیمه‌راه جلسه", description: "پنج آزمون موضوعی را گذراندی.", icon: "⛰️", rule: { kind: "topics-passed-count", count: 5 } },
  { id: "ach-xp-100", title: "جرقهٔ اول", description: "۱۰۰ امتیاز تجربه جمع کردی.", icon: "✨", rule: { kind: "xp-reached", xp: 100 } },
  { id: "ach-xp-300", title: "ستارهٔ درخشان", description: "۳۰۰ امتیاز تجربه جمع کردی.", icon: "🌟", rule: { kind: "xp-reached", xp: 300 } },
  { id: "badge-s1", title: "ماجراجوی رایانه", description: "جلسهٔ اول را با آزمون مرحله‌ای کامل کردی.", icon: "🏅", rule: { kind: "session-complete", sessionId: "s1" } },
];
