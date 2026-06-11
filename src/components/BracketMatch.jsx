/**
 * BracketMatch.jsx
 *
 * A single knockout match card showing two team slots.
 * Each slot can be: empty | default | winner | loser
 *
 * IMPORTANT — fixed pixel heights so BracketRound math is exact:
 *   SLOT_H  = 32px per team slot
 *   DIV_H   = 1px divider
 *   TOTAL_H = 65px  (2 × 32 + 1)
 *
 * These constants are exported so BracketRound can import them.
 */

export const SLOT_H  = 32; // px — height of one TeamSlot button
export const DIV_H   = 1;  // px — divider between slots
export const CARD_H  = SLOT_H * 2 + DIV_H; // 65px

function TeamSlot({ team, placeholder, isWinner, isLoser, isEmpty, onClick, ariaLabel }) {
  return (
    <button
      onClick={isEmpty ? undefined : onClick}
      disabled={isEmpty}
      aria-label={ariaLabel}
      aria-pressed={isWinner}
      style={{ height: SLOT_H, minHeight: SLOT_H, maxHeight: SLOT_H }}
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
        <span className="font-body text-xs text-gray-700 italic truncate leading-tight">
          {placeholder}
        </span>
      ) : (
        <>
          <span className="text-sm leading-none select-none flex-shrink-0 w-5 text-center">
            {team.flag}
          </span>
          <span className={[
            "font-body text-xs leading-tight truncate flex-1",
            isWinner ? "text-gold-300 font-semibold" : "text-gray-200",
          ].join(" ")}>
            {team.name}
          </span>
          {isWinner && (
            <svg className="w-3 h-3 text-gold-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
      style={{ width: isFinal ? 176 : 160, height: CARD_H }}
      className={[
        "rounded-lg border overflow-hidden flex flex-col flex-shrink-0",
        "bg-pitch-900",
        winner
          ? "border-gold-500/50 shadow-[0_0_10px_rgba(229,184,32,0.1)]"
          : "border-pitch-700",
      ].join(" ")}
    >
      {/* Team A */}
      <TeamSlot
        team={teamA}
        placeholder={match.teamADesc ?? "TBD"}
        isWinner={winner === match.teamA && !!match.teamA}
        isLoser={!!winner && winner !== match.teamA && !!match.teamA}
        isEmpty={emptyA}
        onClick={() => onAdvance(match.teamA)}
        ariaLabel={teamA ? `${teamA.name} — click to advance` : `TBD slot`}
      />

      {/* Divider */}
      <div style={{ height: DIV_H }} className="bg-pitch-700 flex-shrink-0" />

      {/* Team B */}
      <TeamSlot
        team={teamB}
        placeholder={match.teamBDesc ?? "TBD"}
        isWinner={winner === match.teamB && !!match.teamB}
        isLoser={!!winner && winner !== match.teamB && !!match.teamB}
        isEmpty={emptyB}
        onClick={() => onAdvance(match.teamB)}
        ariaLabel={teamB ? `${teamB.name} — click to advance` : `TBD slot`}
      />
    </div>
  );
}