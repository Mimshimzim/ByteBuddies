import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ProgressProvider } from "@/components/ProgressProvider";
import { AppShell } from "@/components/AppShell";

const vazir = localFont({
  src: [
    { path: "./fonts/Vazirmatn-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Vazirmatn-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Vazirmatn-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-vazir",
  display: "swap",
  fallback: ["Tahoma", "Segoe UI", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: { default: "بایت‌بادی‌ها | یادگیری رایانه برای کودکان و نوجوانان", template: "%s | بایت‌بادی‌ها" },
  description: "یادگیری مبانی رایانه به زبان ساده و بازی‌گونه برای ۷ تا ۱۴ سال، همراه با بایتی.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#4f46e5" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable}>
      <body>
        <ProgressProvider>
          <AppShell>{children}</AppShell>
        </ProgressProvider>
      </body>
    </html>
  );
}
