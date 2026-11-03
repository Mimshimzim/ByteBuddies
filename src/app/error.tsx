"use client";
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div role="alert" className="card mx-auto max-w-xl p-8 text-center">
      <h1 className="text-2xl">اوه! مشکلی پیش آمد 😕</h1>
      <p className="mt-2 text-muted">نگران نباش، پیشرفتت از بین نرفته. دوباره امتحان کن.</p>
      <button type="button" className="btn btn-primary mt-4" onClick={reset}>تلاش دوباره</button>
    </div>
  );
}
