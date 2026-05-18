"use client";

export function Header() {
  return (
    <header className="sticky top-0 z-50 glass border-b" style={{ borderColor: "rgba(45,63,87,0.6)" }}>
      {/* Subtle radial glow behind wordmark */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute -top-8 left-4 w-48 h-20 rounded-full opacity-20"
          style={{
            background: "radial-gradient(ellipse, var(--brand-start) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
        <div className="flex items-baseline gap-2">
          <h1 className="text-2xl font-black brand-gradient tracking-tight">Blaze</h1>
          <span
            className="text-[0.55rem] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-full"
            style={{
              color: "var(--brand-start)",
              background: "rgba(249,115,22,0.1)",
              border: "1px solid rgba(249,115,22,0.25)",
            }}
          >
            Beta
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5">
          <div
            className="w-px h-4"
            style={{ background: "var(--border-default)" }}
          />
          <p
            className="text-xs font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            Know if the sky is worth the summit
          </p>
        </div>
      </div>
    </header>
  );
}
