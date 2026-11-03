import { Notice } from "@/components/ui";

export default function NotFound() {
  return (
    <Notice title="این صفحه پیدا نشد 🧭" action={{ href: "/", label: "بازگشت به خانه" }}>
      بایتی همه‌جا را گشت، اما این صفحه را پیدا نکرد. شاید نشانی را اشتباه نوشته‌ای.
    </Notice>
  );
}
