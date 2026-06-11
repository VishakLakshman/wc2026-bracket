/**
 * GroupStage.jsx
 *
 * Full Group Stage section:
 *   1. Progress bar — X/12 groups complete (group = all 3 ranks picked)
 *   2. 12 GroupCards in a responsive grid (click to assign 1st/2nd/3rd)
 *   3. Third-Place Qualifiers panel — pick 8 of the eligible 3rd-place teams
 */

import GroupCard from "./GroupCard";
import { GROUPS } from "../data/teams";

// ─────────────────────────────────────────────────────────────
// PROGRESS BAR
// ─────────────────────────────────────────────────────────────

function ProgressBar({ completed, total }) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 rounded-full bg-pitch-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-grass-600 to-grass-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-display text-xs tracking-wider text-gray-400 tabular-nums whitespace-nowrap">
        {completed} / {total}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// RANK LEGEND
// ─────────────────────────────────────────────────────────────

function RankLegend() {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {[
        { label: "1st — advances",          dot: "bg-grass-500" },
        { label: "2nd — advances",          dot: "bg-teal-500"  },
        { label: "3rd — enters pool below", dot: "bg-amber-500" },
      ].map(({ label, dot }) => (
        <div key={label} className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${dot}`} />
          <span className="text-xs text-gray-500 font-body">{label}</span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// THIRD-PLACE QUALIFIER PANEL
// ─────────────────────────────────────────────────────────────

function ThirdPlacePanel({ eligible, selected, onToggle }) {
  const needed    = 8;
  const remaining = needed - selected.length;

  return (
    <div className="rounded-xl border border-pitch-700 bg-pitch-900 overflow-hidden">

      {/* Panel header */}
      <div className="px-5 py-3.5 bg-pitch-800 border-b border-pitch-700 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-sm font-bold tracking-widest uppercase text-white">
            Third-Place Qualifiers
          </h3>
          <p className="text-xs text-gray-500 font-body mt-0.5">
            Pick the 8 best 3rd-place teams that advance to the Round of 32
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className={[
            "font-display text-2xl font-bold leading-none",
            selected.length === needed ? "text-grass-400" : "text-gold-400",
          ].join(" ")}>
            {selected.length}<span className="text-base text-gray-600">/{needed}</span>
          </div>
          {selected.length < needed
            ? <p className="text-xs text-gray-500 mt-0.5">Pick {remaining} more</p>
            : <p className="text-xs text-grass-600 mt-0.5">Complete ✓</p>
          }
        </div>
      </div>

      {/* Team chips */}
      <div className="p-4">
        {eligible.length === 0 ? (
          <p className="text-sm text-gray-600 text-center py-4 font-body">
            Assign 3rd place in each group above — those teams appear here
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {eligible.map((team) => {
              const isSelected = selected.includes(team.id);
              const atCap      = selected.length >= needed && !isSelected;

              return (
                <button
                  key={team.id}
                  onClick={() => !atCap && onToggle(team.id)}
                  disabled={atCap}
                  aria-pressed={isSelected}
                  aria-label={`${team.name} — 3rd place Group ${team.group}${isSelected ? ", selected" : ""}`}
                  className={[
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-body",
                    "transition-all duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grass-500",
                    isSelected
                      ? "border-grass-500/60 bg-grass-500/15 text-grass-300"
                      : atCap
                      ? "border-pitch-700 bg-pitch-800/40 text-gray-700 cursor-not-allowed"
                      : "border-pitch-700 bg-pitch-800 text-gray-300 hover:border-pitch-500 hover:text-white cursor-pointer",
                  ].filter(Boolean).join(" ")}
                >
                  <span className={[
                    "font-display text-xs font-bold px-1 rounded",
                    isSelected ? "text-grass-400 bg-grass-500/20" : "text-gray-500 bg-pitch-700",
                  ].join(" ")}>
                    {team.group}
                  </span>
                  <span className="text-base leading-none">{team.flag}</span>
                  <span>{team.name}</span>
                  {isSelected && (
                    <svg className="w-3.5 h-3.5 text-grass-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selected.length === needed && eligible.length > needed && (
        <div className="px-4 pb-4">
          <p className="text-xs text-gray-600 font-body">
            All 8 selected. Deselect a team to swap your pick.
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────

export default function GroupStage({
  groupStage,
  thirdPlace,
  thirdPlaceEligible,
  completedGroups,
  onSelectAdvancer,
  onToggleThirdPlace,
}) {
  const totalGroups = GROUPS.length; // 12

  return (
    <section className="space-y-6">

      {/* ── Section Header ─────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-white">
              Group Stage
            </h2>
            <span className="font-display text-xs px-2.5 py-1 rounded-full bg-pitch-800 text-gray-400 tracking-widest uppercase border border-pitch-700">
              Pick 1st · 2nd · 3rd per group
            </span>
          </div>

          {completedGroups === totalGroups && (
            <span className="flex items-center gap-1.5 text-xs font-body text-grass-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              All groups complete
            </span>
          )}
        </div>

        <ProgressBar completed={completedGroups} total={totalGroups} />
        <RankLegend />
      </div>

      {/* ── Group Cards Grid ───────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {GROUPS.map((g) => (
          <GroupCard
            key={g}
            group={g}
            groupData={groupStage[g]}
            onSelectAdvancer={onSelectAdvancer}
          />
        ))}
      </div>

      {/* ── Third-Place Panel ──────────────────────── */}
      {thirdPlaceEligible.length > 0 && (
        <div className="pt-2">
          <ThirdPlacePanel
            eligible={thirdPlaceEligible}
            selected={thirdPlace}
            onToggle={onToggleThirdPlace}
          />
        </div>
      )}

      {/* ── CTA once everything is complete ────────── */}
      {completedGroups === totalGroups && thirdPlace.length === 8 && (
        <div className="rounded-xl border border-gold-500/30 bg-gold-500/5 px-5 py-4 flex items-center gap-3">
          <span className="text-xl">⚽</span>
          <p className="text-sm font-body text-gold-300">
            Group stage complete! Scroll down to fill out the Knockout Bracket.
          </p>
          <svg className="w-4 h-4 text-gold-400 ml-auto flex-shrink-0 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      )}
    </section>
  );
}