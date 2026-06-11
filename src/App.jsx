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

function ShareBar({ onDownload, onShare, status, canShare, isReady }) {
  const capturing = status === "capturing";
  const done      = status === "done";
  const error     = status === "error";

  return (
    <div className="rounded-xl border border-pitch-700 bg-pitch-900 px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
      <div>
        <p className="font-display text-sm font-bold tracking-wide uppercase text-white">
          Share Your Bracket
        </p>
        <p className="text-xs text-gray-500 font-body mt-0.5">
          {isReady
            ? "Your bracket is ready to download or share"
            : "Complete the group stage and knockout bracket to share"}
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Status feedback */}
        {capturing && (
          <div className="flex items-center gap-2 text-xs text-gray-400 font-body">
            <svg className="w-4 h-4 animate-spin text-grass-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            Generating image…
          </div>
        )}
        {done && (
          <div className="flex items-center gap-1.5 text-xs text-grass-400 font-body">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Done!
          </div>
        )}
        {error && (
          <span className="text-xs text-red-400 font-body">
            Something went wrong — try again
          </span>
        )}

        {/* Download button — always shown */}
        <button
          onClick={onDownload}
          disabled={capturing}
          className={[
            "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-body",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grass-500",
            capturing
              ? "border-pitch-700 text-gray-600 cursor-not-allowed"
              : "border-grass-500/40 bg-grass-500/10 text-grass-300 hover:bg-grass-500/20",
          ].join(" ")}
        >
          {/* Download icon */}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PNG
        </button>

        {/* Share button — only on supporting browsers */}
        {canShare && (
          <button
            onClick={onShare}
            disabled={capturing}
            className={[
              "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-body",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400",
              capturing
                ? "border-pitch-700 text-gray-600 cursor-not-allowed"
                : "border-gold-500/40 bg-gold-500/10 text-gold-300 hover:bg-gold-500/20",
            ].join(" ")}
          >
            {/* Share icon */}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        )}
      </div>
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

  // Ref for the SharePanel — passed to useScreenshot
  const panelRef = useRef(null);
  const { download, share, status, canShare } = useScreenshot(panelRef);

  // Bracket is "ready to share" once all groups and knockout are complete
  const isReady = completedGroups === 12 && thirdPlace.length === 8;

  // Champion team object for the top banner
  const allTeams     = Object.values(groupStage).flatMap((g) => g.teams);
  const championTeam = allTeams.find((t) => t.id === champion) ?? null;

  return (
    <div className="min-h-screen pitch-texture bg-pitch-950 text-gray-100">

      {/* ── Header ───────────────────────────────────────── */}
      <header className="border-b border-pitch-700 bg-pitch-900/90 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-lg bg-grass-500/20 border border-grass-500/30 flex items-center justify-center">
              <span className="text-lg leading-none">🏆</span>
            </div>
            <div>
              <h1 className="font-display text-xl font-bold tracking-wide text-white uppercase leading-none">
                WC 2026
              </h1>
              <p className="font-display text-xs text-grass-500 tracking-widest uppercase leading-none mt-0.5">
                Bracket Predictor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Group progress pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pitch-800 border border-pitch-700">
              <div className="flex gap-0.5">
                {Array.from({ length: 12 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-3 rounded-sm transition-colors duration-300 ${
                      i < completedGroups ? "bg-grass-500" : "bg-pitch-600"
                    }`}
                  />
                ))}
              </div>
              <span className="font-display text-xs text-gray-400 tracking-wider">
                {completedGroups}/12
              </span>
            </div>

            <span className="sm:hidden text-xs text-gray-400">
              {completedGroups}/12 groups
            </span>

            <button
              onClick={() => {
                if (window.confirm("Reset your entire bracket? This cannot be undone.")) {
                  resetBracket();
                }
              }}
              className={[
                "text-xs px-3 py-1.5 rounded-lg border transition-colors duration-150",
                "border-pitch-700 text-gray-500",
                "hover:border-red-700/60 hover:text-red-400",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500",
              ].join(" ")}
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ─────────────────────────────────────────── */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-8 space-y-14">

        {/* Champion Banner */}
        {championTeam && (
          <div className="rounded-2xl border border-gold-500/40 bg-gradient-to-b from-gold-500/10 to-transparent p-6 text-center">
            <p className="font-display text-xs tracking-[0.25em] text-gold-500 uppercase mb-2">
              Your World Cup Champion
            </p>
            <p className="font-display text-5xl font-bold text-gold-400">
              {championTeam.flag} {championTeam.name}
            </p>
            <p className="text-xs text-gold-600 mt-2 font-body">
              {championTeam.confederation}
            </p>
          </div>
        )}

        {/* Group Stage */}
        <GroupStage
          groupStage={groupStage}
          thirdPlace={thirdPlace}
          thirdPlaceEligible={thirdPlaceEligible}
          completedGroups={completedGroups}
          onSelectAdvancer={selectGroupAdvancer}
          onToggleThirdPlace={toggleThirdPlace}
        />

        {/* Knockout Bracket */}
        <BracketView
          knockout={knockout}
          completedGroups={completedGroups}
          thirdPlaceCount={thirdPlace.length}
          onAdvance={advanceKnockoutTeam}
          getTeam={getTeam}
        />

        {/* Share Bar */}
        <ShareBar
          onDownload={download}
          onShare={share}
          status={status}
          canShare={canShare}
          isReady={isReady}
        />

      </main>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-pitch-800 mt-16 py-6 text-center">
        <p className="text-xs text-gray-700 font-body">
          WC2026 Bracket Predictor · For entertainment purposes only
        </p>
      </footer>

      {/* ── SharePanel (off-screen, captured by html2canvas) ── */}
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