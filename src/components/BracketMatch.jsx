/**
 * BracketMatch.jsx
 *
 * A single knockout match card — two team slots stacked vertically.
 *
 * IMPORTANT: All sizing uses explicit inline style px values
 * (not just Tailwind classes) so html2canvas captures correct
 * dimensions. Every text container has an explicit lineHeight.
 *
 * Exported constants:
 *   SLOT_H = 32   — height of one team slot button
 *   DIV_H  = 1    — divider between slots
 *   CARD_H = 65   — total card height (2×32 + 1)
 */

export const SLOT_H = 32;
export const DIV_H  = 1;
export const CARD_H = SLOT_H * 2 + DIV_H; // 65px

function TeamSlot({ team, placeholder, isWinner, isLoser, isEmpty, onClick, ariaLabel }) {
  return (
    <button
      onClick={isEmpty ? undefined : onClick}
      disabled={isEmpty}
      aria-label={ariaLabel}
      aria-pressed={isWinner}
      style={{
        height:      SLOT_H,
        minHeight:   SLOT_H,
        maxHeight:   SLOT_H,
        boxSizing:   "border-box",
        lineHeight:  `${SLOT_H}px`,  // explicit — prevents html2canvas clipping
      }}
      className={[
        "flex items-center gap-2.5 w-full px-3 text-left flex-shrink-0 overflow-hidden",
        "transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold-400",
        isWinner  && "bg-gold-500/20 cursor-pointer hover:bg-gold-500/25",
        isLoser   && "opacity-30 cursor-pointer hover:opacity-45",
        !isWinner && !isLoser && !isEmpty && "cursor-pointer hover:bg-pitch-700",
        isEmpty   && "cursor-default",
      ].filter(Boolean).join(" ")}
    >
      {isEmpty ? (
        <span
          style={{ lineHeight: "normal" }}
          className="font-body text-xs text-gray-700 italic truncate leading-tight"
        >
          {placeholder}
        </span>
      ) : (
        <>
          <span
            style={{ lineHeight: 1, flexShrink: 0, width: 20, textAlign: "center" }}
            className="text-sm select-none"
          >
            {team.flag}
          </span>
          <span
            style={{ lineHeight: "normal" }}
            className={[
              "font-body text-xs truncate flex-1",
              isWinner ? "text-gold-300 font-semibold" : "text-gray-200",
            ].join(" ")}
          >
            {team.name}
          </span>
          {isWinner && (
            <svg
              style={{ flexShrink: 0 }}
              className="w-3 h-3 text-gold-400"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M2 19h20v2H2v-2ZM3 7l4 6 5-8 5 8 4-6v9H3V7Z" />
            </svg>
          )}
        </>
      )}
    </button>
  );
}

export default function BracketMatch({
  match,
  matchLabel,
  getTeam,
  onAdvance,
  roundKey,
  isFinal = false,
}) {
  const teamA  = getTeam(match.teamA);
  const teamB  = getTeam(match.teamB);
  const winner = match.winner;
  const emptyA = !match.teamA;
  const emptyB = !match.teamB;

  return (
    <div
      style={{
        width:     isFinal ? 176 : 160,
        height:    CARD_H,
        boxSizing: "border-box",
        flexShrink: 0,
      }}
      className={[
        "rounded-lg border overflow-hidden flex flex-col",
        "bg-pitch-900",
        winner
          ? "border-gold-500/50 shadow-[0_0_10px_rgba(229,184,32,0.1)]"
          : "border-pitch-700",
      ].join(" ")}
    >
      <TeamSlot
        team={teamA}
        placeholder={match.teamADesc ?? "TBD"}
        isWinner={winner === match.teamA && !!match.teamA}
        isLoser={!!winner && winner !== match.teamA && !!match.teamA}
        isEmpty={emptyA}
        onClick={() => onAdvance(match.teamA)}
        ariaLabel={teamA ? `${teamA.name} — click to advance` : "TBD slot"}
      />

      {/* Divider */}
      <div
        style={{ height: DIV_H, flexShrink: 0 }}
        className="bg-pitch-700"
      />

      <TeamSlot
        team={teamB}
        placeholder={match.teamBDesc ?? "TBD"}
        isWinner={winner === match.teamB && !!match.teamB}
        isLoser={!!winner && winner !== match.teamB && !!match.teamB}
        isEmpty={emptyB}
        onClick={() => onAdvance(match.teamB)}
        ariaLabel={teamB ? `${teamB.name} — click to advance` : "TBD slot"}
      />
    </div>
  );
}