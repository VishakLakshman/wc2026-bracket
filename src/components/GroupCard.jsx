/**
 * GroupCard.jsx — redesigned
 * advancers: [1stId, 2ndId, 3rdId]
 */

const RANK_CONFIG = [
  {
    label: "1",
    rowBg: "bg-electric-500/10 hover:bg-electric-500/15",
    textName: "text-electric-400 font-semibold",
    badge: "bg-electric-500 text-pitch-950",
    pip: "bg-electric-500",
  },
  {
    label: "2",
    rowBg: "bg-teal-500/10 hover:bg-teal-500/15",
    textName: "text-teal-400 font-semibold",
    badge: "bg-teal-500 text-pitch-950",
    pip: "bg-teal-500",
  },
  {
    label: "3",
    rowBg: "bg-ember-500/10 hover:bg-ember-500/15",
    textName: "text-ember-400 font-semibold",
    badge: "bg-ember-500 text-pitch-950",
    pip: "bg-ember-500",
  },
];

export default function GroupCard({ group, groupData, onSelectAdvancer }) {
  const { teams, advancers } = groupData;
  const full = advancers.length === 3;

  function getRank(id) {
    const i = advancers.indexOf(id);
    return i === -1 ? null : i + 1;
  }

  function isEliminated(id) {
    return full && getRank(id) === null;
  }

  return (
    <div className={[
      "rounded-xl overflow-hidden flex flex-col transition-shadow duration-200",
      "shadow-card hover:shadow-card-hover",
      full ? "grad-border" : "border border-pitch-700 bg-pitch-900",
    ].join(" ")}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-pitch-800">
        <span className="font-display text-sm font-black tracking-[0.15em] uppercase text-white">
          Group {group}
        </span>
        {/* Completion pips */}
        <div className="flex gap-1">
          {RANK_CONFIG.map((cfg, i) => (
            <div
              key={i}
              className={[
                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                advancers.length > i
                  ? cfg.pip
                  : "bg-pitch-700",
              ].join(" ")}
            />
          ))}
        </div>
      </div>

      {/* Team rows */}
      <div className="flex flex-col">
        {teams.map((team, ti) => {
          const rank       = getRank(team.id);
          const eliminated = isEliminated(team.id);
          const cfg        = rank ? RANK_CONFIG[rank - 1] : null;
          const isLast     = ti === teams.length - 1;

          return (
            <button
              key={team.id}
              onClick={() => !eliminated && onSelectAdvancer(group, team.id)}
              disabled={eliminated}
              aria-label={`${team.name}${rank ? `, ${rank}${rank===1?"st":rank===2?"nd":"rd"} place` : ""}`}
              className={[
                "flex items-center gap-2.5 px-4 py-2.5 text-left w-full",
                "transition-all duration-150 focus-electric",
                !isLast && "border-b border-pitch-800",
                cfg       ? cfg.rowBg      : "",
                eliminated ? "opacity-25 cursor-default" : "",
                !cfg && !eliminated ? "hover:bg-pitch-800/60 cursor-pointer" : "",
              ].filter(Boolean).join(" ")}
            >
              <span className="text-lg leading-none select-none w-7 text-center flex-shrink-0">
                {team.flag}
              </span>

              <span className={[
                "font-body text-sm flex-1 leading-tight truncate",
                cfg        ? cfg.textName   : "",
                eliminated ? "text-pitch-600" : "",
                !cfg && !eliminated ? "text-slate-300" : "",
              ].filter(Boolean).join(" ")}>
                {team.name}
              </span>

              {!rank && !eliminated && (
                <span className="font-mono text-xs text-pitch-600 hidden sm:block flex-shrink-0">
                  {team.confederation}
                </span>
              )}

              {rank && cfg && (
                <span
                  className={[
                    "flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center",
                    "font-display text-xs font-black leading-none",
                    "animate-badge-pop",
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

      {/* Footer */}
      {full && (
        <div className="px-4 py-2 bg-pitch-800/50 flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-electric-500" />
          <span className="font-mono text-xs text-pitch-500">
            {teams.find(t => t.id === advancers[0])?.flag}
            {teams.find(t => t.id === advancers[1])?.flag} advance
            {" · "}
            {teams.find(t => t.id === advancers[2])?.flag} pool
          </span>
        </div>
      )}
    </div>
  );
}