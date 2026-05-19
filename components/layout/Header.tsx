"use client";

export function Header() {
  return (
    <header
      className="sticky top-0 z-50 glass"
      style={{
        borderBottom: "1px solid rgba(45,63,87,0.5)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.03)",
      }}
    >
      {/* Ambient glow behind wordmark */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="aurora-orb absolute -top-10 -left-4 w-64 h-24 rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(251,146,60,0.22) 0%, transparent 70%)",
            filter: "blur(24px)",
          }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-2">
            <h1
              className="text-[1.6rem] font-black brand-gradient tracking-[-0.04em] leading-none"
            >
              Blaze
            </h1>
            <span
              className="text-[0.5rem] font-black uppercase tracking-[0.2em] px-1.5 py-0.5 rounded-full"
              style={{
                color: "var(--brand-start)",
                background: "rgba(249,115,22,0.12)",
                border: "1px solid rgba(249,115,22,0.3)",
              }}
            >
              Beta
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-px h-3.5" style={{ background: "var(--border-default)" }} />
            <p className="text-[0.72rem] font-medium tracking-wide" style={{ color: "var(--text-muted)" }}>
              Know if the sky is worth the summit
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
