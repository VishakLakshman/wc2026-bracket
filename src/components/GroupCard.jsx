/**
 * GroupCard.jsx
 *
 * Displays one FIFA group (e.g. "Group A") with its 4 teams.
 *
 * Clicking cycles through ranks:
 *   Click 1st team  → marked "1st" (green)
 *   Click 2nd team  → marked "2nd" (teal)
 *   Click 3rd team  → marked "3rd" (amber) — goes into the 3rd-place pool
 *   4th remaining team → automatically shown as eliminated (dimmed)
 *
 * Clicking a ranked team again deselects it, shifting the others down.
 * When all 3 are chosen and you click a 4th, the 3rd-place pick swaps.
 *
 * advancers: [1stId, 2ndId, 3rdId]  (length 0-3)
 */

const RANK_CONFIG = [
  { label: "1st", bgRow: "bg-grass-500/15 hover:bg-grass-500/20", textName: "text-grass-300 font-semibold", badge: "bg-grass-500 text-pitch-950" },
  { label: "2nd", bgRow: "bg-teal-500/15  hover:bg-teal-500/20",  textName: "text-teal-300  font-semibold", badge: "bg-teal-500  text-pitch-950" },
  { label: "3rd", bgRow: "bg-amber-500/12 hover:bg-amber-500/18", textName: "text-amber-300 font-semibold", badge: "bg-amber-500 text-pitch-950" },
];

export default function GroupCard({ group, groupData, onSelectAdvancer }) {
  const { teams, advancers } = groupData;
  const full = advancers.length === 3; // all 3 ranks filled

  function getRank(teamId) {
    const idx = advancers.indexOf(teamId);
    return idx === -1 ? null : idx + 1; // 1, 2, or 3
  }

  function isEliminated(teamId) {
    // 4th team = group full AND this team has no rank
    return full && getRank(teamId) === null;
  }

  // Completion pips: 3 dots for ranks 1/2/3
  const pipColors = ["bg-grass-500", "bg-teal-500", "bg-amber-500"];

  return (
    <div className="rounded-xl overflow-hidden border border-pitch-700 bg-pitch-900 flex flex-col">

      {/* ── Group Header ─────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-pitch-800 border-b border-pitch-700">
        <span className="font-display text-sm font-bold tracking-widest uppercase text-white">
          Group {group}
        </span>
        {/* 3 completion pips */}
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={[
                "w-2 h-2 rounded-full transition-colors duration-300",
                advancers.length > i ? pipColors[i] : "bg-pitch-600",
              ].join(" ")}
            />
          ))}
        </div>
      </div>

      {/* ── Team Rows ─────────────────────────────────── */}
      <div className="flex flex-col divide-y divide-pitch-800">
        {teams.map((team) => {
          const rank       = getRank(team.id);     // 1 | 2 | 3 | null
          const eliminated = isEliminated(team.id);
          const cfg        = rank ? RANK_CONFIG[rank - 1] : null;

          return (
            <button
              key={team.id}
              onClick={() => !eliminated && onSelectAdvancer(group, team.id)}
              disabled={eliminated}
              aria-label={`${team.name} — Group ${group}${rank ? `, ${cfg.label} place` : ""}`}
              className={[
                "relative flex items-center gap-3 px-4 py-2.5 text-left w-full",
                "transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grass-500 focus-visible:ring-inset",
                cfg   && cfg.bgRow,
                eliminated && "opacity-30 cursor-default",
                !cfg && !eliminated && "hover:bg-pitch-800 cursor-pointer",
              ].filter(Boolean).join(" ")}
            >
              {/* Flag */}
              <span className="text-xl leading-none select-none w-7 text-center flex-shrink-0">
                {team.flag}
              </span>

              {/* Name */}
              <span className={[
                "font-body text-sm flex-1 leading-tight",
                cfg        && cfg.textName,
                eliminated && "text-gray-600",
                !cfg && !eliminated && "text-gray-200",
              ].filter(Boolean).join(" ")}>
                {team.name}
              </span>

              {/* Confederation — only on unranked rows */}
              {!rank && !eliminated && (
                <span className="text-xs text-gray-600 font-body flex-shrink-0 hidden sm:block">
                  {team.confederation}
                </span>
              )}

              {/* Rank badge */}
              {rank && (
                <span
                  className={[
                    "flex-shrink-0 w-8 h-5 rounded flex items-center justify-center",
                    "font-display text-xs font-bold leading-none",
                    cfg.badge,
                  ].join(" ")}
                  aria-hidden="true"
                >
                  {cfg.label}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Group Footer ─────────────────────────────── */}
      {full && (
        <div className="px-4 py-2 bg-pitch-800/40 border-t border-pitch-700 flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-grass-600 font-body">✓</span>
          <span className="text-xs text-gray-600 font-body">
            {teams.find(t => t.id === advancers[0])?.flag} {teams.find(t => t.id === advancers[1])?.flag} advance
            · {teams.find(t => t.id === advancers[2])?.flag} in 3rd-place pool
          </span>
        </div>
      )}
    </div>
  );
}