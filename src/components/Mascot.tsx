/** «بایتی»: the ByteBuddies mascot, an original friendly microchip-robot. */
export function Mascot({ size = 120, mood = "happy", className = "" }: { size?: number; mood?: "happy" | "think" | "cheer"; className?: string }) {
  return (
    <svg
      role="img"
      aria-label="بایتی، ربات مهربان و راهنمای شما"
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={`anim-bob ${className}`}
      style={{ maxWidth: "100%", height: "auto" }}
    >
      <ellipse cx="60" cy="112" rx="30" ry="5" fill="#1e1b3a" opacity=".12" />
      {/* antenna */}
      <line x1="60" y1="14" x2="60" y2="28" stroke="#4f46e5" strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="12" r="6" fill="#f5b301" />
      {/* pins (chip legs) */}
      {[34, 48, 62, 76].map((x) => (
        <rect key={x} x={x + 2} y="98" width="6" height="10" rx="2" fill="#3730a3" />
      ))}
      {/* body */}
      <rect x="18" y="28" width="84" height="72" rx="22" fill="#4f46e5" />
      <rect x="26" y="36" width="68" height="52" rx="16" fill="#e9e8ff" />
      {/* arms */}
      <rect x="8" y="54" width="12" height="22" rx="6" fill="#3730a3" transform={mood === "cheer" ? "rotate(-25 14 54)" : undefined} />
      <rect x="100" y="54" width="12" height="22" rx="6" fill="#3730a3" transform={mood === "cheer" ? "rotate(25 106 54)" : undefined} />
      {/* eyes */}
      {mood === "think" ? (
        <>
          <circle cx="46" cy="58" r="7" fill="#1e1b3a" />
          <circle cx="74" cy="58" r="7" fill="#1e1b3a" />
          <circle cx="48" cy="55" r="2.5" fill="#fff" />
          <circle cx="76" cy="55" r="2.5" fill="#fff" />
          <path d="M50 76 h20" stroke="#1e1b3a" strokeWidth="4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="46" cy="58" r="7" fill="#1e1b3a" />
          <circle cx="74" cy="58" r="7" fill="#1e1b3a" />
          <circle cx="48" cy="56" r="2.5" fill="#fff" />
          <circle cx="76" cy="56" r="2.5" fill="#fff" />
          <path d="M46 72 q14 14 28 0" stroke="#1e1b3a" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      )}
      <circle cx="36" cy="70" r="5" fill="#ef5b5b" opacity=".35" />
      <circle cx="84" cy="70" r="5" fill="#ef5b5b" opacity=".35" />
    </svg>
  );
}
