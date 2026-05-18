"use client";

export function Header() {
  return (
    <header
      className="sticky top-0 z-50 glass border-b"
      style={{ borderColor: "var(--border-subtle)" }}
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="flex items-baseline gap-2">
          <h1 className="text-2xl font-black brand-gradient">Blaze</h1>
          <span
            className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border"
            style={{
              color: "var(--brand-start)",
              borderColor: "var(--border-default)",
              background: "rgba(249,115,22,0.08)",
            }}
          >
            Beta
          </span>
        </div>
        <div
          className="hidden sm:flex flex-col"
          style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}
        >
          <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>
            Know if the sky is worth the summit
          </span>
          <span>For hikers &amp; trail runners</span>
        </div>
      </div>
    </header>
  );
}
