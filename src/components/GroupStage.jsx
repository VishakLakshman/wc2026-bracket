import GroupCard from "./GroupCard";
import { GROUPS } from "../data/teams";
import { SectionHeader } from "../App";

// ─────────────────────────────────────────────────────────────
// PROGRESS BAR
// ─────────────────────────────────────────────────────────────

function ProgressBar({ completed, total }) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-0.5 rounded-full bg-pitch-700 overflow-hidden">
        <div
          className="h-full rounded-full bg-electric-500 transition-all duration-700"
          style={{ width: `${pct}%`, boxShadow: pct > 0 ? "0 0 8px rgba(0,255,135,0.6)" : "none" }}
        />
      </div>
      <span className="font-mono text-xs text-pitch-500 tabular-nums w-16 text-right">
        {completed}/{total} groups
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// RANK LEGEND
// ─────────────────────────────────────────────────────────────

function RankLegend() {
  const items = [
    { n: "1", color: "bg-electric-500", text: "text-electric-500", label: "Advances" },
    { n: "2", color: "bg-teal-500",     text: "text-teal-400",     label: "Advances" },
    { n: "3", color: "bg-ember-500",    text: "text-ember-400",    label: "3rd-place pool" },
  ];
  return (
    <div className="flex items-center gap-4 flex-wrap">
      {items.map(({ n, color, text, label }) => (
        <div key={n} className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded-md ${color} flex items-center justify-center`}>
            <span className="font-display text-xs font-black text-pitch-950">{n}</span>
          </div>
          <span className="font-body text-xs text-pitch-500">{label}</span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// THIRD-PLACE PANEL
// ─────────────────────────────────────────────────────────────

function ThirdPlacePanel({ eligible, selected, onToggle }) {
  const needed    = 8;
  const remaining = needed - selected.length;
  const complete  = selected.length === needed;

  return (
    <div className={[
      "rounded-2xl overflow-hidden transition-all duration-300",
      complete ? "grad-border" : "border border-pitch-700 bg-pitch-900",
    ].join(" ")}>

      {/* Header */}
      <div className="px-5 py-4 bg-pitch-800 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-1 h-4 rounded-full bg-ember-500" />
            <h3 className="font-display text-base font-black tracking-wide uppercase text-white">
              3rd-Place Qualifiers
            </h3>
          </div>
          <p className="font-body text-xs text-pitch-500 ml-3">
            Pick the 8 that advance to the Round of 32
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className={[
            "font-display text-3xl font-black leading-none tabular-nums",
            complete ? "text-electric-500" : "text-gold-400",
          ].join(" ")}>
            {selected.length}
            <span className="text-lg text-pitch-600">/{needed}</span>
          </div>
          <p className={[
            "font-mono text-xs mt-0.5",
            complete ? "text-electric-600" : "text-pitch-500",
          ].join(" ")}>
            {complete ? "COMPLETE ✓" : `${remaining} to pick`}
          </p>
        </div>
      </div>

      {/* Chips */}
      <div className="p-4">
        {eligible.length === 0 ? (
          <p className="font-body text-sm text-pitch-600 text-center py-6">
            Assign 3rd place in each group — those teams appear here
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
                  className={[
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-body",
                    "transition-all duration-150 focus-electric",
                    isSelected
                      ? "bg-electric-500/15 border border-electric-500/40 text-electric-400"
                      : atCap
                      ? "border border-pitch-700 bg-pitch-900 text-pitch-600 cursor-not-allowed opacity-40"
                      : "border border-pitch-700 bg-pitch-800 text-slate-300 hover:border-pitch-600 hover:text-white cursor-pointer",
                  ].filter(Boolean).join(" ")}
                >
                  <span className={[
                    "font-mono text-xs font-bold px-1 py-0.5 rounded",
                    isSelected ? "text-electric-500 bg-electric-500/15" : "text-pitch-500 bg-pitch-700",
                  ].join(" ")}>
                    {team.group}
                  </span>
                  <span className="text-base leading-none">{team.flag}</span>
                  <span className="truncate max-w-[100px]">{team.name}</span>
                  {isSelected && (
                    <svg className="w-3 h-3 text-electric-500 flex-shrink-0" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M10 3L5 8.5 2 5.5l-1 1 4 4 6-7-1-1z"/>
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {complete && eligible.length > needed && (
        <p className="px-5 pb-4 font-mono text-xs text-pitch-600">
          All 8 selected · deselect a team to swap
        </p>
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
  const total    = GROUPS.length;
  const allDone  = completedGroups === total;
  const readyForBracket = allDone && thirdPlace.length === 8;

  return (
    <section className="space-y-6">
      <SectionHeader
        step="01"
        title="Group Stage"
        badge="pick 1st · 2nd · 3rd per group"
        rightSlot={
          allDone && (
            <span className="flex items-center gap-1.5 font-mono text-xs text-electric-500 animate-fade-up">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z"/>
              </svg>
              ALL GROUPS DONE
            </span>
          )
        }
      />

      <div className="space-y-3">
        <ProgressBar completed={completedGroups} total={total} />
        <RankLegend />
      </div>

      {/* Group cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {GROUPS.map((g) => (
          <GroupCard
            key={g}
            group={g}
            groupData={groupStage[g]}
            onSelectAdvancer={onSelectAdvancer}
          />
        ))}
      </div>

      {/* Third-place panel */}
      {thirdPlaceEligible.length > 0 && (
        <ThirdPlacePanel
          eligible={thirdPlaceEligible}
          selected={thirdPlace}
          onToggle={onToggleThirdPlace}
        />
      )}

      {/* CTA */}
      {readyForBracket && (
        <div className="flex items-center gap-4 px-5 py-4 rounded-xl border border-electric-500/20 bg-electric-500/5 animate-fade-up">
          <div className="w-8 h-8 rounded-full bg-electric-500/15 border border-electric-500/30 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-electric-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <p className="font-body text-sm text-electric-400">
            Group stage complete — fill out the knockout bracket below
          </p>
        </div>
      )}
    </section>
  );
}