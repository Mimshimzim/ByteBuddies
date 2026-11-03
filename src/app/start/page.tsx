"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Mascot } from "@/components/Mascot";
import { useProgress } from "@/components/ProgressProvider";
import { AVATARS, Loading } from "@/components/ui";
import type { AgeBand } from "@/lib/types";

export default function StartPage() {
  const { progress, ready, setProfile } = useProgress();
  const router = useRouter();
  const [nick, setNick] = useState("");
  const [avatar, setAvatar] = useState<string>(AVATARS[0].id);
  const [band, setBand] = useState<AgeBand>("7-10");
  const [err, setErr] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (ready && !loaded) {
      setLoaded(true);
      if (progress.profile) {
        setNick(progress.profile.nickname);
        setAvatar(progress.profile.avatar);
        setBand(progress.profile.ageBand);
      }
    }
  }, [ready, loaded, progress.profile]);

  if (!ready) return <Loading />;
  const editing = !!progress.profile;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = nick.trim();
    if (!n) return setErr("لطفاً یک اسم مستعار بنویس.");
    if (n.length > 20) return setErr("اسم مستعار باید حداکثر ۲۰ حرف باشد.");
    setProfile({ nickname: n, avatar, ageBand: band });
    router.push("/map");
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center gap-4">
        <Mascot size={96} />
        <div>
          <h1 className="text-3xl">{editing ? "ویرایش پروفایل" : "سلام! من بایتی‌ام 👋"}</h1>
          <p className="text-muted">{editing ? "هر چیزی را که دوست داری عوض کن." : "بیا با هم آشنا شویم و ماجراجویی را شروع کنیم."}</p>
        </div>
      </div>
      <form onSubmit={submit} className="card space-y-6 p-6" noValidate>
        <div>
          <label htmlFor="nick" className="mb-1 block font-bold">اسم مستعار تو</label>
          <input id="nick" className="field" value={nick} maxLength={20} autoComplete="off" aria-describedby="nick-help nick-err" aria-invalid={!!err} onChange={(e) => { setNick(e.target.value); setErr(""); }} />
          <p id="nick-help" className="mt-1 text-sm text-muted">اسم واقعی و فامیلی لازم نیست. حداکثر ۲۰ حرف.</p>
          <p id="nick-err" role="alert" className="mt-1 font-bold text-coral-ink">{err}</p>
        </div>

        <fieldset>
          <legend className="mb-2 font-bold">یک شخصیت انتخاب کن</legend>
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {AVATARS.map((a) => (
              <label key={a.id} className={`flex min-h-16 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 p-2 ${avatar === a.id ? "border-brand bg-brand-soft" : "border-line bg-surface"}`}>
                <input type="radio" name="avatar" value={a.id} checked={avatar === a.id} onChange={() => setAvatar(a.id)} className="sr-only-x" />
                <span aria-hidden className="text-3xl">{a.emoji}</span>
                <span className="text-xs">{a.name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 font-bold">چند سال داری؟</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {([["7-10", "۷ تا ۱۰ سال", "توضیح‌های ساده و کوتاه"], ["11-14", "۱۱ تا ۱۴ سال", "توضیح‌های کامل‌تر و نکته‌های بیشتر"]] as const).map(([v, t, d]) => (
              <label key={v} className={`flex min-h-16 cursor-pointer items-center gap-3 rounded-2xl border-2 p-3 ${band === v ? "border-brand bg-brand-soft" : "border-line bg-surface"}`}>
                <input type="radio" name="band" value={v} checked={band === v} onChange={() => setBand(v)} className="h-5 w-5 accent-[var(--brand)]" />
                <span><strong>{t}</strong><br /><span className="text-sm text-muted">{d}</span></span>
              </label>
            ))}
          </div>
        </fieldset>

        <p className="rounded-2xl bg-mint-soft p-4 text-mint-ink">
          🔒 حریم خصوصی: هیچ چیزی از این دستگاه بیرون نمی‌رود. اسم و پیشرفتت فقط در همین مرورگر ذخیره می‌شود و حساب کاربری یا رمز عبور لازم نیست.
        </p>
        <button type="submit" className="btn btn-primary w-full !min-h-14 text-lg">{editing ? "ذخیره" : "شروع ماجراجویی"}</button>
      </form>
    </div>
  );
}
