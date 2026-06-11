import { useRef } from "react";
import { useBracket } from "./hooks/useBracket";
import { useScreenshot } from "./hooks/useScreenshot";
import GroupStage from "./components/GroupStage";
import BracketView from "./components/BracketView";
import SharePanel from "./components/SharePanel";
import { getTeam } from "./utils/bracketUtils";

// ─────────────────────────────────────────────────────────────
// SHARE BAR
// ─────────────────────────────────────────────────────────────

function ShareBar({ onDownload, onShare, status, canShare }) {
  const capturing = status === "capturing";
  const done      = status === "done";
  const error     = status === "error";

  return (
    <div className="grad-border rounded-2xl bg-pitch-800 p-px overflow-hidden">
      <div className="rounded-2xl bg-pitch-900 px-6 py-5 flex items-center justify-between gap-6 flex-wrap">
        <div>
          <p className="font-display text-lg font-bold tracking-wide uppercase text-white leading-none">
            Share your prediction
          </p>
          <p className="text-xs text-pitch-500 font-body mt-1.5">
            Download a full-resolution PNG of your completed bracket
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {capturing && (
            <div className="flex items-center gap-2 text-xs text-electric-400 font-body">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Generating…
            </div>
          )}
          {done && (
            <div className="flex items-center gap-1.5 text-xs text-electric-400 font-body animate-fade-up">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Saved!
            </div>
          )}
          {error && <span className="text-xs text-red-400 font-body">Something went wrong — try again</span>}

          <button
            onClick={onDownload}
            disabled={capturing}
            className={[
              "relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-body font-medium",
              "transition-all duration-200 focus-electric",
              capturing
                ? "bg-pitch-800 text-pitch-600 cursor-not-allowed"
                : "bg-electric-500 text-pitch-950 hover:bg-electric-400 shadow-electric hover:shadow-electric active:scale-95",
            ].join(" ")}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PNG
          </button>

          {canShare && (
            <button
              onClick={onShare}
              disabled={capturing}
              className={[
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-body font-medium",
                "border transition-all duration-200 focus-electric",
                capturing
                  ? "border-pitch-700 text-pitch-600 cursor-not-allowed"
                  : "border-electric-500/30 text-electric-400 hover:border-electric-500/60 hover:bg-electric-500/10 active:scale-95",
              ].join(" ")}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SECTION WRAPPER — consistent section header treatment
// ─────────────────────────────────────────────────────────────

export function SectionHeader({ step, title, badge, rightSlot }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
      <div className="flex items-center gap-4">
        {/* Left accent bar + step number */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <div className="w-0.5 h-6 bg-electric-500 rounded-full" />
          <span className="step-label">{step}</span>
        </div>
        <div>
          <h2 className="font-display text-3xl font-black uppercase tracking-tight text-white leading-none">
            {title}
          </h2>
          {badge && (
            <span className="inline-block mt-1.5 text-xs font-mono text-electric-600 tracking-widest uppercase">
              {badge}
            </span>
          )}
        </div>
      </div>
      {rightSlot && <div className="flex-shrink-0">{rightSlot}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────────────────────

export default function App() {
  const {
    groupStage,
    thirdPlace,
    knockout,
    thirdPlaceEligible,
    completedGroups,
    champion,
    selectGroupAdvancer,
    toggleThirdPlace,
    advanceKnockoutTeam,
    resetBracket,
  } = useBracket();

  const panelRef = useRef(null);
  const { download, share, status, canShare } = useScreenshot(panelRef);

  const allTeams     = Object.values(groupStage).flatMap((g) => g.teams);
  const championTeam = allTeams.find((t) => t.id === champion) ?? null;

  return (
    <div className="min-h-screen bg-pitch-950 bg-pitch-lines text-slate-100">

      {/* ── Header ─────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-pitch-700/60 bg-pitch-950/90 backdrop-blur-md">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 flex-shrink-0">
              <div className="absolute inset-0 rounded-lg bg-electric-500/20 animate-pulse-ring" />
              <div className="relative w-8 h-8 rounded-lg bg-pitch-800 border border-electric-500/30 flex items-center justify-center">
                <span className="text-sm leading-none">🏆</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-lg font-black tracking-tight text-white uppercase leading-none">
                WC 2026
              </span>
              <span className="hidden sm:block font-mono text-xs text-electric-600 tracking-wider">
                BRACKET
              </span>
            </div>
          </div>

          {/* Progress + actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Group mini-progress */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pitch-800 border border-pitch-700">
              <div className="flex gap-0.5">
                {Array.from({ length: 12 }, (_, i) => (
                  <div
                    key={i}
                    className={[
                      "w-1.5 h-3 rounded-sm transition-all duration-300",
                      i < completedGroups
                        ? "bg-electric-500"
                        : "bg-pitch-700",
                    ].join(" ")}
                  />
                ))}
              </div>
              <span className="font-mono text-xs text-pitch-500 tabular-nums">
                {completedGroups}/12
              </span>
            </div>

            <span className="sm:hidden font-mono text-xs text-pitch-500">
              {completedGroups}/12
            </span>

            <button
              onClick={() => window.confirm("Reset bracket? This cannot be undone.") && resetBracket()}
              className="text-xs px-3 py-1.5 rounded-lg border border-pitch-700 text-pitch-500 hover:border-red-800 hover:text-red-500 transition-colors focus-electric"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero / Champion banner ─────────────────────── */}
      {championTeam ? (
        <div className="relative overflow-hidden border-b border-gold-500/20 bg-glow-gold">
          <div className="absolute inset-0 bg-net opacity-30" />
          <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 py-10 text-center animate-fade-up">
            <p className="font-mono text-xs tracking-[0.3em] text-gold-600 uppercase mb-3">
              Your World Cup Champion
            </p>
            <p className="font-display font-black uppercase leading-none" style={{ fontSize: "clamp(3rem,8vw,6rem)" }}>
              {championTeam.flag} <span className="text-shimmer"> {championTeam.name}</span>
            </p>
            <p className="mt-3 font-mono text-xs text-gold-600/60 tracking-widest uppercase">
              {championTeam.confederation}
            </p>
          </div>
        </div>
      ) : (
        /* Hero pre-champion — title treatment */
        <div className="relative overflow-hidden border-b border-pitch-700/40">
          <div className="absolute inset-0 bg-net" />
          <div className="absolute inset-0 bg-glow-electric" />
          <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
            <p className="step-label mb-3">FIFA World Cup 2026</p>
            <h1 className="font-display font-black uppercase tracking-tight text-white leading-none" style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)" }}>
              Build Your<br />
              <span className="text-electric-500">Bracket</span>
            </h1>
            <p className="mt-4 text-sm text-pitch-500 font-body max-w-sm">
              Pick 1st, 2nd and 3rd in all 12 groups — then predict every knockout match through to the Final.
            </p>
          </div>
        </div>
      )}

      {/* ── Main content ──────────────────────────────── */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-10 space-y-16">

        <GroupStage
          groupStage={groupStage}
          thirdPlace={thirdPlace}
          thirdPlaceEligible={thirdPlaceEligible}
          completedGroups={completedGroups}
          onSelectAdvancer={selectGroupAdvancer}
          onToggleThirdPlace={toggleThirdPlace}
        />

        <BracketView
          knockout={knockout}
          completedGroups={completedGroups}
          thirdPlaceCount={thirdPlace.length}
          onAdvance={advanceKnockoutTeam}
          getTeam={getTeam}
        />

        <ShareBar
          onDownload={download}
          onShare={share}
          status={status}
          canShare={canShare}
        />

      </main>

      <footer className="border-t border-pitch-800 py-6 text-center">
        <p className="font-mono text-xs text-pitch-700 tracking-wider">
          WC 2026 BRACKET · FOR ENTERTAINMENT PURPOSES ONLY
        </p>
      </footer>

      <SharePanel
        ref={panelRef}
        groupStage={groupStage}
        thirdPlace={thirdPlace}
        knockout={knockout}
        completedGroups={completedGroups}
        champion={champion}
        getTeam={getTeam}
        onAdvance={advanceKnockoutTeam}
      />
    </div>
  );
}